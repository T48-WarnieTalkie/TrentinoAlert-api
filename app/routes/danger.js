var express = require('express');
var router = express.Router();

const dangerAPIController = require('../controllers/dangerController')

router.get('/get/active', (async (req, res, next) => {
    try {
        res.status(200).json(await dangerAPIController.getActive());
    } catch(e) {
        res.status(500).send()
    }
}));

module.exports = router;
