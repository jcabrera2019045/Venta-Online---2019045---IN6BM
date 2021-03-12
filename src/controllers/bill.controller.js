const billModel = require('../models/bill.model');
const strings = require('../constants/constants');
const cartModel = require('../models/shopping_cart.model');
const productModel = require('../models/product.model');

exports.createBill = (req, res) => {
    var bill = new billModel();

    cartModel.findOne({ userOwner: req.user.sub }, (err, foundCart) => {
        if (foundCart.productList.length == 0) return res.status(500).send({ mensaje: strings.emptyCart });
        if (err) return res.status(500).send({ mensaje: strings.requestError });
        var productArray = foundCart.productList;
        if (productArray.length == 0) return res.status(500).send({ mensaje: strings.emptyCart });
        bill.userOwner = foundCart.userOwner;
        bill.total = foundCart.total;
        bill.productList = foundCart.productList.slice();

        bill.save((err, savedBill) => {
            if (err) return res.status(500).send({ mensaje: strings.consultError });
            if (!savedBill) return res.status(500).send({ mensaje: strings.addBillError });

            productArray.forEach(function (product) {
                productModel.findById(product.productId, (err, updatedProduct) => {
                    productModel.findByIdAndUpdate(product.productId, { stock: (updatedProduct.stock - product.amount), soldUnits: (updatedProduct.soldUnits + product.amount) },
                        { new: true, useFindAndModify: false }, (err, updatedProduct) => { });
                });
            });

            cartModel.findOneAndUpdate({ userOwner: req.user.sub }, { $set: { productList: [] }, total: 0 }, (err, emptyCart) => {
                if (err) return res.status(500).send({ mensaje: strings.requestError });
                if (!emptyCart) return res.status(500).send({ mensaje: strings.notFindedCart });
                return res.status(200).send({ emptyCart })
            });
            return res.status(200).send({ 'Factura guardada exitosamente': savedBill });
        });

    });
}

exports.getBillByUser = (req, res) => {
    var userId = req.params.userId
    if (userId != req.user.sub) {
        return res.status(500).send({ mensaje: strings.permissionsError });
    }

    billModel.find({ $or: [{ userOwner: userId }] }).exec((err, findBill) => {
        if (err) return res.status(500).send({ mensaje: strings.requestError })
        if (!findBill) return res.status(500).send({ mensaje: strings.consultError })
        return res.status(200).send({ 'Facturas del Cliente': findBill })
    })
}

exports.getBillByProduct = (req, res) => {
    var productId = req.params.productId
    var userId = req.params.userId
    if (userId != req.user.sub) {
        return res.status(500).send({ mensaje: strings.permissionsError });
    }

    billModel.find({ $or: [{ 'productList.productId': productId }] }).exec((err, findBill) => {
        if (err) return res.status(500).send({ mensaje: strings.requestError })
        if (!findBill) return res.status(500).send({ mensaje: strings.consultError })
        return res.status(200).send({ 'Facturas del Cliente': findBill })
    })
}

exports.getEmptyProduct = (req, res) => {
    if (req.user.role != strings.clientRole) {
        return res.status(500).send({ mensaje: strings.permissionsError });
    }

    productModel.find({ $or: [{ stock: 0 }] }).exec((err, findProduct) => {
        if (err) return res.status(500).send({ mensaje: strings.requestError })
        if (!findProduct) return res.status(500).send({ mensaje: strings.consultError })
        return res.status(200).send({ 'Productos Agotados': findProduct })
    })
}

exports.getMostSellProducts = (req, res) => {
    if (req.user.role != strings.adminRole) {
        return res.status(500).send({ mensaje: strings.permissionsError });
    }

    productModel.find((err, findProduct) => {
        if (err) return res.status(500).send({ mensaje: strings.requestError })
        if (!findProduct) return res.status(500).send({ mensaje: strings.consultError })
        return res.status(200).send({ 'Productos Más Vendidos': findProduct })
    }).sort({ soldUnits: -1 }).limit(10);
}

exports.getBillDetail = (req, res) => {
    var billId = req.params.billId
    billModel.findById(billId).exec((err, findBill) => {
        if (err) return res.status(500).send({ mensaje: strings.requestError })
        if (!findBill) return res.status(500).send({ mensaje: strings.consultError })
        if (findBill.userOwner != req.user.sub) return res.status(500).send({ mensaje: strings.permissionsError })
        return res.status(200).send({ 'Facturas del Cliente': findBill })
    })
}

