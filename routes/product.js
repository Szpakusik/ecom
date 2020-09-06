var express = require('express');
var product_controller = require('../controllers/product');

var router = express.Router();

router.get('/products', product_controller.getAll);

router.get('/product/:id', product_controller.getSingle);

module.exports = router;