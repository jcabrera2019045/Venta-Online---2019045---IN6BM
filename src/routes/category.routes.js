'use strict'

const express = require("express");
const categoryController = require("../controllers/category.controller")

var md_authentication = require("../middlewares/authenticated")

var api = express.Router();

api.get('/getCategories', md_authentication.ensureAuth, categoryController.getCategories);
api.post('/addCategory', md_authentication.ensureAuth, categoryController.addCategory);
api.put('/editCategory/:categoryId', md_authentication.ensureAuth, categoryController.editCategory);
api.delete('/deleteCategory/:categoryId', md_authentication.ensureAuth, categoryController.deleteCategory);

module.exports = api;