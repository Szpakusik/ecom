const WebSocket = require('ws');
const socket = require('socket.io')
const orderController = require("./order")
const productController = require("./product");
const { json } = require('body-parser');
// const server = require("../app")
let wsc;
let wss;

exports.wsServerInit = async (server) => {
    
    wss = socket(server)
    wss.on('connection', (socket) => {
        console.log("made socket connection");
    })

}

exports.wsClientConnect = async () => {

    wsc = await new WebSocket('wss://mec-storage.herokuapp.com');
    wsc.on('open', () => {
        isWebSocketConnected = true
    });
    wsc.on('message', async (data) => {
        //Add error handling
        // console.log(data);
        const json = JSON.parse(data)
        let result;
        if( Array.isArray( json ) ){
            result = await productController.createAll( json );
            console.log( result ? "Products added correctly" : "Error while adding products");
        }
        // else console.log(data);

        // Product decreased
        if(json.operation === "product.stock.decreased" || json.operation === "product.stock.updated"){
            // console.log(json);
            const result = await orderController.updateQuantity(json);
            wss.sockets.emit('product.decrease', json)
        }
        if(json.operation === "product.stock.decrease.failed"){
            // const result = await orderController.updateQuantity(json);
            orderController.removeToAccept(json.correlationId)
            console.log("WANT IT TO HAPPEN");
            result && wss.sockets.emit('product.decrease', json)
        }

    });
    wsc.on('close', function close() {
        console.log('disconnected');
        isWebSocketConnected = false
        setTimeout( wsClientConnect, 100000 );
    });

}

exports.wsQuantityAsk = ( {productId, quantity} ) => {
    const correlationId = this._createCorrelationId();
    const json =  JSON.stringify({
        "operation": "product.stock.decrease",
        "payload": {
            "productId": productId, 
            "stock": quantity
        },
        "correlationId": correlationId 
    })
    wsc.send(json)
    return correlationId;
}

exports.getWSS = () => {
    return wss;
}
exports.getWSC = () => {
    return wsc;
}

this._createCorrelationId = () => {
    return this._createString(8) + "-" + this._createString(4) + "-" + this._createString(4) + "-" + this._createString(4) + "-" + this._createString(12);
}

this._createString = ( length ) => {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }