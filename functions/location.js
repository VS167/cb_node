'use strict';

const location = require('../models/locations');

exports.saveLocation = (email, address, locality, sub_locality, postal, country) => 

	new Promise((resolve,reject) => {
        
    const l = new location({

			email			: email,
	address			: address,
	locality    	: locality,
	sub_locality	: sub_locality,
    country         : country,
	postal         	: postal

		});
        l.save()
		
        .then(l => resolve({ status: 200, message: 'Success' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});

