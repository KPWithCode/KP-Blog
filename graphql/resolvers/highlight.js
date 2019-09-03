const {
    transformBlog,
    transformHighlight
} = require('./merge')
const Highlight = require('../../models/blog');




module.exports = {

    highlights: async (args, req) => {
        if (req.isAuth) {
            throw new Error('Unauthenticated')
        }
        try {
            const highlights = await Highlight.find();
            return highlights.map(highlight => {
                return transformHighlight(highlight)
            });
        } catch (err) {
            throw err;
        }
    },

    highlightBlog: async (args, req) => {
        if (req.isAuth) {
            throw new Error('Unauthenticated')
        }
        const fetchedBlog = await Blog.findOne({
            _id: args.blogId
        })
        const highlight = new Highlight({
            user: req.userId,
            blog: fetchedBlog
        });
        const result = await highlight.save();
        return transformHighlight(result)
    },
    cancelHighlight: async (args, req) => {
        if (req.isAuth) {
            throw new Error('Unauthenticated')
        }
        try {
            const highlight = await Highlight.findById(args.highlightId).populate('blog')
            const blog = transformBlog(highlight.blog)
            await Highlight.deleteOne({
                _id: args.highlightId
            })
            return blog;
        } catch (err) {
            throw err;
        }
    }

}