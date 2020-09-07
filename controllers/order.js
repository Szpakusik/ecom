const Order = require('../models/product');
const productController = require('./product')
const wsController = require('./websocket')

exports.toAccept = {};

exports.getSingle = async( { id }, res) => {
    return await Order.find( { productId: id } , function (err, product) {
        if (err) res.status( 500 ).send({message: "Error occured while getting order"});
    })
};

exports.prepare = async ( { productId, quantity }, res) => {

    //SEND RESPONSE!
    const product = await productController.getSingle( { id: productId } )

    if( !product ) return { status: 404, payload: { message: "Product not found" } };

    const correlationId = wsController.wsQuantityAsk()

    this.toAccept[correlationId] = { 
        productId, 
        quantity,
    };

    this.orderResponseHandler = (data) => {
        if( toAccept[data.correlationId] ) {
            send( toAccept[data.correlationId] )
            wsController.getWSS().removeListener('message', this.orderResponseHandler);
        }
    }

    wsController.getWSS().on('message', this.orderResponseHandler)


    return true;
};

exports.send = async ( {productId, quantity}, res ) => {

    const order = await Order.create({
        productId: productId,
        quantity: quantity
    }, (err) => { 
        if( err ) res.status( 500 ).send( { message: "Error occured while sending order" } );
    })

    console.log(order);
    if( order ) return { status: 200, payload: order }    

}

exports.updateQuantity = async ( {payload} ) => {
    const update = {
        stock: payload.stock
    };
    let order = await Order.findOneAndUpdate( {productId: payload.productId}, update )
    // console.log(order);
    
    // For those that come before product initialization
    if( !order ) {
        setTimeout( async () => {
            order = await Order.findOneAndUpdate( {productId: payload.productId}, update );
            return order
        }, 10000 )
    } else return order

}
