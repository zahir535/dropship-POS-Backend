const { json } = require('express/lib/response');

const mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');
const Schema = mongoose.Schema;

const DataSchema = new Schema({
    email: String,
    user: Object,
    business: Array,
    inventory: Array,
    customer: Array,
    order: Array,
});

const Data = mongoose.model('Data', DataSchema);

module.exports = Data;