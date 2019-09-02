const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const highlightSchema = new Schema({
    blog: {
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Highlight', highlightSchema);