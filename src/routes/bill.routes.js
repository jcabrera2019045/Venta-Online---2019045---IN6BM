'use strict'

const express = require("express");
const billController = require("../controllers/bill.controller")

var md_authentication = require("../middlewares/authenticated")

var api = express.Router();

api.post('/createBill', md_authentication.ensureAuth, billController.createBill);
api.get('/getBillByUser/:userId', md_authentication.ensureAuth, billController.getBillByUser);
api.get('/getBillByProduct/:userId/:productId', md_authentication.ensureAuth, billController.getBillByProduct);
api.get('/getEmptyProduct', md_authentication.ensureAuth, billController.getEmptyProduct);
api.get('/getMostSellProducts', md_authentication.ensureAuth, billController.getMostSellProducts);
api.get('/getBillDetail/:billId', md_authentication.ensureAuth, billController.getBillDetail);

module.exports = api;