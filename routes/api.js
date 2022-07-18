const router = require( 'express' ).Router()


router.use( '/users', require( './api/users' ) )
router.use( '/books', require( './api/books.js' ) )


module.exports = router