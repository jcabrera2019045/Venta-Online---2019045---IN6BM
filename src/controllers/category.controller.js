'use strict'

const categoryModel = require('../models/category.model');
const bcrypt = require("bcrypt-nodejs");
const jwt = require('../services/jwt')
const strings = require('../constants/constants');
const productModel = require('../models/product.model');

exports.addCategory = (req, res) => {
    var category = new categoryModel();
    var params = req.body;

    if (req.category.role != strings.adminRole) {
        return res.status(500).send({ mensaje: strings.permissionsError });
    }

    if (params.name) {
        category.name = params.name;
        category.description = params.description;


        categoryModel.find({
            $or: [
                { name: category.name }
            ]
        }).exec((err, findCategory) => {
            if (err) return res.status(500).send({ mensaje: strings.addCategoryError });

            if (findCategory && findCategory.length == 1) {
                return res.status(500).send({ mensaje: strings.existingCategory });
            } else {
                bcrypt.hash(params.password, null, null, (_err, encryptedPass) => {
                    category.password = encryptedPass;
                    category.save((_err, savedCategory) => {
                        if (savedCategory) {
                            res.status(200).send(savedCategory)
                        } else {
                            res.status(404).send({ mensaje: strings.cantAddCategory })
                        }
                    })
                })
            }
        })
    }
}

exports.editCategory = (req, res) => {
    var categoryId = req.params.categoryId;
    var params = req.body;

    if (req.category.role != strings.adminRole) {
        return res.status(500).send({ mensaje: strings.permissionsError });
    }

    categoryModel.findByIdAndUpdate(categoryId, params, { new: true }, (er, updatedCategory) => {
        if (er) return res.status(500).send({ mensaje: strings.requestError });
        if (!updatedCategory) return res.status(500).send({ mensaje: strings.updateCategoryError });
        return res.status(200).send({ updatedCategory });
    })
}

exports.createDefaultCategory = (req, res) => {
    var name = strings.default;
    var category = new categoryModel();

    category.name = name;

    categoryModel.find({ name: category.name }).exec((_err, findCategory) => {
        if (findCategory && findCategory.length == 1) {
            return console.log(strings.existingUser);
        } else {

            category.save((err, findCategory) => {
                if (err) return res.status(500).send({ mensaje: strings.addCategoryError })
                if (findCategory) {
                    return console.log(findCategory);
                } else {
                    return res.status(500).send({ mensaje: strings.cantAddCategory })
                }
            })
        }
    })
}

exports.deleteCategory = (req, res) => {
    const categoryId = req.params.categoryId;
    this.createDefaultCategory();
    if (req.user.role != strings.adminRole) {
        return res.status(500).send({ mensaje: strings.permissionsError });
    }

    categoryModel.findOne({ name: strings.default }, (err, foundDefault) => {
        categoryModel.findByIdAndDelete(categoryId, (er, deletedCategory) => {
            if (er) return res.status(500).send({ mensaje: strings.requestError });
            if (!deletedCategory) return res.status(500).send({ mensaje: strings.deleteClientError });
            productModel.find({ category: categoryId }).exec((err, foundProduct) => {
                foundProduct.forEach((newCategory) => {
                    productModel.findByIdAndUpdate(newCategory._id, { category: foundDefault }, (err, deleted) => { })
                })
            })
            return res.status(200).send({ deletedCategory });
        })
    })

}

exports.getCategories = (req, res) => {

    if (req.category.role != strings.adminRole) {
        return res.status(500).send({ mensaje: strings.permissionsError });
    }

    categoryModel.find((err, findCategory) => {
        if (err) return res.status(500).send({ mensaje: strings.requestError })
        if (!findCategory) return res.status(500).send({ mensaje: strings.consultError })
        return res.status(200).send({ findCategory })
    })
}