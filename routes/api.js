const router = require( 'express' ).Router()


router.use( '/users', require( './api/users' ) )
router.use( '/books', require( './api/books.js' ) )
router.use( '/book_club', require( './api/book_club' ) )
router.use( '/genres', require( './api/genres' ) )


module.exports = router