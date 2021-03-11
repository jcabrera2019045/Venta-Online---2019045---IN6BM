'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'secretKey';
const strings = require('../constants/constants');

exports.ensureAuth = function (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send({ mensaje: strings.requestHeadersError });
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                mensaje: strings.expiredToken
            });
        }
    } catch (error) {
        return res.status(404).send({
            mensaje: strings.unvalidToken
        });
    }

    req.user = payload;
    next();
}