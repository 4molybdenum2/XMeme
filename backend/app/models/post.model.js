const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    name: String,
    title: String,
    url: String,
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('Post', PostSchema);
