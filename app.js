const express = require('express');
const graphqlHttp = require('express-graphql');
const {
    buildSchema
} = require('graphql');
const app = express();
app.use(express.json());
const blogs = [];

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

        input BlogInput {
            title: String!
            description: String!
            date: String!
            rating:Float!
        }

        type RootQuery {
            blogs: [Blog!]!
        }

        type RootMutation {
            createBlogs(blogInput: BlogInput): Blog
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        } 
    `),
    // Resolver
    rootValue: {
        blogs: () => {
            return blogs;
        },
        createBlogs: (args) => {
            const blog = {
                _id: Math.random().toString(),
                title: args.blogInput.title,
                description: args.blogInput.description,
                date: args.blogInput.date,
                rating: args.blogInput.rating
            };
            blogs.push(blog);
            return blog;
        }
    },
    graphiql: true
}));

app.listen(3000);