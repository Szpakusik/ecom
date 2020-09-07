const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const productRouter = require('./routes/product');
const websocketContorler = require('./controllers/websocket');
const process = require('process');

const app = express();
const port = 3001;
const ioc = require('socket.io-client')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', productRouter);

let isWebSocketConnected;

// Set up mongoose connection
const mongoDB = "mongodb://localhost:27017/mec";
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;

const server = app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
    console.log('Connected to MongoDB!');
    await websocketContorler.wsServerInit()
    websocketContorler.wsClientConnect()
});

// Handle exceptions 
process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
    if(err && !err.message.includes("503")) throw err
});

module.exports = server