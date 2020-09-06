var express = require('express');
var orderController = require('../controllers/order');

var router = express.Router();

router.post('/order', async (req, res) => {
    const result = await orderController.send( req.body, res );
    res.status( result.status ).send( result.payload );
} );

router.get('/order/:id', async (req, res) => {
    const result = await orderController.getSingle( req.params, res );
    res.status( result.status ).send( result.payload );
} );

module.exports = router;