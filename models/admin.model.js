const mongoose = require('mongoose');

const adminSchema =  mongoose.Schema({
    id: String,
    name: String,
    email: String,
    pass: String,
    type: String,
    userImg: String,
    Token: String
});
module.exports = mongoose.model('admin', adminSchema);
 

   