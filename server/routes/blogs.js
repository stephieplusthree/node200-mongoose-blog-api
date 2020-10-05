const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Blog = require('../models/Blog');

router.get('/', (req, res) => {
    Blog
        .find()
        .then(blogs => {
            res.status(200).json(blogs);
        });
});

router.get('/featured', (req, res) => {
    Blog
        .where('featured', true)
        .then(blogs => {
            res.status(200).json(blogs);
        });
});

router.get('/:_id', (req, res) => {
    Blog
        .findById(req.params)
        .then(blogs => {
            if (blogs === null) res.status(404).end()
            else res.status(200).json(blogs);
        });
});

router.post('/', (req, res) => {
    // New higher scope variable
    let dbUser = null;

    // Fetch the user from the database
    User
        .findById(req.body.author)
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
});

router.put('/:_id', (req, res) => {
    Blog
        .findByIdAndUpdate(req.params, req.body)
        .then(blogs => {
            if (blogs === null) res.status(404).end()
            else res.status(204).json(blogs);
        });
});

router.delete('/:_id', (req, res) => {
    User.findById(req.body.authorId)
        .then(user => {
            user.blogs.splice(blogs.indexOf(req.params), 1)
        })
        .then(Blog
            .findByIdAndRemove(req.params)
            .then(blogs => {
                if (blogs === null) res.status(404).end()
                else res.status(200).json(blogs);
            })
        );
});

module.exports = router;