 const { buildSchema } = require('graphql');

 module.exports = buildSchema(`
 type Blog {
     _id: ID!
     title: String!
     description: String!
     date: String!
     rating: Float!
     creator: User!
 }

 type User {
     _id:ID!
     email: String!
     password: String
     createdBlogs:[Blog!]
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
`)