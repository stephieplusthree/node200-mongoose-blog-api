const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//instruct mongoose to connect to your local MongoDB instance
mongoose.connect('mongodb://localhost/my-blog', { useMongoClient: true });

//enable promises for mongoos(for easier async operations)
mongoose.Promise = Promise;

const app = express();

// bodyParser to detect json
app.use(bodyParser.json());

//route
app.get('/', (req, res) => {
    res.status(200).send();
});

//export app
module.exports = app;