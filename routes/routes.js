var constants = require('../constants/constants.json');
var sendFunction = require('../functions/send-message');

module.exports = function(app,io) {


	io.on('connection', function(socket){

		console.log("Client Connected");
		socket.emit('update', { message: 'Hello Client',update:false });

  		socket.on('update', function(msg){

    		console.log(msg);
  		});
	});

	app.get('/',function(req,res) {

		res.sendFile('index.html');
		
	});

	app.post('/send',function(req,res){

		var message = req.body.message;
		var registrationId = req.body.registrationId;

		sendFunction.sendMessage(message,registrationId,function(result){

			res.json(result);
		});
	});

}