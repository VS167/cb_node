'use strict';

const userarticle = require('../models/user.articles');
const sent = {article: '',
			sentAt: '',
			like: false,
            dislike: false,
			bookmark: false,
			shared: false,
			sharedDetail: ''};


exports.sendArticles = (email, articleId) => 

	new Promise((resolve,reject) => {

		userarticle.find({email: email})

		.then(userarticle => {

			if (userarticle.length == 0) {

				reject({ status: 404, message: 'User Not Found !' });

			} else {

				return userarticle[0];
				
			}
		})
		
		.then(userarticle => {
            
            sent.article = articleId;
            sent.sentAt = new Date();
            userarticle.sent.push(sent);
            userarticle.save();
		})
        
        .then(userarticle => resolve({ status: 200, message: 'Success' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});

exports.saveAnswers = (email, defaultAnswer11, defaultAnswer12, defaultAnswer2, defaultAnswer3) => 

	new Promise((resolve,reject) => {

		userarticle.find({email: email})

		.then(userarticle => {

			if (userarticle.length == 0) {

				reject({ status: 404, message: 'User Not Found !' });

			} else {

				return userarticle[0];
				
			}
		})
		
		.then(userarticle => {
            
            userarticle.defaultAnswer11 = defaultAnswer11;
            userarticle.defaultAnswer12 = defaultAnswer12;
            userarticle.defaultAnswer2 = defaultAnswer2;
            userarticle.defaultAnswer3 = defaultAnswer3;
            userarticle.save();
		})
        
        .then(userarticle => resolve({ status: 200, message: 'Success' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});

exports.saveEvents = (email, id, like, dislike, bookmark, shared, sharedDetail) => 

	new Promise((resolve,reject) => {

		userarticle.find({email: email})

		.then(article => {

			if (article.length == 0) {

				reject({ status: 404, message: 'User Not Found !' });

			} else {

				return article[0];
				
			}
		})
		
		.then(userarticle => {
            
            for(var i=0; i<userarticle.sent.length; i++){
                if(userarticle.sent[i].article == id){
                    userarticle.sent[i].like = like;
                    userarticle.sent[i].dislike = dislike;
                    userarticle.sent[i].bookmark = bookmark;
                    userarticle.sent[i].shared = shared;
                    userarticle.sent[i].sharedDetail = sharedDetail
                    userarticle.save();
                    break;
                }
                
            }
            
		})
        
        .then(userarticle => resolve({ status: 200, message: 'Success' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});