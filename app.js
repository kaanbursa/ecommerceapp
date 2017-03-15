const express = require('express');
const bodyParser = require('body-parser');
const pug = require('pug');

const users = require( __dirname + '/routes/users')
//Database module
const ecomdb = require( __dirname + '/models/database')

//Initiate app with express
const app = express()

app.use(express.static('static'))

//Set views file and view engine
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')


app.use('/', users)

app.listen(3000, f => {
	console.log('Server started at 3000');
})