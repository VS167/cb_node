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
      'userdetail': [],
      'mergeList': [],
      'networkList': [],
      'articledetails': [],
      'articlelabels': ['Total Sent', 'Liked', 'Disliked', 'Bookmarked'],
	  'series': ['Series A'],
      'likebycatdata': [],
	 'likelables': [],
	 'likebysubdata': [],
	 'likesublables': [],
	 'dislikebycatdata': [],
	 'dislikelables': [],
	 'dislikebysubdata': [],
	 'dislikesublables': [],
	 'bookmark': [],
	 'bookmarklabels': []
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
        
		var like = 0;
		var dislike = 0;
		var bookmark = 0;
		var total = 0;
        function holdCategoryDummy() {
		
	   };
	   function holdSubCatDummy() {
		
	   };
        var HashMap = require('hashmap');
	   var categoryDetailDummy = new HashMap();
	   var subCatDetailDummy = new HashMap();
	
        var addThisCat = true;
        var addThisSubCat = true;
		
		
    
        //Merge Arrays - Start
        var articleLength = fetchResponse.userdetail[0].sent.length;
        var questionLength = fetchResponse.userdetail[0].questions.length;
        var holdQuesLength = 0;
        for (var i=0; i< articleLength; i++){
            if(holdQuesLength < questionLength){
          if  (new Date(fetchResponse.userdetail[0].sent[i].sentAt) < new Date(fetchResponse.userdetail[0].questions[holdQuesLength].sentAt)) {
              fetchResponse.mergeList.push(fetchResponse.userdetail[0].sent[i]);
              fetchResponse.networkList.push(fetchResponse.userdetail[0].sent[i]);
          }else{
              fetchResponse.mergeList.push(fetchResponse.userdetail[0].questions[holdQuesLength]);
              fetchResponse.networkList.push(fetchResponse.userdetail[0].questions[holdQuesLength]);
              fetchResponse.mergeList.push(fetchResponse.userdetail[0].sent[i]);
              fetchResponse.networkList.push(fetchResponse.userdetail[0].sent[i]);
              holdQuesLength++;
          }
        }else{
                fetchResponse.mergeList.push(fetchResponse.userdetail[0].sent[i]);
              fetchResponse.networkList.push(fetchResponse.userdetail[0].sent[i]);
            }
            
            
            if ( fetchResponse.userdetail[0].sent[i].like) {
				like++;
                if(categoryDetailDummy.has(fetchResponse.userdetail[0].sent[i].article.category)){
                    categoryDetailDummy.get(fetchResponse.userdetail[0].sent[i].article.category).like++;
                }else{
                    categoryDetailDummy.set(fetchResponse.userdetail[0].sent[i].article.category, {'like': 1, 'dislike': 0, 'bookmark': 0});
                };
                if(subCatDetailDummy.has(fetchResponse.userdetail[0].sent[i].subCategory)){
                    subCatDetailDummy.get(fetchResponse.userdetail[0].sent[i].article.subCategory).like++;
                }else{
                    subCatDetailDummy.set(fetchResponse.userdetail[0].sent[i].article.subCategory, {'like': 1, 'dislike': 0, 'bookmark': 0});
                };
			};
			if ( fetchResponse.userdetail[0].sent[i].dislike) {
				dislike++;
                if(categoryDetailDummy.has(fetchResponse.userdetail[0].sent[i].article.category)){
                    categoryDetailDummy.get(fetchResponse.userdetail[0].sent[i].article.category).dislike++;
                }else{
                    categoryDetailDummy.set(fetchResponse.userdetail[0].sent[i].article.category, {'like': 0, 'dislike': 1, 'bookmark': 0});
                };
                if(subCatDetailDummy.has(fetchResponse.userdetail[0].sent[i].article.subCategory)){
                    subCatDetailDummy.get(fetchResponse.userdetail[0].sent[i].article.subCategory).dislike++;
                }else{
                    subCatDetailDummy.set(fetchResponse.userdetail[0].sent[i].article.subCategory, {'like': 0, 'dislike': 1, 'bookmark': 0});
                };
			};
			if ( fetchResponse.userdetail[0].sent[i].bookmark) {
				bookmark++
                if(categoryDetailDummy.has( fetchResponse.userdetail[0].sent[i].article.category)){
                    categoryDetailDummy.get(fetchResponse.userdetail[0].sent[i].article.category).bookmark++;
                }else{
                    categoryDetailDummy.set(fetchResponse.userdetail[0].sent[i].article.category, {'like': 0, 'dislike': 0, 'bookmark': 1});
                };
                if(subCatDetailDummy.has(fetchResponse.userdetail[0].sent[i].article.subCategory)){
                    subCatDetailDummy.get(fetchResponse.userdetail[0].sent[i].article.subCategory).bookmark++;
                }else{
                    subCatDetailDummy.set(fetchResponse.userdetail[0].sent[i].article.subCategory, {'like': 0, 'dislike': 0, 'bookmark': 1});
                };
			};
			total++;
            };
        
        if(holdQuesLength<questionLength){
            for (var i=holdQuesLength; i< questionLength; i++){
                fetchResponse.mergeList.push(fetchResponse.userdetail[0].questions[i]);
              fetchResponse.networkList.push(fetchResponse.userdetail[0].questions[i]);
              
            };
        };
        
        fetchResponse.articledetails.push(total);
        fetchResponse.articledetails.push(like);
        fetchResponse.articledetails.push(dislike);
        fetchResponse.articledetails.push(bookmark);
        categoryDetailDummy.forEach(function(value, key){
            fetchResponse.likelables.push(key);
				fetchResponse.likebycatdata.push(value.like);
				fetchResponse.dislikelables.push(key);
				fetchResponse.dislikebycatdata.push(value.dislike);
				fetchResponse.bookmarklabels.push(key);
				fetchResponse.bookmark.push(value.bookmark);
            
        });
        subCatDetailDummy.forEach(function(value, key){
            fetchResponse.likesublables.push(key);
				fetchResponse.likebysubdata.push(value.like);
				fetchResponse.dislikesublables.push(key);
				fetchResponse.dislikebysubdata.push(value.dislike);
        });
        
		//Merge Arrays - Ends
         resolve(fetchResponse);
}, reason => {
     reject(reason);
});
   	
	});
