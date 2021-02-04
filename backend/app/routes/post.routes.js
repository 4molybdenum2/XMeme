module.exports = (app) => {
    const posts = require('../controllers/post.controller.js');

    // Create a new Post
    app.post('/posts', posts.create);

    // Retrieve all posts
    app.get('/posts', posts.findAll);

    // Retrieve a single Post with postId
    app.get('/posts/:postId', posts.findOne);

    // Update a Post with postId
    app.patch('/posts/:postId', posts.update);

    // Delete a Post with postId
    app.delete('/posts/:postId', posts.delete);
}
