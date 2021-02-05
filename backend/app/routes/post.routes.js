module.exports = (app) => {
    const posts = require('../controllers/post.controller.js');

    // Create a new Post
    app.post('/memes', posts.create);

    // Retrieve all posts
    app.get('/memes', posts.findAll);

    // Retrieve a single Post with postId
    app.get('/memes/:postId', posts.findOne);

    // Update a Post with postId
    app.patch('/memes/:postId', posts.update);

    // Delete a Post with postId
    app.delete('/memes/:postId', posts.delete);
}
