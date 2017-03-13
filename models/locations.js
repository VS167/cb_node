'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const locationSchema = new Schema({ 

	email			: String,
	address			: String,
	locality    	: String,
	sub_locality	: String,
    country         : String,
	postal         	: String,
    state           : String,
    record_date     : Date
});

mongoose.Promise = global.Promise;

module.exports = mongoose.model('locations', locationSchema);        