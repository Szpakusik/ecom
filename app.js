const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const productRouter = require('./routes/product');
const productContorler = require('./controllers/product');
const process = require('process');
const WebSocket = require('ws');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/product', productRouter);

let isWebSocketConnected;

// Set up mongoose connection
const mongoDB = "mongodb://localhost:27017/mec";
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log('Connected!');
    app.listen(port, () => {
        console.log('Server is up and running on port numner ' + port);
    });
});

// Websocket
let myFun = () => {

    ws = new WebSocket('wss://mec-storage.herokuapp.com');
    ws.on('open', () => {
        ws.send('something');
        ws.send('something');
        isWebSocketConnected = true
    });
    ws.on('message', (data) => {
        console.log(data);
    });
    ws.on('close', function close() {
        console.log('disconnected');
        isWebSocketConnected = false
        setTimeout( myFun, 100000 );
    });

}
myFun();

// Handle exceptions 
process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
});