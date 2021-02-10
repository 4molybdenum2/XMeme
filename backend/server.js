const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv')
const morgan = require('morgan')
const swaggerUI = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// create express app
const app = express();
const swaggerApp = express()


dotenv.config({path: './.env'})


if(process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'))
}
//Middlewares
app.use(cors());
swaggerApp.use(cors());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// Configuring the database
const connectDB = require('./config/database.config.js');

// Connecting to the database
connectDB();

//defining a PORT
const PORT = process.env.PORT || 8081;
const swaggerPORT = 8080
// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to XMeme application backend."});
});

require('./app/routes/post.routes.js')(app);
// listen for requests
app.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`);
});

// swagger configs
const swaggerOptions = {
    swaggerDefinition:{
        info:{
            title: 'XMeme API',
            description: 'XMeme API Information',
        },
        host: ['localhost:8081']
    },

    apis: ['./app/controllers/post.controller.js']
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)
swaggerApp.use('/swagger-ui' , swaggerUI.serve, swaggerUI.setup(swaggerDocs))

swaggerApp.listen(swaggerPORT, () => {
    console.log('Swagger up and running on PORT:'+swaggerPORT)
})