'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var ProductSchema = Schema({
    name: String,
    stock: Number,
    price: Number,
    category: { type: Schema.Types.ObjectId, ref: 'categoria' },
    soldUnits: Number,
});

module.exports = mongoose.model('producto', ProductSchema);