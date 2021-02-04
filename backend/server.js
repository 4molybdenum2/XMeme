const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
// create express app
const app = express();

//Middlewares
app.use(cors());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// Configuring the database
const connectDB = require('./config/database.config.js');

// Connecting to the database
connectDB();

//defining a PORT
const PORT = process.env.PORT || 5000;

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to XMeme application."});
});
require('./app/routes/post.routes.js')(app);
// listen for requests
app.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`);
});
