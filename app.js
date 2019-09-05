const express = require('express');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const isAuth =require('./middleware/auth')
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const app = express();
app.use(express.json());
// Allows my server to accept Cross origin requests
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
})
app.use(isAuth);

app.use('/graphql', graphqlHttp({
    // String! <- exclamation point means it will always return list of string 
    // NEVER NULL
    // Name RootQuery how you name properties ie. not getblogs
    // Name Rootmutation as you name a function
    schema: graphQlSchema,
    // Resolver
    rootValue: graphQlResolvers,
    graphiql: true
}));

mongoose
    .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@blogcluster-1pxfe.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`).then(() => {
        app.listen(8000);
    })
    .catch(err => {
        console.log(err);
    });