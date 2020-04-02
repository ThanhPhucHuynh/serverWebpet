require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const multer = require('multer')
const path = require('path');
var cors = require('cors');
const app = express();
const URL = process.env.URL_DB;
const PORT = process.env.PORT_SV

const User=require('./models/user.model')
const Product = require("./models/product.model")
app.use(cors())
// app.use(bodyParser.json());
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('imgUser'));
app.use('/imgUser',express.static((__dirname+'/imgUser')))

// app.use(express.static('imgUser'));


// const storage= multer.diskStorage({
//     destination: function(req,file,cb){
//         cb(null,'./imgUser');
//     },
//     filename: function(req,file,cb){
//         cb(null,new Date().toISOString()+file.originalname);
//     }
// })

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './imgUser')
    },
    filename: function (req, file, cb) {
        console.log(file.originalname);
      cb(null, file.fieldname + '-' + Date.now()+file.originalname)
    }
  })
   
var imgUser = multer({ storage: storage })
//const imgUser = multer({dest: 'imgUser/' })
console.log(URL);

mongoose.connect(URL,(error)=>{
    if(error){
        console.log("erro: " + error);
    }else{
        console.log("Thanh cong")
    }
})


app.get('/',(req,res)=>{
    res.send('hello');
})
app.get('/user',(req,res)=>{
    User.find().then((user)=>{
        res.send({user});
    }, (e)=>{
        res.status(400).send(e);
    })
})
app.get('/user/:userEmail' ,(req,res)=>{
    var userEmail = req.params.userEmail;
    console.log(userEmail)
    User.findOne({email:userEmail}).then((user)=>{
        res.send({user});
    }, (e)=>{
        res.status(400).send(e);
    })
})

// app.get('/user/:userEmail' ,(req,res)=>{
//     var userEmail = req.params.userEmail;
//     console.log(userEmail)
//     User.findOne({email:userEmail}).then((user)=>{
//         res.send({user});
//     }, (e)=>{
//         res.status(400).send(e);
//     })
// })
app.get('/product',(req,res)=>{
    Product.find().then((product)=>{
        res.send({product});
    }, (e)=>{
        res.status(400).send(e);
    })
})
app.post('/user', imgUser.single('userImg'),async (req,res)=>{
    // try{
        console.log(req.file);
        var user = new User({
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            pass: req.body.pass,
            userImg: req.body.userImg,
            Token: req.body.Token
            });
            await user.save().then(user=>{
                res.send(user)
            },(e)=>{
                res.status(400).send(e);
            })
           
    // }catch(err){
    //     console.log(err);
    // }
    
})

app.post('/product',async (req,res)=>{
    // try{
        console.log(req.file);
        var product = new Product({
            id: req.body.id,
            name: req.body.name,
            type: req.body.type,
            description: req.body.description,
            price: req.body.price,
            total: req.body.total,
            img: req.body.img,
           
            });
            console.log(product);
            
            await product.save().then(product=>{
                res.send(product)
            },(e)=>{
                res.status(400).send(e);
            })
           
    // }catch(err){
    //     console.log(err);
    // }
    
})
app.listen(PORT,()=>{
    console.log('Listening on ${PORT}')
})
