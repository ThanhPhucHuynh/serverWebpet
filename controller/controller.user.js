var User = require('../model/user.model');
module.exports.user = async function(req,res){
    var user = await User.find();
    res.json(user);
}