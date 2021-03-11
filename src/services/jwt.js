'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'secretKey';

exports.createToken = function (user) {
    var payload = {
        sub: user._id,
        name: user.name,
        role: user.role,
        iat: moment().unix(),
        exp: moment().day(10, 'days').unix()
    }

    return jwt.encode(payload, secret);
}