const sequelize = require('sequelize')

let ecomdb = new sequelize( 
	'ecomdb', 
	process.env.POSTGRES_USER,
	process.env.POSTGRES_PASSWORD,
	{
    dialect: 'postgres'
});

//The users table model.
ecomdb.User = ecomdb.define('user', {
	firstname: sequelize.STRING,
	lastname: sequelize.STRING,
	email: sequelize.STRING,
	password: sequelize.STRING,
	username: sequelize.STRING,
	adress: sequelize.STRING
})

//The products table model.
ecomdb.Product = ecomdb.define( 'product', {
		name: sequelize.STRING,
		subject: sequelize.STRING
})

//The orders table model.
ecomdb.Order = ecomdb.define( 'order', {
		product: sequelize.STRING
})

//Table relations.
ecomdb.Order.belongsTo(ecomdb.User)
ecomdb.User.hasMany(ecomdb.Order)
ecomdb.Order.hasMany(ecomdb.Product)


//Populate the tables with users, products and orders 
ecomdb.sync({force: true}).then( done => {
	return Promise.all([
		//demo data in user table
		ecomdb.User.create({
			firstname: 'Dhova',
			lastname: 'Kin',
			email: 'dragon@gmail.com',
			password: 'werewolf',
			username: 'DhovaKing'
		}),
		ecomdb.User.create({
			firstname: 'Bruce',
			lastname: 'Banner',
			email: 'prof_Banner@hotmail.com',
			password: 'Skaar#Betty',
			username: 'NerdRage'
		}),
		ecomdb.Product.create({
			name: 'Javascript: quickstart',
			subject: 'Javascript for absolute beginners.'
		}),
		ecomdb.Product.create({
			name: 'Javascript: Trail',
			subject: 'Trail course for new students.'
		}),
	]) 
})
.then( users => {
	return Promise.all([
		//Demo data belonging to the first user.
		users[0].createOrder({
			product: "Javascript: quickstart",
		})
	])
})

module.exports = ecomdb        