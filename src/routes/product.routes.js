'use strict'

const express = require("express");
const productController = require("../controllers/product.controller")

var md_authentication = require("../middlewares/authenticated")

var api = express.Router();

api.get('/getProductByName/:productName', productController.getProductByName);
api.get('/getProductByCategory/:categoryId', productController.getProductByCategory);
api.post('/addProduct/:categoryId', md_authentication.ensureAuth, productController.addProduct);
api.put('/editProduct/:productId', md_authentication.ensureAuth, productController.editProduct);
api.delete('/deleteProduct/:productId', md_authentication.ensureAuth, productController.deleteProduct);

module.exports = api;