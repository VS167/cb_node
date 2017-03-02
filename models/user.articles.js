'use strict';


const mongoose = require('mongoose');
require('./articles');
require('./questions');
const Schema = mongoose.Schema;

const userArticleSchema = new Schema({ 
	email: { type : String , unique : true, required : true, dropDups: true },
    defaultAnswer11: String,
    defaultAnswer12: String,
    defaultAnswer2: String,
    defaultAnswer3: String,
	sent: 
		[{	
			article: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'articles'
			},
			sentAt: String,
			like: Boolean,
            dislike: Boolean,
			bookmark: Boolean,
			shared: Boolean,
			sharedDetail: String
		}]
	,
	schedule: 
		[{	
			article: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'articles'
			},
			sendAt: String
		}]
	,
	questions: 
		[{	
			question: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'questions'
			},
			sentAt: String,
            answered: Boolean,
            answeredAt: String,
			answer: String
		}]
	,
	questionschedule: 
		[{	
			question: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'questions'
			},
			sendAt: String
		}]
	
	
});

mongoose.Promise = global.Promise;

module.exports = mongoose.model('userArticle', userArticleSchema);        