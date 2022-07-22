const router = require( 'express' ).Router()
const { checkToken } = require( '../helpers/middlewares' )
const cron = require( 'node-cron' )

const BookClub = require( '../models/book_club.model' )

cron.schedule( '0 0 * * mon', () => {
	BookClub.startRead()
} )

cron.schedule( '0 0 * * sat', () => {
	BookClub.readoOrComment()
} )

cron.schedule( '0 0 * * sun', () => {
	BookClub.commentOrVote()
} )

router.use( '/users', require( './api/users' ) )
router.use( '/books', checkToken, require( './api/books.js' ) )
router.use( '/book_club', checkToken, require( './api/book_club' ) )
router.use( '/genres', checkToken, require( './api/genres' ) )


module.exports = router