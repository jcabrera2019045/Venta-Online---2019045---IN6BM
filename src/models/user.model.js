'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    password: String,
    role: String,
});

module.exports = mongoose.model('usuario', UserSchema);