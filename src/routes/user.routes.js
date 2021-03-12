'use strict'

const express = require("express");
const userController = require("../controllers/user.controller")

var md_authentication = require("../middlewares/authenticated")

var api = express.Router();

api.get('/getUsers', md_authentication.ensureAuth, userController.getUsers);
api.get('/getMostSellProductsClient', md_authentication.ensureAuth, userController.getMostSellProductsClient)
api.post('/login', userController.login);
api.post('/clientRegistration', userController.clientRegistration);
api.post('/adminRegistration', md_authentication.ensureAuth, userController.adminRegistration);
api.put('/editClientAdmin/:clientId', md_authentication.ensureAuth, userController.editClientAdmin);
api.put('/editClient/:clientId', md_authentication.ensureAuth, userController.editClient);
api.post('/addUser', md_authentication.ensureAuth, userController.addUser);
api.delete('/deleteClientAdmin/:clientId', md_authentication.ensureAuth, userController.deleteClientAdmin);
api.delete('/deleteClient/:clientId', md_authentication.ensureAuth, userController.deleteClient);

module.exports = api;