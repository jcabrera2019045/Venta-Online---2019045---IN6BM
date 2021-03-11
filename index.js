'use strict'

const mongoose = require("mongoose")
const app = require('./app');
const userModel = require("./src/models/user.model");
const bcrypt = require('bcrypt-nodejs');
const strings = require('./src/constants/constants');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/VentaOnline', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    var name = strings.defaultAdminName;
    var password = strings.defaultAdminPass;
    var role = strings.defaultAdminRole;
    var user = new userModel();

    user.name = name;
    user.role = role;

    userModel.find({ name: user.name }).exec((_err, findUser) => {
        if (findUser && findUser.length == 1) {
            return console.log(strings.existingUser);
        } else {
            bcrypt.hash(password, null, null, (err, encryptedPass) => {
                user.password = encryptedPass;

                user.save((err, findUser) => {
                    if (err) return res.status(500).send({ mensaje: strings.addUserError })
                    if (findUser) {
                        return console.log(findUser);
                    } else {
                        return res.status(500).send({ mensaje: strings.cantRegistUser })
                    }
                })
            })
        }
    })
    app.listen(3000, function () {
        console.log(strings.serverPort)
    })
}).catch(er => console.log(er))
