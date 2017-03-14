'use strict';

const article = require('../models/articles');

exports.editArticle = (id, category, subCategory,nameId, header,content, originalLink, imageUrl, source, sendDefault) => 

	new Promise((resolve,reject) => {

		article.find({_id: id})

		.then(articles => {

			if (articles.length == 0) {

				reject({ status: 404, message: 'User Not Found !' });

			} else {

				return articles[0];
				
			}
		})

		.then(article => {
            article.category = category;
            article.subCategory = subCategory;
            article.nameId = nameId;
            article.header = header;
            article.content = content;
            article.originalLink = originalLink;
            article.imageUrl = imageUrl;
            article.source = source;
            article.sendDefault = sendDefault;
            article.save()
		})
        
        .then(article => resolve({ status: 200, message: 'Success' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});

	
