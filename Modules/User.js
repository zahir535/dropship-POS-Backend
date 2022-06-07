const { json } = require('express/lib/response');

const mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    dataUser: Object,
    // id: String,
    // user: Object,
    // business: Array,
    // inventory: Array,
    // customer: Array,
    // order: Array,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;