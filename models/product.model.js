const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    id: String,
    name: String,
    type: String,
    description: String,
    price: Number,
    total: Number,
    img: String
});
module.exports = mongoose.model('product', productSchema);
 

  