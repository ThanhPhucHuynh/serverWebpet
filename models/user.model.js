const mongoose = require('mongoose');

const userSchema =  mongoose.Schema({
    id: String,
    name: String,
    email: String,
    pass: String,
    userImg: String,
    Token: String
});
module.exports = mongoose.model('users', userSchema);
 

   