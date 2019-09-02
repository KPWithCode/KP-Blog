const bcrypt = require('bcryptjs');
const Blog = require('../../models/blog');
const User = require('../../models/user');
const Highlight = require('../../models/highlight');
const { dateToString } = require('../../helpers/date')

const transformBlog = blog => {
    return {
        ...blog._doc,
        id: blog.id,
        date: dateToString(blog._doc.date),
        creator: user.bind(this, blog.creator)

    }
}
const transformHighlight = highlight => {
    return {
        ...highlight._doc,
        _id: highlight.id,
        user: user.bind(this, highlight._doc.user),
        blog: singleBlog.bind(this, highlight._doc.blog),
        createdAt:dateToString(highlight._doc.createdAt),
        udpatedAt:dateToString(highlight._doc.updatedAt)
    };
}

const blogs = async blogIds => {
    try {
        const blogs = await Blog.find({
            _id: {
                $in: blogIds
            }
        });
        return blogs.map(blog => {
            return transformBlog(blog)
            
        })
    } catch (err) {
        throw err;
    }
}
const singleBlog = async blogId => {
    try {
        const blog = await Blog.findById(blogId);
        return transformBlog(blog)
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
                return transformBlog(blog)
            });
        } catch (err) {
            throw err;
        }
    },
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
            createdBlog = transformBlog(result)
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