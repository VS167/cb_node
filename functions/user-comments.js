'use strict';

const usercomment = require('../models/user.comments');

exports.fetchDetails = (email) => 

	new Promise((resolve,reject) => {

		usercomment.find({email: email})

		.then(usercomments => {

			if (usercomments.length == 0) {

				const newUserComment = new usercomment({

			     email: email,
			     comments: ''
		      });
                newUserComment.save();

			} else {

				return usercomments[0];
				
			}
		})

		.then(usercomments => {
            resolve(usercomments);
		})
        
		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});

exports.saveDetails = (email, comment) => 

	new Promise((resolve,reject) => {

		usercomment.find({email: email})

		.then(usercomments => {

			if (usercomments.length == 0) {
                    reject({ status: 404, message: 'User Not Found !' });       

			} else {

				return usercomments[0];
				
			}
		})

		.then(usercomments => {
            usercomments.comments = comment;
            usercomments.save();
		})
        
        .then(usercomments => {
              resolve(usercomments);
              })
        
		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});

