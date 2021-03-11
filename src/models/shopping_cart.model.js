'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var CartSchema = Schema({
    productList: [{
        amount: Number,
        price: Number,
        subTotal: Number,
        productId: { type: Schema.ObjectId, ref: 'producto' },
    }],
    userOwner: { type: Schema.Types.ObjectId, ref: 'usuario' },
    total: Number,
});

module.exports = mongoose.model('carrito', CartSchema);