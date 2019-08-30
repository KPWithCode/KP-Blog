const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    createdBlogs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Blog'
        },
    ]
});
module.exports = mongoose.model('User',userSchema);