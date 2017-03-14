const express = require('express');

//Database module
const ecomdb = require( __dirname + '/models/database')

//Initiate app with express
const app = express()

app.use(express.static('public'))

//Set views file and view engine
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')


app.get('/', (req, res) => {
	res.send('Hello World')
})

app.listen(3000, f => {
	console.log('Server started at 3000');
})