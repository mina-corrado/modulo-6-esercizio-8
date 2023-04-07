const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    title: {type: String, required: true},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Autore"
    },
    content: {type: String, required: true},
    blogpost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BlogPost',
    }
});

module.exports = mongoose.model('Comment', commentSchema);