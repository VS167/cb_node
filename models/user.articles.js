'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userArticleSchema = new Schema({ 
	email: { type : String , unique : true, required : true, dropDups: true },
	sent: {
		[{	
			article: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'articles'
			},
			sentAt: String,
			like: boolean,
			bookmark: boolean,
			shared: boolean,
			shareddettail: String
		}]
	},
	scheduled: {
		[{	
			article: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'articles'
			},
			sentAt: String
		}]
	}
	
});

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/cbData');

module.exports = mongoose.model('user', userSchema);        