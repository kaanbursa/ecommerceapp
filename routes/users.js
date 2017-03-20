const express = require('express');
const router = express.Router();
const ecomdb = require('../models/database');
const bcrypt = require('bcryptjs');
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
const helper = require('sendgrid').mail;
const sequelize= require('sequelize')
const session = require('express-session')




router.get('/', (req, res) => {
	
	res.render('index')
})

router.get('/register', (req, res) => {
	
	res.render('register')
})


router.get('/login', (req, res) => {
	
	res.render('login')
})


//This login works with sessions. I don't know if it will
//conflict with passportjs.
router.post('/login', function(req,res){

	var lwrCase = req.body.username.toLowerCase();

	ecomdb.User.findOne( {
		where: {
			username: lwrCase
			// username : req.body.username
		}
	}).then( user => {
		// if it does not find the user it will show the err
		if(user != null){
			bcrypt.compare(req.body.password, user.password, function(err, res) {

				if ( lwrCase == user.password ) { 

					//Pass form username into req.session.activeUser
					req.session.user = user.username
					//This will then render the home page after 
					//the username and the password are confirmed. 
					res.redirect('profile') 
				} else {
					throw err
				}

			})
	} else {
		res.send('something went wrong')
	}
	})

	//If no username is found it will return nul and crash the app
	//this catch will conpensate for that and reload the login page.
	.catch( function(error) {
		console.log(error)
		return res.render('login', {
				loginfail: 'Username or password not found.' 
		}) 
	})

	
});


////////////////////////REGISTER////////////////////////
//The findOrCreate method will check if certain table elements
//already exist. If they do it will not create a new user. Else
//it will create the new user.
router.post('/register', function (req,res) {
	console.log('register clicked')
		// the form of the email
		from_email = new helper.Email("test@example.com");
		to_email = new helper.Email(req.body.email);
		subject = "You have Registed to our app!!!!";
		content = new helper.Content("text/plain", "Thank you for registering");
		mail = new helper.Mail(from_email, subject, to_email, content);

	bcrypt.genSalt(10, function(err, salt) {
    	bcrypt.hash(req.body.password, salt, function(err, hash) {
        // Store hash in your password DB. 
  
			ecomdb.User.findOrCreate({
				//It checks if the entered username, email and password are available.
				//If they are available it will create all the table elements mentioned
				//here below.  
				where: {
					username: req.body.username,
					password: hash,
					email: req.body.email
				},
				defaults: {
					firstname: req.body.firstname,
					lastname: req.body.lastname,
					adress: req.body.adress
				}
			}).then( user => {

				var request = sg.emptyRequest({
  					method: 'POST',
					  path: '/v3/mail/send',
					  body: mail.toJSON()
					});
				
				req.session.user = req.body.username;

				res.redirect('/profile');
				// console.log(request);
				
			}).catch( err => {
				console.log(err);
			})

    	});
	});

})

router.get('/profile', (req, res) => {

		
		console.log(req.session.user + ' USEERRR')
		if(req.session.user == null){
			res.redirect('/')
		} else {

		ecomdb.User.findOne( {
			where: {
				username: req.session.user
			},
			include: [ {
				model: ecomdb.Order,
				include: [ ecomdb.Product ]
			} ]
		}).then( user => {
			// console.log(user + ' this is the  profile user')
			req.session.user = user;
			res.render('profile', { user: user });
		}).catch( err => {
			console.log(err);
		})
}
})





module.exports = router 