var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var router      =   express.Router();
var port     = process.env.PORT || 3000;
var io = require('socket.io');
const config = require('./config/config.json');
const mongoose = require('mongoose');
var multer = require('multer');
const fs = require('fs');
const scheduler = require('./functions/scheduler');

app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use('/resources', express.static('resources'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));
mongoose.connect(config.db);


   var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, '/apps/cb_node/resources/');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });

    var upload = multer({ //multer settings
                    storage: storage
                }).single('file');

    /** API path that will upload the files */
    app.post('/upload', function(req, res) {
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});
        });
    });

//route() will allow you to use same path for different HTTP operation.
//So if you have same URL but with different HTTP OP such as POST,GET etc
//Then use route() to remove redundant code.
var listen = app.listen(port);
var socket = io.listen(listen);
scheduler.sartSchedule();
require('./routes/routes')(app,socket);
require('./routes')(router);
app.use('/',router);

console.log("Listening to PORT 3000");
