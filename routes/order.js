var express = require('express');
var orderController = require('../controllers/order');
var productController = require('../controllers/product');

var router = express.Router();

router.post('/order', async (req, res) => {

    let result = await productController.getSingle(req.body)
    console.log(result);
    if(result.status == 404){
        console.log( result )
        res.status( result.status ).send( {message: "Product not found"} );
        return result
    }
    else{
        result = await orderController.prepare( req.body, res );
        res.status( result.status ).send( result.payload );
    }
    

} );

router.get('/order/:id', async (req, res) => {
    const result = await orderController.getSingle( req.params, res );
    console.log(result);
    res.status( result.status ).send( result.payload );
} );

module.exports = router;