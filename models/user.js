'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({ 

	name 			: String,
	email			: { type : String , unique : true, required : true, dropDups: true },
	phone			: String,
	hashed_password	: String,
	created_at		: String,
	temp_password	: String,
	temp_password_time: String,
	registrationId	: String
	
});

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/cbData');

module.exports = mongoose.model('user', userSchema);        