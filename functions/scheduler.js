'use strict';

const sched = require('../models/schedule');
const scheduleQues = require('../models/schedule.question');
var constants = require('../constants/constants.json');

exports.sartSchedule = function() {
    var schedule = require('node-schedule');
 
    var job = schedule.scheduleJob('*/15 * * * *', function(){
        var schedule = require('../models/schedule');
        var userArticle = require('./user-articles');
        var scheduleQuestion = require('../models/schedule.question');
         var date = new Date();
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
        
        scheduleQuestion.find({"sendAt": {"$lte": newDate}}).populate('question').exec(function(err,data){
        // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
				console.log(response);
            } else {
                for(var i=0; i<data.length; i++){
                scheduleQuestion.remove({'_id': data[i]._id}, function(err1){
                if(err1) {
                response = {"error" : true,"message" : "Error deleting data"};
		    } else{
                response = {"error" : false,"message" : "Deleted"};
            }
                    });
                    
            userArticle.updateSchedulesQuestion(data[i], function(res, err){
                        
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
        var tDate = testSchedule.date;
        var moment = require('moment-timezone');
         var cDate = '';
        var timeZ = '';
        if(tDate.indexOf('(') != -1){
            var cDate = tDate.substring(0,tDate.indexOf('(')) + tDate.substring(tDate.indexOf(')')+1);
        var timeZ = tDate.substring(tDate.indexOf('(')+1, tDate.indexOf(')'));
        testSchedule.date = cDate;
        }
        
        var tryDate = moment.utc(testSchedule.date);
        if(timeZ == 'India Standard Time'){
            tryDate.utcOffset(-330);
        }else{
            tryDate.utcOffset(-330);
        }
        testSchedule.date = tryDate.format();
        if(testSchedule.questionId == ''){
        var newSchedule = new sched({

			email: testSchedule.email,
	registrationId: testSchedule.registrationId,
	article: testSchedule.articleId,
    sendAt: testSchedule.date

		});
             newSchedule.save();
            userArticle.schedule(testSchedule);
        }else if(testSchedule.articleId == ''){
            var newSchedule = new scheduleQues({

			email: testSchedule.email,
	registrationId: testSchedule.registrationId,
	    question: testSchedule.questionId,
    sendAt: testSchedule.date

		});
             newSchedule.save();
            userArticle.scheduleQuestion(testSchedule);
        };
       
    }
    callback(email);
};