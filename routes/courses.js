const express = require('express')
const courses = express.Router()
const ecomdb = require('../models/database')

courses.get('/courses', (req, res)=>{
	ecomdb.Product.findAll().then( courses => {
		console.log(courses)
		res.render('courses', {courses: courses})
	}).catch(err=>{
		console.log(err)
	})
	
})

courses.post('/enroll', (req, res) => {
	if(req.session.user == null){
		res.redirect('login')
	} else{ 
		ecomdb.Order.create({
			userId: req.session.id,
			product: req.body.courseId,
			payment: true
		}).then( order => {

			res.redirect('profile')
		})
	}
})

module.exports = courses;