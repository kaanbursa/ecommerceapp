const express = require('express');

//Database module
const ecomdb = require( __dirname + '/models/database')

//Initiate app with express
const app = express()

//Notice: we don't have a public file.
app.use(express.static('public'))

//Set views file and view engine
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')

//Start session.
app.use(session({
	secret: 'Going commando',
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: false,
		//This is one hour in milliseconds.
		maxAge: 1000 * 60 * 60
	}
}))

//Root page
app.get('/', (req, res) => {
	res.send('Hello World')
})

//////////////////////////////////////////////////////////
////////login code////////////////////////////////////////
//This login works with sessions. I don't know if it will
//conflict with passportjs.
app.post('/login', function(req,res){
	ecomdb.User.findOne( {
		where: {
			username: req.body.username
		}
	}).then( function(user) {
		
		if ( req.body.password == user.password ) { 

			//Pass form username into req.session.activeUser
			req.session.activeUser = req.body.username

			//This will then render the home page after 
			//the username and the password are confirmed. 
			res.render('home', {
				username: req.session.activeUser
			}) 
		}
		//This is what happends if the username is found but
		//not the password.
		else { 
			res.render('login', {
				loginfail: 'Password is not correct.' 
			}) 
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
})
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////




////////////////////////REGISTER////////////////////////
//The findOrCreate method will check if certain table elements
//already exist. If they do it will not create a new user. Else
//it will create the new user.
app.post('/register', function (req,res) {
	ecomdb.User.findOrCreate({
		//It checks if the entered username, email and password are available.
		//If they are available it will create all the table elements mentioned
		//here below.  
		where: {
			username: req.body.username,
			password: req.body.password,
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
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////


app.listen(3000, f => {
	console.log('Server started at 3000');
})