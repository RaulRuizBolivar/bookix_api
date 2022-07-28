const router = require( 'express' ).Router()
const { checkToken } = require( '../helpers/middlewares' )
const cron = require( 'node-cron' )

const BookClub = require( '../models/book_club.model' )

// cron.schedule( '0 0 * * mon', () => {
// 	BookClub.startRead()
// } )

// cron.schedule( '0 0 * * sat', () => {
// 	BookClub.readoOrComment()
// } )

// cron.schedule( '0 0 * * sun', () => {
// 	BookClub.commentOrVote()
// } )
cron.schedule( '0,5,10,15,20,25,30,35,40,45,50,55 * * * *', () => {
	BookClub.startRead()
} )

cron.schedule( '3,8,13,18,23,28,33,38,43,48,53,58 * * * *', () => {
	BookClub.readoOrComment()
} )

cron.schedule( '4,9,14,19,24,29,34,39,44,49,54,59 * * * *', () => {
	BookClub.commentOrVote()
} )

router.use( '/users', require( './api/users' ) )
router.use( '/books', checkToken, require( './api/books.js' ) )
router.use( '/book_club', checkToken, require( './api/book_club' ) )
router.use( '/genres', checkToken, require( './api/genres' ) )


module.exports = router