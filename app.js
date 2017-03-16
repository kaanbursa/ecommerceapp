const express = require('express');
const app = express();

app.use(express.static('public'))

app.set('view engine', 'pug')


app.get('/', (req, res) => {
	res.send('Hello World')
})

app.listen(3000, f => {
	console.log('Server started at 3000');
})