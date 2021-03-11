'use strict'

const userModel = require('../models/user.model');
const bcrypt = require("bcrypt-nodejs");
const jwt = require('../services/jwt')
const strings = require('../constants/constants');
const cartModel = require('../models/shopping_cart.model');

exports.createCart = (userId) => {
    var cart = new cartModel();
    cart.listProduct = [];
    cart.userOwner = userId;
    cart.total = 0;
    cart.save();
}

exports.clientRegistration = (req, res) => {
    var user = new userModel();
    var params = req.body;

    if (params.name && params.password) {
        user.name = params.name;
        user.role = strings.clientRole;

        userModel.find({
            $or: [
                { name: user.name }
            ]
        }).exec((err, findUser) => {
            if (err) return res.status(500).send({ mensaje: strings.addUserError });

            if (findUser && findUser.length == 1) {
                return res.status(500).send({ mensaje: strings.existingUser });
            } else {
                bcrypt.hash(params.password, null, null, (_err, encryptedPass) => {
                    user.password = encryptedPass;
                    user.save((_err, savedUser) => {
                        if (savedUser) {
                            res.status(200).send(savedUser)
                            this.createCart(savedUser._id)
                        } else {
                            res.status(404).send({ mensaje: strings.cantRegistUser })
                        }
                    })
                })
            }
        })
    }
}

exports.login = (req, res) => {
    var params = req.body;

    userModel.findOne({ name: params.name }, (err, findUser) => {
        if (err) return res.status(500).send({ mensaje: strings.requestError });

        if (findUser) {
            bcrypt.compare(params.password, findUser.password, (_err, successfulPass) => {
                if (successfulPass) {
                    if (params.getToken === 'true') {
                        return res.status(200).send({
                            token: jwt.createToken(findUser)
                        });
                    } else {
                        findUser.password = undefined;
                        return res.status(200).send({ findUser })
                    }
                } else {
                    return res.status(404).send({ mensaje: strings.cantIdentifyUser })
                }
            })
        } else {
            return res.status(404).send({ mensaje: strings.userCantEntry })
        }
    })
}

exports.adminRegistration = (req, res) => {
    var user = new userModel();
    var params = req.body;

    if (req.user.role != strings.adminRole) {
        return res.status(500).send({ mensaje: strings.permissionsError });
    }

    if (params.name && params.password) {
        user.name = params.name;
        user.role = strings.adminRole;

        userModel.find({
            $or: [
                { name: user.name }
            ]
        }).exec((err, findUser) => {
            if (err) return res.status(500).send({ mensaje: strings.addUserError });

            if (findUser && findUser.length == 1) {
                return res.status(500).send({ mensaje: strings.existingUser });
            } else {
                bcrypt.hash(params.password, null, null, (_err, encryptedPass) => {
                    user.password = encryptedPass;
                    user.save((_err, savedUser) => {
                        if (savedUser) {
                            res.status(200).send(savedUser)
                        } else {
                            res.status(404).send({ mensaje: strings.cantRegistUser })
                        }
                    })
                })
            }
        })
    }
}

exports.addUser = (req, res) => {
    var user = new userModel();
    var params = req.body;

    if (req.user.role != strings.adminRole) {
        return res.status(500).send({ mensaje: strings.permissionsError });
    }

    if (params.name && params.password && params.role) {
        user.name = params.name;
        user.role = params.role;
        user.password = params.password;

        if (user.role != strings.adminRole && user.role != strings.clientRole) {
            return res.status(500).send({ mensaje: strings.roleError });
        }

        userModel.find({
            $or: [
                { name: user.name }
            ]
        }).exec((err, findUser) => {
            if (err) return res.status(500).send({ mensaje: strings.addUserError });

            if (findUser && findUser.length == 1) {
                return res.status(500).send({ mensaje: strings.existingUser });
            } else {
                bcrypt.hash(params.password, null, null, (_err, encryptedPass) => {
                    user.password = encryptedPass;
                    user.save((_err, savedUser) => {
                        if (savedUser) {
                            res.status(200).send(savedUser)
                        } else {
                            res.status(404).send({ mensaje: strings.cantRegistUser })
                        }
                    })
                })
            }
        })
    }
}

exports.editClientAdmin = (req, res) => {
    var clientId = req.params.clientId;
    var params = req.body;

    if (req.user.role != strings.adminRole) {
        return res.status(500).send({ mensaje: strings.permissionsError });
    }

    if (params.password != null) {
        return res.status(500).send({ mensaje: strings.updateClientAdminError })
    }

    userModel.findOne({ _id: clientId }, (err, findUser) => {
        if (err) return res.status(500).send({ mensaje: strings.requestError });
        if (findUser.role == strings.adminRole) {
            return res.status(500).send({ mensaje: strings.updateAdminError });
        } else {
            userModel.findByIdAndUpdate(clientId, params, { new: true }, (er, updatedClient) => {
                if (er) return res.status(500).send({ mensaje: strings.requestError });
                if (!updatedClient) return res.status(500).send({ mensaje: strings.updateClientError });
                return res.status(200).send({ updatedClient });
            })
        }
    });
}

exports.editClient = (req, res) => {
    var clientId = req.params.clientId;
    var params = req.body;

    if (clientId != req.user.sub) {
        return res.status(500).send({ mensaje: strings.permissionsError });
    }

    if (params.role != null || params.password != null) {
        return res.status(500).send({ mensaje: strings.updateClientAdminError })
    }

    userModel.findOne({ _id: clientId }, (err, findUser) => {
        if (err) return res.status(500).send({ mensaje: strings.requestError });
        if (findUser.role == strings.adminRole) {
            return res.status(500).send({ mensaje: strings.updateAdminError });
        } else {
            userModel.findByIdAndUpdate(clientId, params, { new: true }, (er, updatedClient) => {
                if (er) return res.status(500).send({ mensaje: strings.requestError });
                if (!updatedClient) return res.status(500).send({ mensaje: strings.updateClientError });
                return res.status(200).send({ updatedClient });
            })
        }
    });
}

exports.deleteClientAdmin = (req, res) => {
    const clientId = req.params.clientId;

    if (req.user.role != strings.adminRole) {
        return res.status(500).send({ mensaje: strings.permissionsError });
    }

    userModel.findOne({ _id: clientId }, (err, findUser) => {
        if (err) return res.status(500).send({ mensaje: strings.requestError });
        if (findUser.role == strings.adminRole) {
            return res.status(500).send({ mensaje: strings.deleteAdminError })
        } else {
            userModel.findByIdAndDelete(clientId, (er, deletedClient) => {
                if (er) return res.status(500).send({ mensaje: strings.requestError });
                if (!deletedClient) return res.status(500).send({ mensaje: strings.deleteClientError });
                return res.status(200).send({ deletedClient });
            })
        }
    })
}

exports.deleteClient = (req, res) => {
    const clientId = req.params.clientId;

    if (clientId != req.user.sub) {
        return res.status(500).send({ mensaje: strings.permissionsError });
    }

    userModel.findOne({ _id: clientId }, (err, findUser) => {
        if (err) return res.status(500).send({ mensaje: strings.requestError });
        if (findUser.role == strings.adminRole) {
            return res.status(500).send({ mensaje: strings.deleteAdminError })
        } else {
            userModel.findByIdAndDelete(clientId, (er, deletedClient) => {
                if (er) return res.status(500).send({ mensaje: strings.requestError });
                if (!deletedClient) return res.status(500).send({ mensaje: strings.deleteClientError });
                return res.status(200).send({ deletedClient });
            })
        }
    })
}

exports.getUsers = (req, res) => {

    if (req.user.role != strings.adminRole) {
        return res.status(500).send({ mensaje: strings.permissionsError });
    }

    userModel.find((err, findUser) => {
        if (err) return res.status(500).send({ mensaje: strings.requestError })
        if (!findUser) return res.status(500).send({ mensaje: strings.consultError })
        return res.status(200).send({ findUser })
    })
}