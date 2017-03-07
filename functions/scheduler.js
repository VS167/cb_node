'use strict';

const schedule = require('../models/schedule');
var constants = require('../constants/constants.json');


exports.sartSchedule = function() {
    var schedule = require('node-schedule');
 
    var job = schedule.scheduleJob('*/15 * * * *', function(){
        var x = new Date();
        console.log('The answer to life, the universe, and everything! - '+x);
    });
    
};

exports.scheduleArticles = function(email, completeJson, callback) {
    var email = email;
    
    for(var i=0; i<completeJson.length; i++){
        var testSchedule =  completeJson[i];
        if(testSchedule.questionId == ''){
        var newSchedule = new schedule({

			email: testSchedule.email,
	registrationId: testSchedule.registrationId,
	article: testSchedule.articleId,
   // question: testSchedule.questionId,
    sendAt: new Date(testSchedule.date)

		});
        }else if(testSchedule.articleId == ''){
            var newSchedule = new schedule({

			email: testSchedule.email,
	registrationId: testSchedule.registrationId,
	//article: testSchedule.articleId,
        question: testSchedule.questionId,
    sendAt: new Date(testSchedule.date)

		});
        };
        newSchedule.save();
    }
    callback(email);
};