const {
    transformBlog
} = require('./merge');
const User = require('../../models/user');


const Blog = require('../../models/blog');

module.exports = {
    blogs: async () => {
        try {
            const blogs = await Blog.find()
            return blogs.map(blog => {
                return transformBlog(blog)
            });
        } catch (err) {
            throw err;
        }
    },
    createBlog: async (args, req) => {
        if (req.isAuth) {
            throw new Error('Unauthenticated')
        }
        const blog = new Blog({
            title: args.blogInput.title,
            description: args.blogInput.description,
            date: new Date(args.blogInput.date),
            rating: args.blogInput.rating,
            creator: req.userId
        });
        let createdBlog;
        try {
            const result = await blog.save()
            createdBlog = transformBlog(result)
            const creator = await User.findById(req.userId);
            if (!creator) {
                throw new Error('User not found');
            }
            creator.createdBlogs.push(blog);
            await creator.save();
            return createdBlog;
        } catch (err) {
            throw err;
        }


    },


}