const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    id: String,
    email: String,
    phone: String,
    address: String,
    idproduct: String,
    price: Number,
    status: Number,
    dateOrder: Date
});
module.exports = mongoose.model('order', orderSchema);
 

  