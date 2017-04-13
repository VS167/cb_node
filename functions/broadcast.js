'use strict';

const userarticle = require('../models/user.articles');
const article = require('../models/articles');
const user = require('../models/user');
const schedule = require('../models/schedule');
const question = require('../models/questions');


exports.fetchDetails = () =>

	new Promise((resolve,reject) => {
    var getArticles = new Promise((resolve,reject) => {
     article.find({})
          .then(articles => resolve({ articles }))

    .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

     });

     var getUserArticles = new Promise((resolve,reject) => {
         userarticle.find({})
          .then(userArticles => resolve({ userArticles }))

    .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

     });

    var getQuestions = new Promise((resolve,reject) => {
      question.find({})
          .then(questions => resolve({ questions }))

    .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

     });

     var getUsers = new Promise((resolve,reject) => {
       user.find({})
           .then(users => resolve({ users }))

     .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

      });

     Promise.all([getArticles, getUserArticles, getQuestions, getUsers]).then(values => {
       resolve(values);
}, reason => {
   reject(reason);
   });
});
