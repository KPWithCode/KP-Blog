const express = require('express');
const graphqlHttp = require('express-graphql');
const {
    buildSchema
} = require('graphql');
const mongoose = require('mongoose');

const Blog = require('./models/blog');


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
            createBlogs(blogInput: BlogInput): Blog
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
                            ...blog._doc,_id: blog.id
                        };
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        },
        createBlogs: args => {
            const blog = new Blog({
                title: args.blogInput.title,
                description: args.blogInput.description,
                date: args.blogInput.date,
                rating: new Date(args.blogInput.rating)
            });
            return blog
                .save().then(result => {
                    console.log(result);
                    return {
                        ...result._doc
                    };
                }).catch(err => {
                    console.log(err);
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