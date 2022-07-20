const router = require( 'express' ).Router()
const { checkToken } = require( '../helpers/middlewares' )

router.use( '/users', require( './api/users' ) )
router.use( '/books', checkToken, require( './api/books.js' ) )
router.use( '/book_club', checkToken, require( './api/book_club' ) )
router.use( '/genres', checkToken, require( './api/genres' ) )


module.exports = router