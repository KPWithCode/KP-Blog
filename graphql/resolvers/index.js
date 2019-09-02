const bcrypt = require('bcryptjs');
const Blog = require('../../models/blog');
const User = require('../../models/user');
const Highlight = require('../../models/highlight');

const blogs = async blogIds => {
    try {
        const blogs = await Blog.find({
            _id: {
                $in: blogIds
            }
        });
        blogs.map(blog => {
            return {
                ...blog._doc,
                id: blog.id,
                date: new Date(blog._doc.date).toISOString(),
                creator: user.bind(this, blog.creator)
            }
        })
        return blogs
    } catch (err) {
        throw err;
    }
}
const singleBlog = async blogId => {
    try {
        const blog = await Blog.findById(blogId);
        return {
            ...blog._doc,
            _id: blog.id,
            creator: user.bind(this, blog.creator)
        }
    } catch (err) {
        throw err;
    }
}
const user = async userid => {
    try {
        const user = await User.findById(userid)
        return {
            ...user._doc,
            _id: user.id,
            createdBlogs: blogs.bind(this, user._doc.createdBlogs)
        };

    } catch (err) {
        throw err;
    }
}

module.exports = {
    blogs: async () => {
        try {
            const blogs = await Blog.find()
            return blogs.map(blog => {
                return {
                    ...blog._doc,
                    _id: blog.id,
                    date: new Date(blog._doc.date).toISOString(),
                    creator: user.bind(this, blog._doc.creator)
                };
            });
        } catch (err) {
            throw err;
        }
    },
    highlights: async () => {
        try {
            const highlights = await Highlight.find();
            return highlights.map(highlight => {
                return {
                    ...highlight._doc,
                    _id: highlight.id,
                    user: user.bind(this, highlight._doc.user),
                    blog: singleBlog.bind(this, highlight._doc.blog),
                    createdAt: new Date(highlight._doc.createdAt).toISOString(),
                    udpatedAt: new Date(highlight._doc.updatedAt).toISOString()
                };
            });
        } catch (err) {
            throw err;
        }
    },
    createBlog: async args => {
        const blog = new Blog({
            title: args.blogInput.title,
            description: args.blogInput.description,
            date: new Date(args.blogInput.date),
            rating: args.blogInput.rating,
            creator: '5d6b5b3b3aff0179750a5d77'
        });
        let createdBlog;
        try {
            const result = await blog.save()
            createdBlog = {
                ...result._doc,
                _id: result._doc._id.toString(),
                date: new Date(blog._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator)
            };
            const creator = await User.findById('5d6b5b3b3aff0179750a5d77');
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
    createUser: async args => {
        try {
            const existingUser = await User.findOne({
                email: args.userInput.email
            })
            if (existingUser) {
                throw new Error('User exists Already');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            const result = await user.save();

            return {
                // Password set to null so it does not return even the hashed pass
                ...result._doc,
                password: null,
                _id: result.id
            }
        } catch (err) {
            throw err
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
        return {
            ...result._doc,
            _id: result.id,
            user: user.bind(this, highlight._doc.user),
            blog: singleBlog.bind(this, highlight._doc.blog),
            createdAt: new Date(result._doc.createdAt).toISOString(),
            udpatedAt: new Date(result._doc.updatedAt).toISOString()
        }
    },
    cancelHighlight: async args => {
        try {
            const highlight = await Highlight.findById(args.highlightId).populate('blog')
            const blog = {
                ...highlight.blog._doc,
                _id: highlight.blog.id,
                creator: user.bind(this, highlight.blog._doc.creator)
            }
            await Highlight.deleteOne({
                _id: args.highlightId
            })
            return blog;
        } catch (err) {
            throw err;
        }
    }

}