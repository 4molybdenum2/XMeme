const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
        name: {
            type: String,
            required: true
        },

        caption:{
            type: String,
            required: true
        },

        url:{
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    });

module.exports = mongoose.model('Post', PostSchema);
