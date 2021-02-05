const Post = require('../models/post.model.js');


// Create and Save a new post
exports.create = async (req, res) => {
    // Validate request
    if(!req.body)
        res.status(400).json({message: "Post content can not be empty"});

    // Create a post
    const post = new Post({
        name: req.body.name || "Anonymous", 
        caption: req.body.caption,
        url: req.body.url
    });

    // Save post in the database
    try{
        const Post = await post.save();
        res.json({id: Post._id})
    }
    catch(err){
        res.status(500).json({message : (err || "Some error occured while creating the post!")})
    }
    
};

// Retrieve and return all posts from the database.
exports.findAll = async (req, res) => {
    try{
        const Posts = await Post.find().sort({createdAt: -1}).limit(100);
        res.json(Posts);
    }
    catch(err){
        res.status(500).json({message : (err || "Some error occurred while retrieving posts.")})
    }
};

// Find a single post with a postId
exports.findOne = async (req, res) => {
    try{
        const singlePost = await Post.findById(req.params.postId);
        if(!singlePost)
            res.status(404).json({message: "Not found Post with Post ID: "+req.params.postId});
        else
            res.json(singlePost);
    }
    catch(err){
        if(err.kind == 'ObjectId')
            res.status(404).json({message: "Not found Post with Post ID: "+req.params.postId})
        else
            res.status(500).json({message: (err || "Some kind of error while retrieving the post!")});
    }
};

// Update a post identified by the postId in the request
exports.update = async (req, res) => {
// Validate Request
    if(!req.body)
        res.status(400).json({message: "Post content can not be empty"});

    // Find post and update it with the request body
    const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {
        caption: req.body.caption,
        url: req.body.url
    },
    {new: true});

    try{
        if(!updatedPost){
            res.status(404).json({message: "Post not found with ID: "+req.params.postId});
        }
        else
            res.json({
                caption: updatedPost.caption,
                url: updatedPost.url
            });
    }
    catch(err){
        if(err.kind == 'ObjectId'){
            res.status(404).json({message: "Post not found with ID: "+req.params.postId});
        }
        else{
            res.status(500).json({message: (err || "Some kind of error while updating the post!")});
        }
    }
};

// Delete a post with the specified postId in the request
exports.delete = async (req, res) => {
    const deletedPost = await Post.findByIdAndRemove(req.params.postId)
    try{
        if(!deletedPost){
            res.status(404).json({message: "Post not found with ID: "+req.params.postId});
        }
        else{
            res.json({message: "Post deleted with ID: "+req.params.postId});
        }
    }
    catch(err){
        if(err.kind == 'ObjectId'){
            res.status(404).json({message: "Post not found with ID: "+req.params.postId});
        }
        else{
            res.status(500).json({message: (err || "Some kind of error while updating the post!")});
        }
    }
};
