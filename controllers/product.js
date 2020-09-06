var Product = require('../models/product');

exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

exports.createAll = async (data, res) => {
    
    if( data ){
        await Product.deleteMany( {}, (err)=>{
            if( err ) console.log(err);
        })
        await Product.create( data, (err) => {
            if( err ) return false;
        })
        return true
    }
};

exports.getAll = async (req, res) => {
    Product.find({}, function (err, product) {
        if (err) res.status(500).send({message: "Error occured while getting products"});
        res.status(200).send(product);
    })
};

exports.getSingle = function (req, res) {
    Product.find({ productId: req.params.id } , function (err, product) {
        if (err) res.status(500).send({message: "Error occured while getting product"});
        const status = product ? 200 : 404;
        res.status(status).send(product);
    })
};

// exports.update = function (req, res) {
//     Product.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, product) {
//         if (err) return next(err);
//         res.send('Product udpated.');
//     });
// };