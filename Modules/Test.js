const { json } = require('express/lib/response');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestSchema = new Schema({
    name: String,
    user: Object,
});

const Test = mongoose.model('Test', TestSchema);

module.exports = Test;