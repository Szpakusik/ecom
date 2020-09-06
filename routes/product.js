const express = require('express');
const productController = require('../controllers/product');

const router = express.Router();

router.get('/products', async (req, res) => {
    const result = await productController.getAll(req.body, res)
    res.status( 200 ).send( result.payload );
});

router.get('/product/:id', async (req, res) => {

    const result = await productController.getSingle(req.params, res)
    res.status( result.status ).send( result.payload );
} );

module.exports = router;