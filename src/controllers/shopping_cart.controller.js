'use strict'

const cartModel = require('../models/shopping_cart.model');
const productModel = require('../models/product.model');
const strings = require('../constants/constants');

exports.addProductIntoCart = (req, res) => {
    var productId = req.params.productId;
    var userId = req.user.sub;
    var params = req.body;

    if (req.user.role != strings.clientRole) return res.status(500).send({ mensaje: strings.onlyClientBill });
    productModel.findById(productId).exec((err, findProduct) => {
        if (err) return res.status(500).send({ mensaje: strings.requestError });
        if (findProduct.stock < params.amount) return res.status(500).send({ mensaje: strings.insuficientProducts });
        if (!findProduct) return res.status(500).send({ mensaje: strings.searchProductError });
        if (findProduct.stock == 0) return res.status(500).send({ mensaje: strings.emptyProduct });

        var intAmount = parseInt(params.amount, 10);
        var initialSubTotal = intAmount * findProduct.price;
        var price = findProduct.price;
        price = parseInt(price, 10);

        cartModel.findOne({ userOwner: req.user.sub, "productList.productId": productId }, (err, searchProduct) => {
            if (err) return res.status(500).send({ mensaje: strings.searchProductError });
            if (!searchProduct) {
                cartModel.findOneAndUpdate({ userOwner: userId }, { $push: { productList: { amount: intAmount, price: findProduct.price, subTotal: initialSubTotal, productId: productId } } },
                    { new: true, useFindAndModify: false }, (err, addedProduct) => {
                        if (err) return res.status(500).send({ mensaje: strings.requestError });
                        if (!addedProduct) return res.status(500).send({ mensaje: strings.addDataError });
                        var productId = req.params.productId;
                        var total = parseInt(addedProduct.total, 10);
                        var intParam = parseInt(params.amount, 10);

                        cartModel.findOneAndUpdate({ userOwner: req.user.sub, "productList.productId": productId }, { total: total + (price * intParam) }, { new: true }, (err, updatedCart) => {
                            return res.status(200).send(updatedCart);
                        })
                    })
            } else {
                var productArray = searchProduct.productList;

                for (let step = 0; step < productArray.length; step++) {
                    var amountArray = productArray[step].amount;
                    var subTotalArray = productArray[step].subTotal;
                    var productIdArray = productArray[step].productId;

                    if (req.params.productId == productIdArray) {
                        var totalAmount = amountArray + intAmount;
                        if (totalAmount > findProduct.stock) return res.status(500).send({ mensaje: strings.insuficientProducts });
                        cartModel.findOneAndUpdate({ userOwner: req.user.sub, "productList.productId": productId },
                            { "productList.$.amount": intAmount + amountArray, "productList.$.subTotal": subTotalArray + initialSubTotal }, (err, addedProduct) => {
                                if (err) return res.status(500).send({ mensaje: strings.requestError });
                                if (!addedProduct) return res.status(500).send({ mensaje: strings.addDataError });
                                var total = parseInt(addedProduct.total, 10);
                                var intParam = parseInt(params.amount, 10);
                                cartModel.findOneAndUpdate({ userOwner: req.user.sub, "productList.productId": productId }, { total: total + (price * intParam) }, { new: true }, (err, updatedCart) => { return res.status(200).send({ updatedCart }); })
                            })
                    } else {
                        console.log(strings.consultError);
                    }
                }
            }
        }
        )
    }
    )
}
