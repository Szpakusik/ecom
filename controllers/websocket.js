const WebSocket = require('ws');
const socket = require('socket.io')
const orderController = require("./order")
const productController = require("./product")
// const server = require("../app")
let wsc;
let wss;

exports.wsServerInit = async (server) => {
    
    var io = socket(server)
    io.on('connection', (socket) => {
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

        const json = JSON.parse(data)
        let result;
        if( Array.isArray( json ) ){
            result = await productController.createAll( json );
            console.log( result ? "Products added correctly" : "Error while adding products");
        }
        // else console.log(data);

        // Product decreased
        if(json.operation === "product.stock.decreased"){
            const result = await orderController.updateQuantity(json);
            // wss.emit('product.decrease', { })
        }

    });
    wsc.on('close', function close() {
        console.log('disconnected');
        isWebSocketConnected = false
        setTimeout( this.wsClientConnect, 100000 );
    });

}

exports.wsQuantityAsk = ( {} ) => {
    const correlationId = this._createCorrelationId();
    wsc.emit('message', {
        "operation": "product.stock.decrease",
        "correlationId": correlationId, // tutaj powinno znaleźć się wygenerowane przez Ciebie unikalne id
        "payload": {
            "productId": 123, // id produktu
            "stock": 100 // ile sztuk zostało zamówionych
        }
    })
    return correlationId;
}

exports.getWSS = () => {
    return wss;
}

this._createCorrelationId = () => {
    return this.createString(8) + "-" + this.createString(4) + "-" + this.createString(4) + "-" + this.createString(4) + "-" + this.createString(12);
}

this._createString = ( length ) => {
    const result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }