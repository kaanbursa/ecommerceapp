const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const pug = require('pug');
const session = require('express-session')


const users = require( __dirname + '/routes/users')
const courses = require( __dirname + '/routes/courses')
//Database module
const ecomdb = require( __dirname + '/models/database')

app.use(bodyParser.urlencoded({ extended: false}))


//Serve static files (CSS)
app.use(express.static('public'))
// app.use('/public', express.static( __dirname + '/public') )


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
app.use('/', courses)

app.get('/contact', (req,res) =>{
	res.render('contact')
})




app.listen(3000, f => {
	console.log('Server started at 3000');
})