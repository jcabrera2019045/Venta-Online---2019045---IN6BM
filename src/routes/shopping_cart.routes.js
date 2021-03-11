'use strict'

const express = require("express");
const cartController = require("../controllers/shopping_cart.controller")

var md_authentication = require("../middlewares/authenticated")

var api = express.Router();

api.post('/addProductIntoCart/:productId', md_authentication.ensureAuth, cartController.addProductIntoCart);

module.exports = api;