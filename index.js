require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const multer = require('multer')
const path = require('path');
var cors = require('cors');
const app = express();
const URL = process.env.URL_DB;
const PORT = process.env.PORT || 5000
var md5 = require('md5');
const User = require('./models/user.model')
const Product = require("./models/product.model")
const Order = require("./models/order.model")
const Admin   = require("./models/admin.model")
var fs = require('fs')
var https = require('https')
app.use(cors())
// app.use(bodyParser.json());
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
//     res.hePORT_SVader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('imgUser'));
app.use('/imgUser', express.static((__dirname + '/imgUser')))

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
        cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
})

var imgUser = multer({ storage: storage })
//const imgUser = multer({dest: 'imgUser/' })
console.log(URL);

mongoose.connect(URL, {
    // dbName: "bookDB",
    useNewUrlParser: true,useUnifiedTopology: true }, (error) => {
    if (error) {
        console.log("erro: " + error);
    } else {
        console.log("Thanh cong")
    }
})


app.get('/', (req, res) => {
    res.send('<h1>Huynh PHuc</h1>');
})

app.get('/user', (req, res) => {
    User.find().then((user) => {
        res.send({ user });
    }, (e) => {
        res.status(400).send(e);
    })
})
app.get('/user/:userEmail', (req, res) => {
    var userEmail = req.params.userEmail;
    console.log(userEmail)
    User.findOne({ email: userEmail }).then((user) => {
        res.send({ user });
    }, (e) => {
        res.status(400).send(e);
    })
})
app.get('/user/img/:userEmail', (req, res) => {
    var userEmail = req.params.userEmail;
    console.log(userEmail)
    User.findOne({ email: userEmail }).then((user1) => {
        console.log(user1.name)
        var user = new User({
            id: user1.id,
            name: user1.name,
            email: user1.email,
            userImg: user1.userImg,
            // Token: req.body.Token
        });
        res.send({user});
    }, (e) => {
        res.status(400).send(e);
    })
})
app.get('/user/:userEmail/:pass', (req, res) => {
    var userEmail = req.params.userEmail;
    var userPass = req.params.pass;
    console.log(userEmail,userPass)
    User.findOne({ email: userEmail }).then((user) => {
        if(user.pass === userPass){
            res.send(true);
        }else{
            res.send(false);
        }
    }, (e) => {
        res.status(400).send(e);
    })
})
app.post('/user/check', (req, res) => {
    console.log(req.body.pass)
    UserPass =req.body.pass;
    User.findOne({ email: req.body.email }).then(user => {
        // console.log(user)
        if(user){
            if(md5(user.pass)+md5("webpet") === UserPass){
                res.send(true);
            }else{
                res.send(false);
            }
        }else{
            res.send(false);
        }
       
        
    }, (e) => {
        res.status(400).send(e);
    })
})

app.post('/user', imgUser.single('userImg'), async (req, res) => {

    console.log(req.file);

    var user = new User({
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        pass: req.body.pass,
        userImg: req.body.userImg,
        Token: req.body.Token
    });
    await user.save().then(user => {
        res.send(user)
    }, (e) => {
        res.status(400).send(e);
    })
})

app.post('/user/update', async (req, res) => {
    var productTmp ={
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        pass: req.body.pass,
        userImg: req.body.userImg,
        Token: req.body.Token
    }
    await User.findOneAndUpdate({id: req.body.id}, productTmp, {new: true}).then(product => {
        res.send(productTmp)
    }, (e) => {
        res.status(400).send(e);
    })
})

app.post('/user/img', imgUser.array('userImg'), async (req, res) => {

    console.log(req.file);
    console.log(req.files)
    console.log("adasd");
    // const obj = JSON.parse(JSON.stringify(req.body.user)); 
    console.log(JSON.parse(req.body.user));

    // var user = new User({
    //     id: req.body.id,
    //     name: req.body.name,
    //     email: req.body.email,
    //     pass: req.body.pass,
    //     userImg: req.file.path,
    //     Token: req.body.Token
    // });
    // await user.save().then(user => {
    //     res.send(user)
    // }, (e) => {
    //     res.status(400).send(e);
    // })
})

///admi

app.get('/admin', (req, res) => {
    Admin.find().then((admin) => {
        res.send({ admin });
    }, (e) => {
        res.status(400).send(e);
    })
})
app.get('/admin/:userEmail', (req, res) => {
    var userEmail = req.params.userEmail;
    console.log(userEmail)
    Admin.findOne({ email: userEmail }).then((admin) => {
        res.send({ admin });
    }, (e) => {
        res.status(400).send(e);
    })
})
app.post('/admin', imgUser.single('userImg'), async (req, res) => {

    console.log(req.file);
    var admin = new Admin({
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        pass: req.body.pass,
        type: "admin",
        userImg: req.body.userImg,
        Token: req.body.Token
    });
    await admin.save().then(admin => {
        res.send(admin)
    }, (e) => {
        res.status(400).send(e);
    })
    
})



app.get('/product/:typeProduct', (req, res) => {
    var typeProduct = req.params.typeProduct;
    Product.find({ type: typeProduct }).then((product) => {
        res.send({ product });
    }, (e) => {
        res.status(400).send(e);
    })
})
app.get('/product/id/:id', (req, res) => {
    var id = req.params.id;
    Product.find({ id: id }).then((product) => {
        res.send({ product });
    }, (e) => {
        res.status(400).send(e);
    })
})
app.get('/product', (req, res) => {
    Product.find().then((product) => {
        res.send({ product });
    }, (e) => {
        res.status(400).send(e);
    })
})

app.get('/product/img/:id', (req, res) => {
    var id = req.params.id;
    Product.find({ id: id }).then((product) => {
        res.send({ product });
    }, (e) => {
        res.status(400).send(e);
    })
})
app.get('/product', (req, res) => {
    Product.find().then((product) => {
        res.send({ product });
    }, (e) => {
        res.status(400).send(e);
    })
})


app.post('/product', async (req, res) => {
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

    await product.save().then(product => {
        res.send(product)
    }, (e) => {
        res.status(400).send(e);
    })
})

app.post('/product/update', async (req, res) => {
    var productTmp ={
        id: req.body.id,
        name: req.body.name,
        type: req.body.type,
        description: req.body.description,
        price: req.body.price,
        total: req.body.total,
        // img: req.body.img

    }
    await Product.findOneAndUpdate({id: req.body.id}, productTmp, {new: true}).then(product => {
        res.send(productTmp)
    }, (e) => {
        res.status(400).send(e);
    })
})

app.post('/product/delete', async (req, res) => {
    await Product.findOneAndRemove({id: req.body.id}).then(() => {
        res.send("complate")
    }, (e) => {
        res.status(400).send(e);
    })
})



app.listen(PORT || 5000, () => {
    console.log('Listening on '+PORT || '5000')
})
// https.createServer({
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.cert')
//   }, app).listen(PORT || 5000, () => {
//     console.log('Listening on '+PORT || '5000')
// })

// order




app.get('/order/:email', (req, res) => {
    var email = req.params.email;
    Order.find({ email: email }).then((order) => {
        res.send({ order });
    }, (e) => {
        res.status(400).send(e);
    })
})
app.get('/order', (req, res) => {
    Order.find().then((order) => {
        res.send({ order });
    }, (e) => {
        res.status(400).send(e);
    })
})


app.get('/ordermouth',(req,res)=>{
    var d = new Date();
     
    var date = d.getUTCDate();
    var month = d.getUTCMonth() + 1; // Since getUTCMonth() returns month from 0-11 not 1-12
    var year = d.getUTCFullYear();
    
    var dateStr = year + "-" + month + "-" + date;
    // console.log(dateStr);
    if(month === 1 ){
       month = 12;
       year = year - 1; 
    }else{
        month = month -1;
    }
    var datePre = year + "-"+ (month)+ "-"+date;

    // res.send({dateStr,datePre});
    listProductSales = [];
    listProduct=[];
    gia = 0;
    Order.find({
        dateOrder: {$gte: datePre, $lte: dateStr}
    }).then((order)=>{
        // console.log(order);
        // res.send({order});
        
        for(var a of order){
            //  console.log(JSON.parse(a.idproduct));
            gia+=a.price;
            for(var b of JSON.parse(a.idproduct)){
                // console.log(b.split(' '));
                var c = b.split(' ');
                var d = {
                    id: c[0],
                    total: Number(c[1])
                }
                flag = true;    
                for(var e in listProductSales){
                    if(d.id === listProductSales[e].id){
                        listProductSales[e].total += d.total;
                        flag = false;
                    }
                }
                if(flag = true){
                    listProductSales.push(d);
                }
            }
        }
        //  console.log("list",listProductSales);
        res.send({listProductSales,gia})

    })
   

})



app.get('/orderallday',(req,res)=>{
   listProductSales= [];
   gia = 0;
   Order.find().then((order)=>{
        // console.log(order);
        // res.send({order});
        for(var a of order){
            gia += a.price;
            //  console.log(JSON.parse(a.idproduct));
            for(var b of JSON.parse(a.idproduct)){
                // console.log(b.split(' '));
                var c = b.split(' ');
                var d = {
                    id: c[0],
                    total: Number(c[1])
                }
                flag = true;    
                for(var e in listProductSales){
                    if(d.id === listProductSales[e].id){
                        listProductSales[e].total += d.total;
                        flag = false;
                    }
                }
                if(flag = true){
                    listProductSales.push(d);
                }
            }
        }
         console.log("list",listProductSales);
        res.send({listProductSales,gia});

    })
   

})

app.post('/order', async (req, res) => {
    // try{
    console.log(req.file);
    var d = new Date();
     
    var date = d.getUTCDate();
    var month = d.getUTCMonth() + 1; // Since getUTCMonth() returns month from 0-11 not 1-12
    var year = d.getUTCFullYear();
     
    var dateStr = year + "-" + month + "-" + date;
    console.log(dateStr);
    var order = new Order({
        id: req.body.id,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        idproduct: req.body.idproduct,
        
        price: req.body.price,
        status: req.body.status
        ,dateOrder: dateStr

    });
    console.log(order);

    order.dateOrder instanceof Date;
    order.validateSync()
    // console.log()
    await order.save().then(order => {
        res.send(order)
    }, (e) => {
        res.status(400).send(e);
    })
})

app.post('/order/update', async (req, res) => {
    var productTmp ={
        id: req.body.id,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        idproduct: req.body.idproduct,
        price: req.body.price,
        status: req.body.status
    }
    await Order.findOneAndUpdate({id: req.body.id}, productTmp, {new: true}).then(product => {
        res.send(productTmp)
    }, (e) => {
        res.status(400).send(e);
    })
})
