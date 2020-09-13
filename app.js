const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const productRouter = require('./routes/product');
const orderRouter = require('./routes/order');
const websocketContorler = require('./controllers/websocket');
const process = require('process');

const app = express();
const port = 3001;
var cors = require('cors');

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', productRouter);
app.use('/', orderRouter);

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

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
    await websocketContorler.wsServerInit(server)
    websocketContorler.wsClientConnect()
});

// Handle exceptions 
process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
    // if(err && !err.message.includes("503")) throw err
});

module.exports = server