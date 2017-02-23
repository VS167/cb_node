var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var router      =   express.Router();
var port     = process.env.PORT || 3000;
var io = require('socket.io');
const config = require('./config/config.json');
const mongoose = require('mongoose');

app.use('/resources', express.static('resources'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));
mongoose.connect(config.db);

//route() will allow you to use same path for different HTTP operation.
//So if you have same URL but with different HTTP OP such as POST,GET etc
//Then use route() to remove redundant code.
var listen = app.listen(port);
var socket = io.listen(listen);
require('./routes/routes')(app,socket);
require('./routes')(router);
app.use('/',router);

console.log("Listening to PORT 3000");