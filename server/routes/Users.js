const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get('/', (req, res) => {
    User
        .find()
        .then(users => {
            res.status(200).json(users);
        });
});

router.get('/:_id', (req, res) => {
    User
        .findById(req.params)
        .then(users => {
            if (users === null) res.status(404).end()
            else res.status(200).json(users);
        })
});

module.exports = router;
