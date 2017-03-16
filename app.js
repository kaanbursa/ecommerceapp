const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const pug = require('pug');
const session = require('express-session')



const users = require( __dirname + '/routes/users')
//Database module
const ecomdb = require( __dirname + '/models/database')

//Initiate app with express
const app = express()

//Serve static files (CSS)
app.use(express.static('static'))

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

//Router
app.use('/', users)


app.listen(3000, f => {
	console.log('Server started at 3000');
})