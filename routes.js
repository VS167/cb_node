'use strict';

const auth = require('basic-auth');
const jwt = require('jsonwebtoken');

const register = require('./functions/register');
const login = require('./functions/login');
const profile = require('./functions/profile');
const password = require('./functions/password');
const config = require('./config/config.json');
const registration = require('./functions/registration');

module.exports = router => {

	router.get('/', (req, res) => res.end('Welcome to CareBuddy !'));

	router.post('/authenticate', (req, res) => {

		const credentials = auth(req);

		if (!credentials) {

			res.status(400).json({ message: 'Invalid Request !' });

		} else {

			login.loginUser(credentials.name, credentials.pass)

			.then(result => {

				const token = jwt.sign(result, config.secret, { expiresIn: 1440 });
			
				res.status(result.status).json({ message: result.message, token: token });

			})

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});

	router.post('/users', (req, res) => {

		const name = req.body.name;
		const email = req.body.email;
		const password = req.body.password;
		const registrationId = req.body.registrationId;

		if (!name || !email || !password || !name.trim() || !email.trim() || !password.trim()) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			register.registerUser(name, email, password, registrationId)

			.then(result => {

				const token = jwt.sign(result, config.secret, { expiresIn: 1440 });
			
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
	
	router.get('/articles/:id', (req,res) => {
		var article     =   require("./models/user.articles");

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
        // fetch email and password from REST request.
        // Add strict validation when you use this in Production.
        db.header = req.body.header; 
		db.content = req.body.content;
		db.originalLink = req.body.originalLink;
		db.imageUrl = req.body.imageUrl;
		db.source = req.body.source;
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

	router.route("/articles")
    .get(function(req,res){
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
    })
	.post(function(req,res){
        var db = new article();
        var response = {};
        db.header = req.body.header; 
		db.content = req.body.content;
		db.originalLink = req.body.originalLink;
		db.imageUrl = req.body.imageUrl;
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