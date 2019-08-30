const express = require('express');
const graphqlHttp = require('express-graphql');
const bcrypt = require('bcryptjs');
const {
    buildSchema
} = require('graphql');
const mongoose = require('mongoose');



const Blog = require('./models/blog');
const User = require('./models/user');

const app = express();
app.use(express.json());

app.use('/graphql', graphqlHttp({
    // String! <- exclamation point means it will always return list of string 
    // NEVER NULL
    // Name RootQuery how you name properties ie. not getblogs
    // Name Rootmutation as you name a function
    schema: buildSchema(`
        type Blog {
            _id: ID!
            title: String!
            description: String!
            date: String!
            rating: Float!
        }

        type User {
            _id:ID!
            email: String!
            password: String
        }

        input BlogInput {
            title: String!
            description: String!
            date: String!
            rating:Float!
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            blogs: [Blog!]!
        }

        type RootMutation {
            createBlog(blogInput: BlogInput): Blog
            createUser(userInput:UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        } 
    `),
    // Resolver
    rootValue: {
        blogs: () => {
            return Blog.find()
                .then(blogs => {
                    return blogs.map(blog => {
                        return {
                            ...blog._doc,
                            _id: blog.id
                        };
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        },
        createBlog: args => {
            const blog = new Blog({
                title: args.blogInput.title,
                description: args.blogInput.description,
                date: args.blogInput.date,
                rating: new Date(args.blogInput.rating),
                creator: '5d6975839a8b174f9d2204eb'
            });
            let createdBlog;
            return blog
                .save()
                .then(result => {
                    createdBlog = {
                        ...result._doc,
                        _id: result._doc._id.toString()
                    };
                    return User.findById('5d6975839a8b174f9d2204eb');

                }).then(user => {
                    if (!user) {
                        throw new Error('User not found');
                    }
                    user.createdBlogs.push(blog);
                    return user.save();
                })
                .then(result => {
                    return createdBlog;
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
        },
        createUser: args => {
            return User.findOne({
                    email: args.userInput.email
                })
                .then(user => {
                    if (user) {
                        throw new Error('User exists Already');
                    }
                    return bcrypt.hash(args.userInput.password, 12);
                })
                .then(hashedPassword => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword
                    });
                    return user.save();
                })
                .then(result => {
                    return {
                        // Password set to null so it does not return even the hashed pass
                        ...result._doc,
                        password: null,
                        _id: result.id
                    };
                })
                .catch(err => {
                    throw err;
                });
        }
    },
    graphiql: true
}));

mongoose
    .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@blogcluster-1pxfe.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`).then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });