const express = require('express');
const courses = express.Router();
const ecomdb = require('../models/database');

courses.get('/courses', (req, res) => {
	res.render('courses')
})







module.exports = courses