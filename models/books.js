const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let BookSchema = new Schema({
    Name: String,
    Author: String,
    ISBN: String,
    Price: Double
});

module.exports = mongoose.model('Book', BookSchema);
