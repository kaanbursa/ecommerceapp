const express = require('express');
const router = express.Router();
const ecomdb = require( __dirname + '/../models/database');
const bcrypt = require('bcryptjs');
const bodyparser = require('body-parser')
const cookieParser = require('cookie-parser')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy


router.get('/', (req, res) => {
	
	res.render('index')
})

router.get('/login', (req, res) => {
	
	res.render('login')
})

router.get('/register', (req, res) => {
	
	res.render('register')
})

//Login with passportjs and the LocalStrategy
//First set up the strategy you wish to use.
//The local strategy is the standard way and checks
//username and password.
passport.use(new LocalStrategy(
	function(username, password, done) {
	  	ecomdb.User.findOne({ username: req.body.username }, function (err, user) {
	      if (err) { return done(err); }
	      if (!user) {
	        return done(null, false, { message: 'Incorrect username.' });
	      }
	      if (!user.validPassword(password)) {
	        return done(null, false, { message: 'Incorrect password.' });
	      }
	      return done(null, user);
	    })
  	}
))
//failureflash option set to true displays the failure messages. 
router.post('/userlogin', function(req,res){
	 passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
})






//This login works with sessions. I don't know if it will
//conflict with passportjs. This is what I used on my blog (Jose).
// router.post('/login', function(req,res){

// 	ecomdb.User.findOne( {
// 		where: {
// 			username: req.body.username
// 		}
// 	}).then( function(user) {

// 		bcrypt.compare(req.body.password, user.password, function(err, res) {

// 			if ( req.body.password == user.password ) { 

// 				//Pass form username into req.session.activeUser
// 				req.session.activeUser = req.body.username

// 				//This will then render the home page after 
// 				//the username and the password are confirmed. 
// 				res.render('home', {
// 					username: req.session.activeUser
// 				}) 
// 			}
// 			//This is what happends if the username is found but
// 			//not the password.
// 			else { 
// 				res.render('login', {
// 					loginfail: 'Password is not correct.' 
// 				}) 
// 			}	
// 		})
// 	})
// 	//If no username is found it will return nul and crash the app
// 	//this catch will conpensate for that and reload the login page.
// 	.catch( function(error) {
// 		console.log(error)
// 		return res.render('login', {
// 				loginfail: 'Username or password not found.' 
// 		}) 
// 	})
// })




////////////////////////REGISTER////////////////////////
//The findOrCreate method will check if certain table elements
//already exist. If they do it will not create a new user. Else
//it will create the new user.
router.post('/register', function (req,res) {

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
			}).then( function(register) {
				console.log(register)
			})

    	});
	});
	//The following part worked for me in my blog app.
	//Gonna try something simpler this time.
	// .spread( function(user, created) {
	// 	console.log(user.get({
	// 		plain: true
	// 	}))
	// 	console.log(created)
	// 	if (created == true) {
	// 		res.render('/', {
	// 		//registersucces: 'Registration Successful'
	// 		})
	// 	} else {
	// 		res.render('/', {
	// 		//registersucces: 'Registration Failed. Username and/or password already in use.'
	// 		})
	// 	}
	// })
})





module.exports = router;