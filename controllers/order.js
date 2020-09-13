const Order = require('../models/order');
const productController = require('./product')
const wsController = require('./websocket');

this.toAccept = {};
this.listenerCount = 0;

exports.getSingle = async( { id }, res) => {
    const order = await Order.find( { _id: id } , function (err, product) {
        if (err){
            console.log(err);
            res.status( 404 ).send({message: "Order not found!"});
        }
    })
    return { status: 200, payload: order}
};

exports.prepare = async ( { productId, quantity }, res) => {

    //SEND RESPONSE!
    return new Promise( async (resolve, reject) => {



        const correlationId = wsController.wsQuantityAsk({productId, quantity})

        this.toAccept[correlationId] = { 
            productId, 
            quantity,
            res
        };
        if( !this.listenerCount )
            wsController.getWSC().on('message', this.orderResponseHandler)
        this.listenerCount +=1;

        return true;

    })
};

exports.removeToAccept  = (correlationId) => {
    this.listenerCount -= 1;
    if( this.listenerCount === 0 )
            wsController.getWSC().off('message', this.orderResponseHandler);
    delete this.toAccept[correlationId];
}

this.orderResponseHandler = (data) => {
    const json = JSON.parse(data)
    console.log("happen1");
    
    // jesli nie ma w tym to znaczy serwer restarted
    if( this.toAccept[json.correlationId] ) {

        console.log("happen2");

        send( this.toAccept[json.correlationId] );

        this.toAccept[json.correlationId].res.status(200).send(json)
        this.listenerCount -= 1;

        if( this.listenerCount === 0 )
            wsController.getWSC().off('message', this.orderResponseHandler);

        delete this.toAccept[json.correlationId];

    } 

}
const send = ( {productId, quantity} ) => {

    return new Promise( async (resolve, reject) => {

        const order = await Order.create({
            productId: productId,
            quantity: quantity
        }, (err, data) => { 
            if( err ){
                console.log(err);
                reject(err)
            } 
            if( data ){
                resolve( { status: 200, payload: data } )
            }
        })

    } )
    

}
 
exports.send

exports.updateQuantity = async ( {payload} ) => {
    const update = {
        stock: payload.stock
    };
    let order = await Order.findOneAndUpdate( {productId: payload.productId}, update )
    
    // For those that come before product initialization
    if( !order ) {
        setTimeout( async () => {
            order = await Order.findOneAndUpdate( {productId: payload.productId}, update );
            return order
        }, 10000 )
    } else return order

}
