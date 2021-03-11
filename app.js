'use strict'

const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const cors = require("cors")

const user_route = require("./src/routes/user.routes");
const category_route = require('./src/routes/category.routes');
const product_route = require('./src/routes/product.routes');
const cart_route = require('./src/routes/shopping_cart.routes');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors());
app.use('/api', user_route, category_route, product_route, cart_route);

module.exports = app;