const { aggregate } = require('../models/post.model.js');
const Post = require('../models/post.model.js');

// creating a definition for swagger

 // Create and Save a new post
/**
 * @swagger
 * /memes:
 *  post:
 *   summary: create a post
 *   description: create a meme as a post
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: body
 *      name: Post
 *      schema:
 *       type: object
 *       properties:
 *        name:
 *         type: string
 *         example: Neil
 *        caption:
 *         type: string
 *         example: 'This is a meme'
 *        url:
 *         type: string
 *         example: 'https://images.pexels.com/photos/6104650/pexels-photo-6104650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
 *   responses:
 *    200:
 *     description: Post created successfully
 *    400:
 *     description: Post content cannot be empty
 *    500:
 *     description: Some error while creating the post
 */
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

/**
 * @swagger
 * /memes:
 *  get:
 *   summary: get all the posts from the database
 *   description: get all the memes which are posts from the database
 *   responses:
 *    200:
 *     description: Success
 *    500:
 *     description: Some error while retrieving posts
 */

exports.findAll = async (req, res) => {
    try{
        const Posts = await Post.aggregate([{$sort: { createdAt: -1}} , { $project: { _id:0, id:'$_id',name: '$name',caption:'$caption',url:'$url'}}])
        res.json(Posts)
    }
    catch(err){
        res.status(500).json({message : (err || "Some error occurred while retrieving posts.")})
    }
};

// Find a single post with a postId

/**
 * @swagger
 * /memes/{id}:
 *  get:
 *   summary: get post with given id as parameter
 *   description: get meme as post with given id as a parameter
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      type: string
 *      description: the user id
 *   responses:
 *    200:
 *     description: Success
 *    500:
 *     description: Some error while retrieving post
 */

exports.findOne = async (req, res) => {
    try{
        const singlePost = await Post.findById(req.params.postId);
        if(!singlePost)
            res.status(404).json({message: "Not found Post with Post ID: "+req.params.postId});
        else
            res.json({
                id: singlePost._id,
                name: singlePost.name,
                caption: singlePost.caption,
                url: singlePost.url
            });
    }
    catch(err){
        if(err.kind == 'ObjectId')
            res.status(404).json({message: "Not found Post with Post ID: "+req.params.postId})
        else
            res.status(500).json({message: (err || "Some kind of error while retrieving the post!")});
    }
};

// Update a post identified by the postId in the request

/**
 * @swagger
 * /memes/{id}:
 *  patch:
 *   summary: update a post
 *   description: update a meme as a post
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      type: string
 *      description: the user id
 *    - in: body
 *      name: updatePost
 *      schema:
 *       type: object
 *       properties:
 *        caption:
 *         type: string
 *         example: 'This is a meme'
 *        url:
 *         type: string
 *         example: 'https://images.pexels.com/photos/6104650/pexels-photo-6104650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
 *   responses:
 *    200:
 *     description: Success
 *    400:
 *      description: Patch content cannot be empty
 *    404:
 *     description: Post not found with given id
 *    500:
 *     description: Some kind of error while updating the post
 */  


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

/**
 * @swagger
 * /memes/{id}:
 *  delete:
 *   summary: delete a post from the database
 *   description: delete a meme as a post fromt the database
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      type: string
 *      description: the user id
 *   responses:
 *    200:
 *     description: Success
 *    500:
 *     description: Some error while deleting the post
 */

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
