const { json } = require('express/lib/response');

const mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    // name: String,
    // email: String,
    id: String,
    user: json,
    business: json,
    inventory: json,
    customer: json,
    order: json,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;