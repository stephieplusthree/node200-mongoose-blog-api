// Imports mongoose and extracts Schema into it's own variable
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creates a new Mongoose Schema with two properties
const UserSchema = new Schema({
    firstName: { type: string, required: true}, // firstName property is a string and required
    lastName: { type: string, required: true}, // lastName property is a string and required
    email: { type: string, required: true}, // email property is a string and required

    // New property
    social: {
        facebook: { type: String, required: false },
        twitter: { type: String, required: false },
        linkedIn: { type: String, required: false }
    }
});

module.exports = mongoose.model('User', UserSchema);