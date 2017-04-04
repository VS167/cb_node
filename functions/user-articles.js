'use strict';

const userarticle = require('../models/user.articles');
const nodemailer = require('nodemailer');
const config = require('../config/config.json');

const sent = {article: '',
			sentAt: '',
			like: false,
            dislike: false,
			bookmark: false,
			shared: false,
			sharedDetail: ''};

const sentQues = {
    question: '',
			sentAt: '',
			answered: false,
            answeredAt: '',
			answer: ''
};

const scheduleArt = {
    article:'',
    sendAt: ''
};

const scheduleQues = {
    question:'',
    sendAt: ''
};


exports.sendArticles = (email, articleId) =>

	new Promise((resolve,reject) => {

		userarticle.find({email: email})

		.then(userarticle => {

			if (userarticle.length == 0) {

				reject({ status: 404, message: 'User Not Found !' });

			} else {

				return userarticle[0];

			}
		})

		.then(userarticle => {

            sent.article = articleId;
            sent.sentAt = new Date();
            userarticle.sent.push(sent);
            userarticle.save();
		})

        .then(userarticle => resolve({ status: 200, message: 'Success' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});

exports.saveAnswers = (email, defaultAnswer11, defaultAnswer12, defaultAnswer2, defaultAnswer3) =>

	new Promise((resolve,reject) => {

		userarticle.find({email: email})

		.then(userarticle => {

			if (userarticle.length == 0) {

				reject({ status: 404, message: 'User Not Found !' });

			} else {

				return userarticle[0];

			}
		})

		.then(userarticle => {

            userarticle.defaultAnswer11 = defaultAnswer11;
            userarticle.defaultAnswer12 = defaultAnswer12;
            userarticle.defaultAnswer2 = defaultAnswer2;
            userarticle.defaultAnswer3 = defaultAnswer3;
            userarticle.save()
		})

        .then(userarticle => resolve({ status: 200, message: 'Success' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});

exports.saveEvents = (email, id, like, dislike, bookmark, shared, sharedDetail) =>

	new Promise((resolve,reject) => {

		userarticle.find({email: email})

		.then(article => {

			if (article.length == 0) {

				reject({ status: 404, message: 'User Not Found !' });

			} else {

				return article[0];

			}
		})

		.then(userarticle => {

            for(var i=0; i<userarticle.sent.length; i++){
                if(userarticle.sent[i].article == id){
                    userarticle.sent[i].like = like;
                    userarticle.sent[i].dislike = dislike;
                    userarticle.sent[i].bookmark = bookmark;
                    userarticle.sent[i].shared = shared;
                    userarticle.sent[i].sharedDetail = sharedDetail
                    userarticle.save();
                    break;
                }

            }

		})

        .then(userarticle => resolve({ status: 200, message: 'Success' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});

exports.updateSchedules = (schedule) =>

	new Promise((resolve,reject) => {

		userarticle.find({email: schedule.email})

		.then(article => {

			if (article.length == 0) {

				reject({ status: 404, message: 'User Not Found !' });

			} else {

				return article[0];

			}
		})

		.then(userarticle => {
            sent.article = schedule.article._id;
                sent.sentAt = new Date();
                userarticle.sent.push(sent);
                return userarticle.save();

		})

        .then(userarticle => {
            return userarticle.update({ $pull: { "schedule" : { article: schedule.article._id } } });
        })

        .then(userarticle => resolve({ status: 200, message: 'Success' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});

exports.updateSchedulesQuestion = (schedule) =>

	new Promise((resolve,reject) => {

		userarticle.find({email: schedule.email})

		.then(article => {

			if (article.length == 0) {

				reject({ status: 404, message: 'User Not Found !' });

			} else {

				return article[0];

			}
		})

		.then(userarticle => {
            sentQues.question = schedule.question._id;
            sentQues.sentAt = new Date();
            userarticle.questions.push(sentQues);
            userarticle.save();
		})

        .then(userarticle => {
            return userarticle.update({ $pull: { "questionschedule" : { question: schedule.question._id } } });
        })

        .then(userarticle => resolve({ status: 200, message: 'Success' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});

exports.schedule = (schedule) =>

	new Promise((resolve,reject) => {

		userarticle.find({email: schedule.email})

		.then(article => {

			if (article.length == 0) {

				reject({ status: 404, message: 'User Not Found !' });

			} else {

				return article[0];

			}
		})

		.then(userarticle => {
            scheduleArt.article = schedule.articleId;
                scheduleArt.sendAt = new Date(schedule.date);
                userarticle.schedule.push(scheduleArt);
                return userarticle.save();

		})

        .then(userarticle => resolve({ status: 200, message: 'Success' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});


exports.scheduleQuestion = (schedule) =>

	new Promise((resolve,reject) => {

		userarticle.find({email: schedule.email})

		.then(article => {

			if (article.length == 0) {

				reject({ status: 404, message: 'User Not Found !' });

			} else {

				return article[0];

			}
		})

		.then(userarticle => {
            scheduleQues.question = schedule.questionId;
                scheduleQues.sendAt = new Date(schedule.date);
                userarticle.schedule.push(scheduleQues);
                return userarticle.save();

		})

        .then(userarticle => resolve({ status: 200, message: 'Success' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});


exports.sendQuestion = (email, quesId) =>

	new Promise((resolve,reject) => {

		userarticle.find({email: email})

		.then(userarticle => {

			if (userarticle.length == 0) {

				reject({ status: 404, message: 'User Not Found !' });

			} else {

				return userarticle[0];

			}
		})

		.then(userarticle => {

            sentQues.question = quesId;
            sentQues.sentAt = new Date();
            userarticle.questions.push(sentQues);
            userarticle.save();
		})

        .then(userarticle => resolve({ status: 200, message: 'Success' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});

exports.saveRecycleAnswers = (email, id, answer) =>

	new Promise((resolve,reject) => {

		userarticle.find({email: email})

		.then(article => {

			if (article.length == 0) {

				reject({ status: 404, message: 'User Not Found !' });

			} else {

				return article[0];

			}
		})

		.then(userarticle => {
            for(var i=0; i<userarticle.questions.length; i++){
                if(userarticle.questions[i].question == id){
                    userarticle.questions[i].answer = answer;
                    userarticle.questions[i].answered = true;
                    userarticle.questions[i].answeredAt = new Date();
                    userarticle.save();
                    break;
                }
            }

		})

		.then(userarticle => {
			const transporter = nodemailer.createTransport(`smtps://${config.email}:${config.password}@${config.mailsmtp}`);

			const mailOptions = {

    			from: `"${config.name}" <${config.email}>`,
    			to: config.email,
    			subject: email+ ' has replied - ' + answer,
    			html: `Thanks,<br>
    			CareBuddy.`

			};

			return transporter.sendMail(mailOptions);

		})

    .then(info => resolve({ status: 200, message: 'Success' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});
