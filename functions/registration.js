'use strict';

const user = require('../models/user');
const config = require('../config/config.json');

exports.changeRegId = (email, registrationId) => 

new Promise((resolve, reject) => {

		user.find({ email: email })

		.then(users => {

			let user = users[0];
			
				user.registrationId = registrationId;

				return user.save();

		})

		.then(user => resolve({ status: 200, message: '' }))

		.catch(err => reject({ status: 500, message: '' }));

	});
