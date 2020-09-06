const Order = require('../models/product');
const productController = require('./product')

exports.getSingle = function ( { id }, res) {
    return await Order.find( { productId: id } , function (err, product) {
        if (err) res.status( 500 ).send({message: "Error occured while getting order"});
    })
};

exports.send = async ( { productId, quantity }, res) => {

    const product = await productController.getSingle( { id: productId } )

    if( !product ) return { status: 404, payload: { message: "Product not found" } };

    else {

        // Websocket job
        const isSoldOut = false;
        if( isSoldOut ) return { status: 400, payload: { message: "Product sold out" } };

        else {

            const order = await Order.create({
                productId: productId,
                quantity: quantity
            }, (err) => { 
                if( err ) res.status( 500 ).send( { message: "Error occured while sending order" } );
            })

            console.log(order);
            if( order ) return { status: 200, payload: order }            

        }
    }
};
