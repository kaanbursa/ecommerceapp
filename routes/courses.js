const express = require('express')
const courses = express.Router()
const ecomdb = require('../models/database')

courses.get('/', (req, res)=>{
	res.render('courses')
})

module.exports = courses