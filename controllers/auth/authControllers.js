const postLogin = require('./postLogin');
const postRegister = require('./postRegister');
const adminRegister = require('./adminRegister');
const adminLogin = require('./adminLogin');
const blacklist = require('./blacklist');
const removeBlacklist=require('./removeBlacklist');

exports.controllers = {
    postLogin,
    postRegister,
    adminRegister,
    adminLogin,
    blacklist,
    removeBlacklist
}