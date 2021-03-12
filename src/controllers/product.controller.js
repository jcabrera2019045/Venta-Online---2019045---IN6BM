'use strict'

const productModel = require('../models/product.model');
const strings = require('../constants/constants');

exports.addProduct = (req, res) => {
    var product = new productModel();
    var productId = req.params.productId;
    var params = req.body;

    if (req.user.role === strings.adminRole) {
        if (params.name && params.price && params.stock) {
            product.name = params.name;
            product.price = params.price;
            product.stock = params.stock;
            product.category = productId;
            product.soldUnits = 0;

            productModel.find({
                $or: [{ name: product.name }]
            }).exec((err, findedProduct) => {
                if (err) return res.status(500).send({ mensaje: strings.addProductError });
                if (findedProduct && findedProduct.length == 1) {
                    return res.status(500).send({ mensaje: strings.existingProduct });
                } else {
                    product.save((err, savedproduct) => {
                        if (err) return res.status(404).send({ mensaje: strings.addproductError });

                        if (savedproduct) {
                            return res.status(200).send(savedproduct)
                        } else {
                            return res.status(404).send({ mensaje: strings.cantAddProductError })
                        }
                    })
                }
            })
        } else {
            return res.status(500).send({ mensaje: strings.emptyInformationError })
        }
    } else {
        res.status(404).send({ mensaje: strings.permissionsError })
    }
}

exports.getProductByName = (req, res) => {
    var productName = req.params.productName;

    productModel.find({ $or: [{ name: productName }] }).exec((err, findProduct) => {
        if (err) return res.status(500).send({ mensaje: strings.requestError })
        if (!findProduct) return res.status(500).send({ mensaje: strings.consultError })
        if (findProduct == '') return res.status(500).send({ mensaje: strings.notFindedProduct })
        return res.status(200).send({ findProduct })
    })

}

exports.getProductByCategory = (req, res) => {
    var productId = req.params.productId;

    productModel.find({ $or: [{ product: productId }] }).exec((err, findProduct) => {
        if (err) return res.status(500).send({ mensaje: strings.requestError })
        if (!findProduct) return res.status(500).send({ mensaje: strings.consultError })
        if (findProduct.length == 0) return res.status(500).send({ mensaje: strings.emptyCategory })
        return res.status(200).send({ findProduct })
    })

}

exports.editProduct = (req, res) => {
    var productId = req.params.productId;
    var params = req.body;

    if (req.user.role != strings.adminRole) {
        return res.status(500).send({ mensaje: strings.permissionsError });
    }

    productModel.findByIdAndUpdate(productId, params, { new: true }, (er, updatedProduct) => {
        if (er) return res.status(500).send({ mensaje: strings.requestError });
        if (!updatedProduct) return res.status(500).send({ mensaje: strings.updateProductError });
        return res.status(200).send({ updatedProduct });
    })
}

exports.deleteProduct = (req, res) => {
    const productId = req.params.productId;

    if (req.user.role != strings.adminRole) {
        return res.status(500).send({ mensaje: strings.permissionsError });
    }

    productModel.findByIdAndDelete(productId, (er, deletedProduct) => {
        if (er) return res.status(500).send({ mensaje: strings.requestError });
        if (!deletedProduct) return res.status(500).send({ mensaje: strings.deleteProductError });
        return res.status(200).send({ deletedProduct });
    })
}

