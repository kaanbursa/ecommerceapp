const express = require('express')
const bodyParser = require('body-parser')
const pug = require('pug')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')

//Router module
const users = require( __dirname + '/routes/users')

//Database module
const ecomdb = require( __dirname + '/models/database')

//Initiate app with express
const app = express()

//Serve static files (CSS)
app.use(express.static('static'))

//Use bodyparser
app.use( bodyParser.urlencoded( { extended: true}))

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

//Router for users
app.use('/', users)

//cookieParser
app.use(cookieParser())

//extra app configurations for passportjs
app.use(passport.initialize())
app.use(passport.session())








//The server
app.listen(3000, f => {
	console.log('Server started at 3000');
})