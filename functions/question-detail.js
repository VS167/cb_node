'use strict';

const questionModel = require('../models/questions');

exports.editQuestion = (id, category, subCategory,nameId, questionD, type, options, sendDefault) => 

	new Promise((resolve,reject) => {

		questionModel.find({_id: id})

		.then(questions => {

			if (questions.length == 0) {

				reject({ status: 404, message: 'User Not Found !' });

			} else {

				return questions[0];
				
			}
		})

		.then(question => {
            question.category = category;
            question.subCategory = subCategory;
            question.nameId = nameId;
            question.question = questionD;
            question.type = type;
            question.options = options;
            question.sendDefault = sendDefault;
            question.save()
		})
        
        .then(question => resolve({ status: 200, message: 'Success' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});

	
