'use strict';

const user = require('../models/user');
const userArticle = require('../models/user.articles');
const articles = require('../models/articles');
const bcrypt = require('bcryptjs');

exports.registerUser = (name, email, password, phone, registrationId) => 

	new Promise((resolve,reject) => {

	    const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt);
        var sent = {article: '',
			sentAt: '',
			like: false,
            dislike: false,
			bookmark: false,
			shared: false,
			sharedDetail: ''};

		const newUser = new user({

			name: name,
			email: email,
			hashed_password: hash,
			created_at: new Date(),
			registrationId: registrationId,
            phone: phone

		});
        
        
        newUser.save().then(() => {
            //continue
        })
        .catch(err => {

			if (err.code == 11000) {
						
				reject({ status: 409, message: 'User Already Registered !' });
                return;

			} else {

				reject({ status: 500, message: 'Internal Server Error !' });
                return;
			}
		})
        .then(() => {
            return this.getDefaultArticles();
        })
        .then(defaultArt => {
            const newUserArt = new userArticle({
              email: email
            });
    
            if(defaultArt.length > 0){
            for(var i=0; i< defaultArt.length; i++){
             sent.article = defaultArt[i]._id;
                sent.sentAt = new Date();
                newUserArt.sent.push(sent);    
            };
                newUserArt.save();
            }else{
                reject({ status: 409, message: 'No Default Articles Present!' });
            }
                
        })
        .then(() =>      resolve({ status: 201, message: email }))
        .catch(err => {

			if (err.code == 11000) {
						
				reject({ status: 409, message: 'User Already Registered !' });
                return;

			} else {

				reject({ status: 500, message: 'Internal Server Error !' });
                return;
			}
		});
	});

exports.getDefaultArticles = () =>

new Promise((resolve, reject) => {
    
     articles.find({'sendDefault': true})
     
        .then(articles => 
              {
              if (articles.length == 0) {

				reject({ status: 404, message: 'User Not Found !' });

			} else {

				return articles;
				
			     }
            })
        .then(articles => resolve(articles))

		.catch(err => 
               reject({ status: 500, message: '' }));

	});