const authResolver= require('./authuser')
const blogsResolver= require('./blogs') 
const highlightResolver= require('./highlight')

const rootResolver = {
    ...authResolver,
    ...blogsResolver,
    ...highlightResolver
}

module.exports = rootResolver;