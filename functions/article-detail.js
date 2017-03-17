'use strict';

const article = require('../models/articles');
const userarticle = require('../models/user.articles');
const question = require('../models/questions');



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

	
exports.fetchDetails = (email) =>

new Promise((resolve,reject) => {
    
  const fetchResponse = {
    'articles': [],
      'questions':  [],
      'userdetail': []
};
    
    function holdArticle(){
        
    };
    
    function holdQuestion(){
        
    };
    
        
   var getArticles = new Promise((resolve,reject) => {
		 article.find({})
         .then(articles => resolve({ articles }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });
		
    var getUsers = new Promise((resolve,reject) => {
        userarticle.find({email:email}).populate('sent.article').populate('schedule.article').populate('questions.question').populate('questionschedule.question')
         .then(userArticles => resolve({ userArticles }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });
   
   var getQuestions = new Promise((resolve,reject) => {
		 return question.find({})
         .then(questions => resolve({ questions }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });
                                  
    Promise.all([getArticles, getUsers, getQuestions]).then(values => { 
        for (var i =0; i< values[0].articles.length; i++){
            var dummyArticle = new holdArticle();
            dummyArticle.article = values[0].articles[i];
            dummyArticle.cssClass = '';
            for(var j = 0; j< values[1].userArticles[0].sent.length; j++){
               
                if(values[0].articles[i]._id == values[1].userArticles[0].sent[j].article.id){
                    dummyArticle.cssClass = 'article-sent';
                    break;
                }
            };
            if(dummyArticle.cssClass == ''){
            for(var j = 0; j< values[1].userArticles[0].schedule.length; j++){
               
                if(values[0].articles[i]._id == values[1].userArticles[0].schedule[j].article.id){
                    dummyArticle.cssClass = 'article-schedule';
                    break;
                    }
                };
            };
            if(dummyArticle.cssClass == ''){
                dummyArticle.cssClass = 'article-default';
            }
            fetchResponse.articles.push(dummyArticle);
        };
        
        fetchResponse.userdetail.push(values[1].userArticles[0]);
        
        for (var i =0; i< values[2].questions.length; i++){
            var dummyQues = new holdQuestion();
            dummyQues.question = values[2].questions[i];
            dummyQues.cssClass = '';
            for(var j = 0; j< values[1].userArticles[0].questions.length; j++){
               
                if(values[2].questions[i]._id == values[1].userArticles[0].questions[j].question.id){
                    dummyQues.cssClass = 'question-sent';
                    break;
                }
            };
            if(dummyQues.cssClass == ''){
            for(var j = 0; j< values[1].userArticles[0].questionschedule.length; j++){
               
                if(values[2].questions[i]._id == values[1].userArticles[0].questionschedule[j].question.id){
                    dummyQues.cssClass = 'question-schedule';
                    break;
                    }
                };
            };
            if(dummyQues.cssClass == ''){
                dummyQues.cssClass = 'question-default';
            }
                              
            fetchResponse.questions.push(dummyQues);
            
        };
        
                                      resolve(fetchResponse);
}, reason => {
     reject(reason);
});
   	
	});
