 const {
     buildSchema
 } = require('graphql');

 module.exports = buildSchema(`

type Highlight {
    _id: ID!
    blog: Blog!
    user: User!
    createdAt: String!
    updatedAt: String!
}


 type Blog {
     _id: ID!
     title: String!
     description: String!
     rating: Float!
     date: String!
     creator: User!
 }

 type User {
     _id:ID!
     email: String!
     password: String
     createdBlogs:[Blog!]
 }

 type AuthData {
     userId: ID!
     token: String!
     tokenExpiration:Int!
 }

 input BlogInput {
     title: String!
     description: String!
     rating: Float!
     date:  String!
 }

 input UserInput {
     email: String!
     password: String!
 }

 type RootQuery {
     blogs: [Blog!]!
     highlights:[Highlight!]!
     login(email:String!, password:String!): AuthData!
 }

 type RootMutation {
     createBlog(blogInput: BlogInput): Blog
     createUser(userInput: UserInput): User
     highlightBlog(blogId: ID!): Highlight!
     cancelHighlight(highlightId: ID!): Blog!
 }

 schema {
     query: RootQuery
     mutation: RootMutation
 } 
`)