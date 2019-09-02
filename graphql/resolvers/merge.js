const Blog = require('../../models/blog');
const User = require('../../models/user');
const {
    dateToString
} = require('../../helpers/date');

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

exports.transformBlog = transformBlog;
exports.transformHighlight = transformHighlight;
// exports.user = user;
// exports.blog = blog;
// exports.singleBlog = singleBlog;