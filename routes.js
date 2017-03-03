'use strict';

const auth = require('basic-auth');
const jwt = require('jsonwebtoken');

const register = require('./functions/register');
const login = require('./functions/login');
const profile = require('./functions/profile');
const password = require('./functions/password');
const config = require('./config/config.json');
const registration = require('./functions/registration');
const userarticles = require('./functions/user-articles');
const sendFunction = require('./functions/send-message');
const imageUpload = require('./functions/upload-images');

module.exports = router => {

	router.get('/', (req, res) => res.end('Welcome to CareBuddy !'));
    
    router.post('/userarticle/:id', (req,res) => {
        const articleId = req.body._id;

			userarticles.sendArticles(req.params.id, articleId);
            
            require('./routes/routes');
            var message = req.body.header;
        var header = req.body.header;
		    var content = req.body.content;
		    var originalLink = req.body.originalLink;
		    var source = req.body.source;
		    var message = req.body.header;
        var imageUrl = req.body.imageUrl;
        var article = req.body._id;
		    
		    var registrationId = req.body.category;

		     sendFunction.sendMessage(message,header, content, imageUrl, source, originalLink, article, registrationId,function(result){
                 res.json(result);
		      })
	});
    
    router.get('/userarticle/:id', (req,res) => {
			
        var userarticle     =   require("./models/user.articles");

        var response = {};
		var resp = null;
        userarticle.find({email: req.params.id}).populate('sent.article').exec(function(err,data){
        // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
				res.json(response);
            } else {
                resp = data[0].sent;
				res.json(resp);
            }
            
        });
    });
    
    router.get('/userbookmark/:id', (req,res) => {
			
        var userarticle     =   require("./models/user.articles");

        var response = {};
		var resp = [];
        userarticle.find({email: req.params.id}).populate('sent.article').exec(function(err,data){
        // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
				res.json(response);
            } else {
                var interimData = data[0].sent;
                for(var i = 0; i<interimData.length; i++){
                    if(interimData[i].bookmark == true){
                        resp.push(interimData[i]);
                    }
                }
				res.json(resp);
            }
            
        });
    });
    
	router.post('/authenticate', (req, res) => {

		const credentials = auth(req);

		if (!credentials) {

			res.status(400).json({ message: 'Invalid Request !' });

		} else {

			login.loginUser(credentials.name, credentials.pass)

			.then(result => {

				const token = jwt.sign(result, config.secret);
			
				res.status(result.status).json({ message: result.message, token: token });

			})

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});
    
    router.get('/users', (req, res) => {

		var user     =   require("./models/user");

        var response = {};
		var resp = null;
        user.find({},function(err,data){
        // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
				res.json(response);
            } else {
                resp = data;
				res.json(resp);
            }
            
        });
    });

	router.post('/users', (req, res) => {

		const name = req.body.name;
		const email = req.body.email;
		const password = req.body.password;
        const phone = req.body.phone;
		const registrationId = req.body.registrationId;
        
		if (!name || !email || !password || !name.trim() || !email.trim() || !password.trim()) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {
             
			register.registerUser(name, email, password, phone, registrationId)

			.then(result => {

				const token = jwt.sign(result, config.secret);
			
				res.status(result.status).json({ message: result.message, token: token });

			})

			.catch(err => res.status(err.status).json({ message: err.message }));
            
            
		}
	});

	router.get('/users/:id', (req,res) => {

		if (checkToken(req)) {

			profile.getProfile(req.params.id)

			.then(result => res.json(result))

			.catch(err => res.status(err.status).json({ message: err.message }));

		} else {

			res.status(401).json({ message: 'Invalid Token !' });
		}
	});

	router.put('/users/:id', (req,res) => {

		if (checkToken(req)) {

			const oldPassword = req.body.password;
			const newPassword = req.body.newPassword;
			const registrationId = req.body.registrationId;

			if ((!oldPassword || !newPassword || !oldPassword.trim() || !newPassword.trim()) && !registrationId) {

				res.status(400).json({ message: 'Invalid Request !' });

			} else {
				
				if(registrationId){
					registration.changeRegId(req.params.id, registrationId)

					.then(result => res.status(result.status).json({ message: result.message }))

					.catch(err => res.status(err.status).json({ message: err.message }));
				}
				else{
					password.changePassword(req.params.id, oldPassword, newPassword)

					.then(result => res.status(result.status).json({ message: result.message }))

					.catch(err => res.status(err.status).json({ message: err.message }));
				}
			}
		} else {

			res.status(401).json({ message: 'Invalid Token !' });
		}
	});

	router.post('/users/:id/password', (req,res) => {

		const email = req.params.id;
		const token = req.body.token;
		const newPassword = req.body.password;

		if (!token || !newPassword || !token.trim() || !newPassword.trim()) {

			password.resetPasswordInit(email)

			.then(result => res.status(result.status).json({ message: result.message }))

			.catch(err => res.status(err.status).json({ message: err.message }));

		} else {

			password.resetPasswordFinish(email, token, newPassword)

			.then(result => res.status(result.status).json({ message: result.message }))

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});
	
	router.get('/articles', (req,res) => {
		var article     =   require("./models/articles");

        var response = {};
		var resp = null;
        article.find({},function(err,data){
        // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
				res.json(response);
            } else {
                resp = data;
				res.json(resp);
            }
            
        });
    });
	
	
	router.post('/articles', (req,res) => {
		const article     =   require("./models/articles");
        var db = new article();
        var response = {};
        
		db.category = req.body.category;
		db.subCategory = req.body.subCategory;
		db.nameId = req.body.nameId;
        db.header = req.body.header; 
		db.content = req.body.content;
		db.originalLink = req.body.originalLink;
		db.imageUrl = req.body.imageUrl;
		db.source = req.body.source;
		db.sendDefault = req.body.sendDefault;
        db.save(function(err){
        // save() will run insert() command of MongoDB.
        // it will add new data in collection.
            if(err) {
                response = {"error" : true,"message" : "Error adding data"};
            } else {
                response = {"error" : false,"message" : "Data added"};
            }
            res.json(response);
        });
    });

    router.get('/questions', (req,res) => {
		var question     =   require("./models/questions");

        var response = {};
		var resp = null;
        question.find({},function(err,data){
        // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
				res.json(response);
            } else {
                resp = data;
				res.json(resp);
            }
            
        });
    });
	
	router.post('/questions', (req,res) => {
		const question     =   require("./models/questions");
        var db = new question();
        var response = {};
        
		db.category = req.body.category;
		db.subCategory = req.body.subCategory;
		db.nameId = req.body.nameId;
        db.question = req.body.question;
		db.type = req.body.type;
		db.options = req.body.options;
		db.sendDefault = req.body.sendDefault;
        db.save(function(err){
        // save() will run insert() command of MongoDB.
        // it will add new data in collection.
            if(err) {
                response = {"error" : true,"message" : "Error adding data"};
            } else {
                response = {"error" : false,"message" : "Data added"};
            }
            res.json(response);
        });
    });
    
    router.put('/usersQuestion/:id', (req,res) => {

		if (checkToken(req)) {

			const defaultAnswer11 = req.body.answer11;
			const defaultAnswer12 = req.body.answer12;
			const defaultAnswer2 = req.body.answer2;
            const defaultAnswer3 = req.body.answer3;

            userarticles.saveAnswers(req.params.id, defaultAnswer11, defaultAnswer12, defaultAnswer2, defaultAnswer3)

			.then(result => res.status(result.status).json({ message: result.message }))

			.catch(err => res.status(err.status).json({ message: err.message }));
				
		} else {

			res.status(401).json({ message: 'Invalid Token !' });
		}
	});


router.put('/usersEvents/:id', (req,res) => {

		  const id = req.body.id;
			const like = req.body.like;
			const dislike = req.body.dislike;
			const bookmark = req.body.bookmark;
            const shared = req.body.shared;
            const sharedDetail = req.body.sharedDetail;

            userarticles.saveEvents(req.params.id, id, like, dislike, bookmark, shared, sharedDetail)

			.then(result => res.status(result.status).json({ message: result.message }))

			.catch(err => res.status(err.status).json({ message: err.message }));
				
	});


	function checkToken(req) {

		const token = req.headers['x-access-token'];

		if (token) {

			try {

  				var decoded = jwt.verify(token, config.secret);

  				return decoded.message === req.params.id;

			} catch(err) {

				return false;
			}

		} else {

			return false;
		}
	}
}