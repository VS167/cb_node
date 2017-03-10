'use strict';

const sched = require('../models/schedule');
const scheduleQues = require('../models/schedule.question');
var constants = require('../constants/constants.json');


exports.sartSchedule = function() {
    var schedule = require('node-schedule');
 
    var job = schedule.scheduleJob('*/15 * * * *', function(){
        var schedule = require('../models/schedule');
        var userArticle = require('./user-articles');
         var date = new Date();
        const sent = {article: '',
			sentAt: '',
			like: false,
            dislike: false,
			bookmark: false,
			shared: false,
			sharedDetail: ''}
        var parsedDate = new Date(Date.parse(date));
        var newDate = new Date(parsedDate.getTime() + (1000 * 60 * 20));
        var response = {};    
        schedule.find({"sendAt": {"$lte": newDate}}).populate('article').exec(function(err,data){
        // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
				console.log(response);
            } else {
                var sendFunction = require('./send-message');
                var userDetail = require('../models/user.articles');
                for(var i=0; i<data.length; i++){
                sendFunction.sendMessage(data[i].article.header,data[i].article.header, data[i].article.content, data[i].article.imageUrl, data[i].article.source, data[i].article.originalLink, data[i].article.article, data[i].registrationId,function(result){
                    console.log(result);
                });
                    
                schedule.remove({'_id': data[i]._id}, function(err1){
                if(err1) {
                response = {"error" : true,"message" : "Error deleting data"};
		    } else{
                response = {"error" : false,"message" : "Deleted"};
            }
                    });
                    
            userArticle.updateSchedules(data[i], function(res, err){
                        
                    });
    
                };
            };
        });
    });
};
                                   
exports.scheduleArticles = function(email, completeJson, callback) {
    var email = email;
    var userArticle = require('./user-articles');
    
    for(var i=0; i<completeJson.length; i++){
        var testSchedule =  completeJson[i];
        if(testSchedule.questionId == ''){
        var newSchedule = new sched({

			email: testSchedule.email,
	registrationId: testSchedule.registrationId,
	article: testSchedule.articleId,
    sendAt: new Date(testSchedule.date)

		});
             newSchedule.save();
            userArticle.schedule(testSchedule);
        }else if(testSchedule.articleId == ''){
            var newSchedule = new scheduleQues({

			email: testSchedule.email,
	registrationId: testSchedule.registrationId,
	    question: testSchedule.questionId,
    sendAt: new Date(testSchedule.date)

		});
             newScheduleQues.save();
        };
       
    }
    callback(email);
};