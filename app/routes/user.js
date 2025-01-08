var express = require('express');
var router = express.Router();
var jsend = require('jsend');

const userAPIController = require('../controllers/userController');

const asyncHandler = require('express-async-handler');

router.post('/login', asyncHandler(async (req, res, next) => {
    if(await userAPIController.login(req.body, res)) {
        res.json(jsend.success());
    } else {
        res.json(jsend.error(e));
    }
}));

router.post('/registration', asyncHandler(async (req, res, next) => {
    try {
        await userAPIController.registration(req.body);
    } catch(e) {
        res.json(jsend.error(e));
    }
}));

router.delete('/logout', asyncHandler(async (req, res, next) => {
    try {
        await userAPIController.logout(req);
    } catch(e) {
        res.json(jsend.error(e));
    }
}));

module.exports = router;
