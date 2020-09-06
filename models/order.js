var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    productId: {type: Number, required: true},
    quantity: {type: Number, required: true}
});

// Export the model
module.exports = mongoose.model('Order', OrderSchema);