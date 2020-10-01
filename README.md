NODE 200

Instructions: Mongoose Blog API

Prerequisites
Before you start this project, make sure that MongoDB is running.

Introduction
In this project we're going to build a REST API for a blog website using Express, using Mongoose to read/write Users and Blogs to a MongoDB database.

High Level Steps
Initialize the Project
Create an Express app
Create a User Model/Router
Create a Blog Model/Router
Add a README.MD document.
Push a branch with latest code up to GitHub.
Deploy code to the web via Heroku

Step 1 - Initialize the Project
First, we need to perform the usual repeatable steps to start a new project. Clone the project from Github.

Step 2 - Create an Express app
Add Express to the project using npm install express --save, then create a server folder at the root of the project, then add the following files as you would during Express drills. (You can also optionally add the morgan middleware as well to see some basic HTTP logs in the terminal when your Express app receives HTTP requests.)

./server/index.js
.server/app.js
Once you have these files, perform the following three steps:

Add some require statements at the top of app.js, making sure to add mongoose for the database support

    const express = require('express');
    const mongoose = require('mongoose');
    const bodyParser = require('body-parser');

Instruct mongoose to connect to your local MongoDB instance

    mongoose.connect('mongodb://localhost/my-blog', { useMongoClient: true });

Enable Promises for mongoose (for easier async operations)

    mongoose.Promise = Promise;

Add the necessary statements after these lines to use the bodyParser to detect json, setup a route and finally to export the app

After performing these steps, your ./server/app.js should look something like this.

    const express = require('express');
    const mongoose = require('mongoose');
    const bodyParser = require('body-parser');

    mongoose.connect('mongodb://localhost/my-blog', { useMongoClient: true });
    mongoose.Promise = Promise;

    const app = express();

    app.use(bodyParser.json());

    app.get('/', (req, res) => {
        res.status(200).send();
    });

    module.exports = app;

...and your ./server/index.js should look like this.

    const server = require('./app');

    server.listen(8080, function() {
        console.log('Server is listening on http://localhost:8080');
    });


Step 3 - Create a User Model/Router

Create the Model
Before we start building out our routes, we need to create our first Schema, then use that Schema to generate a Model.

First, navigate to the project folder in Terminal and install Mongoose by running npm install mongoose --save.

Then, create a new folder called models at the server folder level. Within that folder, create the following file:

./server/models/User.js

    // Imports mongoose and extracts Schema into it's own variable
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

    // Creates a new Mongoose Schema with two properties
    const UserSchema = new Schema({
    firstName: { type: string, required: true}, // firstName property is a string and required

    // ...
    });

    module.exports = mongoose.model('User', UserSchema);

Now it's your turn. UserSchema currently has one property - firstName. The object assigned to firstName tells Mongoose how this property should be mapped within a MongoDB document - e.g. it is to use the String type, and it cannot have an empty value per the required: true setting.

Next, let's add three social networks to UserSchema and group them together into an object called social.

    const UserSchema = new Schema({
    firstName: { type: String, required: true},

    // New property
    social: {
        facebook: { type: String, required: false },
        twitter: { type: String, required: false },
        linkedIn: { type: String, required: false }
    }
    });

Now it's your turn - use the same syntax to add the following properties to UserSchema (feel free to add your own too!)

Property Name Property Type Required?
lastName String true
email String true
Create the Router
Next, create a new routes folder under the server folder and add the following file:

./server/routes/users.js

    const express = require('express');
    const router = express.Router();
    const User = require('../models/User');

        router.get('/', (req, res) => {
            User
            .find()
            .then(users => {
                res.status(200).json(users);
            });
        });

        module.exports = router;


Next, add the following code to ./server/app.js after the / route to connect this new route to your Express app.

                app.use('/api/users', require('./routes/users'));


You should now be able to:

Start the app using npm start from the project directory.
Visit http://localhost:8080/api/users and expect [] as the correct response.
Implement the following Routes
Now that you've created a model and a route, let's implement the remaining C.R.U.D operations. Based on the table below, write the code to implement each of the routes in ./server/routes/user.js.

Verb Route Description Mongoose Method
GET /api/users/ Get all Users .find()
GET /api/users/:id Get single User .findById()
POST /api/users/ Create a User .save() (read Constructing Documents below for help
PUT /api/users/:id Update a User .findByIdAndUpdate()
DELETE /api/users/:id Delete a User .findByIdAndRemove()
Use Postman to test your routes - it allows you to issue the four main HTTP requests (GET, POST, PUT, and DELETE) as well as see additional information such as response time and status code.

Step 4 - Create a Blog Model/Router
Create a Blog Model
Create a model the same we showed you in Step 3, adding the following properties:

Property Name Property Type Required?
title String true
article String true
published Date true
featured Boolean true
author ObjectId true
Create a User <--> Blog Relationship
Now let's create a relationship between User and Blog. We can say that these two Schemas have a one-to-many relationship, in that a Blog is written by one User, who has many Blogs.

We can break that sentence into two pieces:

Users have many Blogs
Blogs have one User
To setup the first piece, open ./server/models/User.js and add the following property to UserSchema:

    blogs: [{ type: Schema.Types.ObjectId, ref: 'Blog' }]




To setup the second piece, open ./server/models/Blog.js and add the following property to BlogSchema:

    author: { type: Schema.Types.ObjectId, ref: 'User' }


The relationship is now configured. Later, we'll add documents that relate to each other thanks to this step.

Create the Blog Router
Create a new file ./server/routes/blogs.js
Implement the below routes
Add the route to app.js
Verb Route Description Mongoose Method
GET /api/blogs/ Get all Blogs .find()
GET /api/blogs/featured Get all featured blogs .where()
GET /api/blogs/:id Get a single Blog .findById()
POST /api/blogs/ Create a Blog + associate to userID .save() (read Constructing Documents below for help
PUT /api/blogs/:id Update a User .findByIdAndUpdate()
DELETE /api/blogs/:id Delete a User .findByIdAndRemove()
(Don't forget to import and add your route as middleware in app.js!)

Test and Iterate
You should now be able to:

Start the app using npm start
Visit http://localhost:8080/api/blogs/507f191e810c19729de860ea and get a 404 response in the browser.
Run npm test and see all tests relating to /api/blogs pass.
Creating Related Documents
Often, it is necessary to create relationships between documents at insertion time. In this project, we need to attach a user to a blog at insertion time.

The following process is one method for accomplishing this task with Mongoose.

The code that follows would be written inside of the /api/blogs endpoint in Express

First, fetch the user from the database.

    // Fetch the user from the database
    User.findById(req.body.authorId)

Next, create a blog, bind the user to it, and save it to the database.

    // Fetch the user from the database
    User.findById(req.body.authorId)
    .then(user => {
    // Create a blog
    const newBlog = new Blog(req.body);

    // Bind the user ot it
    newBlog.author = user._id;

    // Save it to the database
        return newBlog.save();
    })


Next, add the blog to the users subcollection of blogs. (Note that due to scoping issues, we have declared a dbUser variable in a higher scope as we will need to access it across multiple scopes.)

    // New higher scope variable
    let dbUser = null;

    // Fetch the user from the database
    User
    .findById(req.body.authorId)
    .then(user => {
    // Store the fetched user in higher scope variable
    dbUser = user;

    // Create a blog
    const newBlog = new Blog(req.body);

    // Bind the user to it
    newBlog.author = user._id;

    // Save it to the database
        return newBlog.save();
    })
    .then(blog => {
    // Push the saved blog to the array of blogs associated with the User
    dbUser.blogs.push(blog);

    // Save the user back to the database and respond to the original HTTP request with a copy of the newly created blog.
    dbUser.save().then(() => res.status(201).json(blog));
    })


The result is that both the User document and the newly created Blog document now reference eachother.

Exit Criteria
Create 2 mongoose models with relationships between them.
Implement GET, POST, PUT and DELETE actions per the specification.
All tests must pass.
