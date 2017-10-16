var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var config = require('./config.json')
// var sha1 = require('sha1');
var app = express();

Product = require('./models/product');
User = require('./models/user');
Student = require('./models/student');

app.use(session({
    secret:  config.sessionSecret,
    saveUninitialized: false,
    resave: false
}));
app.use(express.static(__dirname + '/client'));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    if (req.session && req.session.user) {
        User.findOne({
            username: req.session.user.username
        }, function(err, user) {
            if (user) {
                req.userID = user._id;
                delete req.session.user.password;
                req.session.userID = user._id;
                res.locals.userID = user._id;
            }
            next();
        });
    } else {
        next();
    }
});

function requireLogin(req, res, next) {
    if (!req.userID) {
        res.sendStatus(401);
    } else {
        next();
    }
}
function requireBeYourSelf(req,res,next){
    if(req.body.id==req.userID){
        next();
    }
    else {
      res.sendStatus(401);
    }
}
function requireMaster(req, res, next) {
    User.findOne({
        _id: req.userID
    }, function(err, u) {
        if (u && u.master) {
            next();
        } else {
            res.sendStatus(401);
        }
    });
}
function requireNotOdin(req,res,next){
  User.findOne({_id:req.params._id},function(err,u){
  if (err) {
    throw err;
  }
  if(u.odin){
    res.sendStatus(401);
  }
  else{
    next()
  }
})
}
// Connect to Mongoose
var uri ="mongodb://"+ config.dbUser+":"+ config.dbPass+"@ds035177.mlab.com:35177/kiosk";
mongoose.connect(uri,function(err){
  if(err){console.log("shit");}
});

// var db = mongoose.connect('mongodb://localhost/kiosk');


/*
Login methods
*/
app.get('/api/loggedin', function(req, res) {
    User.findOne({
        _id: req.userID
    }, function(err, u) {
        if (u) {
            res.send({
                username: u.username,
                master: u.master,
                id:u._id
            });
        } else {
            res.send(false);
        }
    });
});

app.post('/api/login', function(req, res) {
    User.findOne({
        'username': req.body.username
    }, function(err, u) {
        if (err) {
            throw err;
        }
        if (!u) {
            res.send('wrong username');
        } else {
            u.comparePassword(req.body.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    req.session.user = u;
                    // keepSignIn=req.body.keepSignIn;
                    res.sendStatus(200)
                } else {
                    res.send('wrong password');
                }
            });
        }
    });
});

app.post('/api/logout', requireLogin, function(req, res) {
    req.session.destroy();
    res.sendStatus(200);
});

/*
  Get data
*/
app.get('/api/products', requireLogin, function(req, res) {
    Product.getProducts(function(err, products) {
        if (err) {
            throw err;
        }
        res.json(products);
    });
});

app.get('/api/students', requireLogin, function(req, res) {
    Student.getStudents(function(err, students) {
        if (err) {
            throw err;
        }
        res.json(students);
    });
});

app.get('/api/users', requireMaster, function(req, res) {
    User.getUsers(function(err, students) {
        if (err) {
            throw err;
        }
        for (var i = 0; i < students.length; i++) {
            delete students[i]['password'];
            delete students[i]['master'];
        }
        res.json(students);
    });
});

app.post('/api/users/reset/:_id', requireMaster,requireNotOdin, function(req, res) {
    User.resetUser(req.params._id, {
        new: true
    }, function(err, user) {
        if (err) throw err;
        res.sendStatus(200);
    });
});

/*
  Get by ID
*/
app.get('/api/products/:_id', requireLogin, function(req, res) {
    Product.getProductById(req.params._id, function(err, product) {
        if (err) {
            throw err;
        }
        res.json(product);
    });
});

app.get('/api/students/:_id', requireMaster, function(req, res) {
    Student.getStudentById(req.params._id, function(err, student) {
        if (err) {
            throw err;
        }
        res.json(student);
    });
});

app.get('/api/clear/transactions/:_id', requireMaster, function(req, res) {
    Student.findOneAndUpdate({_id:req.params._id},{$unset:{transactions:1}},
      {multi:true},function(err,doc){
        if(err){throw err;}
        res.sendStatus(200);
    });
});

/*
  Add document to Database
*/
app.post('/api/add/product', requireMaster, function(req, res) {
    var product = req.body;
    Product.addProduct(product, function(err, product) {
        if (err) {
            throw err;
        }
        res.json(product);
    });
});

app.post('/api/add/user', requireMaster, function(req, res) {
    var username = req.body.username;
    User.addUser(username,false, function(err) {
        if (err) {
            throw err
        }
        res.sendStatus(200);
    });
});

app.post('/api/transaction/',requireLogin,function(req,res){
  var studentID = req.body.studentID;
  var product = req.body.product;
  var transaction={
    productName:product.name,
    quantity:req.body.quantity,
    productPrice:product.price,
    time:req.body.timeStamp
  };
  var totPrice=req.body.quantity*product.price;
  Student.findOneAndUpdate({_id:studentID}, {$inc:{debt:totPrice},
    $push:{transactions:transaction}},function(err,res){
    if(err){throw err;}
  });
  Product.findOneAndUpdate({_id:product._id}, {$inc:{stock:-req.body.quantity}},function(err,res){
    if(err){throw err;}
  });
  res.sendStatus(200);
});

app.post('/api/password',requireBeYourSelf,requireLogin,function(req,res){
  User.changePass(req.body.id,req.body.newPass, req.body.oldPass,function(err,success){
    if(err){throw err}
    if(success){
    res.sendStatus(200);
  }
  });

});

/*
  Change document in Database
*/
app.put('/api/products/:_id', requireMaster, function(req, res) {
    var id = req.params._id;
    var product = req.body;
    Product.updateProduct(id, product, {}, function(err, product) {
        if (err) {
            throw err;
        }
        res.json(product);
    });
});


app.put('/api/students/:_id', requireMaster, function(req, res) {
    var id = req.params._id;
    var student = req.body;
    Student.updateStudent(id, student, {}, function(err, student) {
        if (err) {
            throw err;
        }
        res.json(student);
    });
});

/*
  Delete document in Database
*/
app.delete('/api/products/:_id', requireMaster, function(req, res) {
    var id = req.params._id;
    Product.removeProduct(id, function(err, product) {
        if (err) {
            throw err;
        }
        res.json(product);
    });
});

app.delete('/api/users/:_id', requireMaster,requireNotOdin, function(req, res) {
    var id = req.params._id;
    User.removeUser(id, function(err, user) {
        if (err) {
            throw err;
        }
        res.json(user);
    });
});


app.listen(process.env.PORT||3000);
console.log('Running on port '+(process.env.PORT||3000)+'...');
