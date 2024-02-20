const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/auth/authControllers');
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});
const auth = require('../middleware/auth');
const adminPrivilege = require('../middleware/adminPrivilege');

const registerSchema = Joi.object({
    username: Joi.string().min(5).max(15).required(),
    password: Joi.string().min(8).max(15).required(),
    mail: Joi.string().email().required(),
})

const loginSchema = Joi.object({
    password: Joi.string().min(8).max(15).required(),
    mail: Joi.string().email().required(),
})

const blacklistSchema = Joi.object({
    mail: Joi.string().email().required(),
})

router.post('/register', validator.body(registerSchema), authControllers.controllers.postRegister);

router.post('/login', validator.body(loginSchema), authControllers.controllers.postLogin);

router.post('/adminregister', validator.body(registerSchema), adminPrivilege, authControllers.controllers.adminRegister);

router.post('/adminlogin', validator.body(loginSchema), authControllers.controllers.adminLogin);

router.post('/blacklist', validator.body(blacklistSchema), adminPrivilege, authControllers.controllers.blacklist);

router.post('/removeBlacklist',validator.body(blacklistSchema),adminPrivilege,authControllers.controllers.removeBlacklist);

router.get('/test', auth, (req, res) => {
    res.send("Request passed");
})

module.exports = router;