app.get('/cart', (req, res) => {
    console.log( 'these items are in your cart(first one counted twice): ', req.session.order )
    Promise.all(req.session.order.map( function(item) {
        console.log(item)
        return db.product.findOne({
            where: {
                name: item
            }
        } )
    } ) )
        .then( stuff  => {
        console.log('these should be the chosen products: ', stuff)
        res.render('shopcart', { products: stuff } ) 
        } )
} )