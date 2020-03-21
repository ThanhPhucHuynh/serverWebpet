const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: Number,
    name: String,
    description: String,
    img: String
});
module.exports = mongoose.model('books', productSchema,'books');
 

  