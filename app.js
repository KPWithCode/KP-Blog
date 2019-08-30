const express = require('express');
const graphqlHttp = require('express-graphql');
const {
    buildSchema
} = require('graphql');
const app = express();

app.use(express.json());


app.use('/graphql', graphqlHttp({
    // String! <- exclamation point means it will always return list of string 
    // NEVER NULL
    // Name RootQuery how you name properties ie. not getblogs
    // Name Rootmutation as you name a function
    schema: buildSchema(`
        type RootQuery {
            blogs: [String!]!
        }

        type RootMutation {
            createBlogs(title:String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        } 
    `),
    rootValue: {
        blogs: () => {
            return ['Outdoors', 'Late Night Coding Sess', 'Gaming', 'Sports', 'Cryptocurrency'];
        },
        createBlogs: (args) => {
            const blogTitle = args.title;
            return blogTitle;
        }
    },
    graphiql: true
}));

app.listen(3000);