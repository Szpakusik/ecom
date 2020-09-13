var Product = require('../models/product');

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

exports.getAll = async ( {} , res ) => {
    const products = await Product.find( {}, function (err, product) {
        if (err) res.status( 500 ).send( { message: "Error occured while getting products" } );
    })
    return { status: 200, payload: products}
};

exports.getSingle = async ( { id, productId } ) => {
    let givenId = id;
    if( !givenId ) givenId = productId;
    const product = await Product.findOne({ productId: givenId } , function (err, product) {
        if (err) {
            return { status: 500, payload: { message: "Error occured while getting product" } }
        }
    })
    if( product ) 
        return { status: 200, payload: product }
    else 
        return { status: 404, payload: product }
};

// exports.update = function (req, res) {
//     Product.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, product) {
//         if (err) return next(err);
//         res.send('Product udpated.');
//     });
// };