const {transformBlog,transformHighlight} = require('./merge')
const Highlight = require('../../models/blog');




module.exports = {
   
    highlights: async () => {
        try {
            const highlights = await Highlight.find();
            return highlights.map(highlight => {
              return transformHighlight(highlight)
            });
        } catch (err) {
            throw err;
        }
    },
  
    highlightBlog: async args => {
        const fetchedBlog = await Blog.findOne({
            _id: args.blogId
        })
        const highlight = new Highlight({
            user: '5d6b5b3b3aff0179750a5d77',
            blog: fetchedBlog
        });
        const result = await highlight.save();
        return transformHighlight(result)
    },
    cancelHighlight: async args => {
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