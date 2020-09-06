var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    productId: {type: Number, required: true},
    name: {type: String, required: true, max: 100},
    price: {type: Number, required: true},
    stock: {type: Number, required: true}
});


// Export the model
module.exports = mongoose.model('Product', ProductSchema);