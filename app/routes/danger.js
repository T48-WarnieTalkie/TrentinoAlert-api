var express = require('express');
var router = express.Router();
var jsend = require('jsend');

const dangerAPIController = require('../controllers/dangerController')

const asyncHandler = require('express-async-handler');

router.get('/get/active', asyncHandler(async (req, res, next) => {
    try {
        res.status(209).json(await dangerAPIController.getActive());
    } catch(e) {
        res.status(500)
    }
}));

module.exports = router;
