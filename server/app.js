const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require('morgan');

//instruct mongoose to connect to your local MongoDB instance
mongoose.connect('mongodb://localhost/my-blog');

//enable promises for mongoos(for easier async operations)
mongoose.Promise = Promise;

const app = express();

// bodyParser to detect json
app.use(bodyParser.json());
app.use('/api/users', require('./routes/users'));
app.use('/api/blogs', require('./routes/blogs'));

//route
app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
});

//export app
module.exports = app;