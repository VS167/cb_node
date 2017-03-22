'use strict';


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userCommentSchema = new Schema({ 
	email: { type : String , unique : true, required : true, dropDups: true },
    comments: String
	
});

mongoose.Promise = global.Promise;

module.exports = mongoose.model('userComments', userCommentSchema);        