const router = require( 'express' ).Router()
const BookClub = require( '../../models/book_club.model' )
const Book = require( '../../models/book.model' )
const Genre = require( '../../models/genre.model' )
const Subscription = require( '../../models/subscription.model' )
const User = require( '../../models/user.model' )
const { getHistorial } = require( '../../models/user.model' )

router.get( '/', async ( req, res ) => {
	try {
		let arrBookClub = await BookClub.getAll()
		for ( let bookClub of arrBookClub ) {
			let subs = await Subscription.getNumByBookClub( bookClub.id )
			bookClub.num_subscribers = subs.num_subs
		}
		res.json( arrBookClub )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )
router.get( '/historial/:bookClub_id', async ( req, res ) => {
	try {
		let historial = await BookClub.getHistorial( req.params.bookClub_id )
		for ( let value of historial ) {
			value.book = await Book.getOne( value.book )
			value.user = await User.getOne( value.user )
		}
		res.json( historial )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )
router.get( '/subscribers/:bookClub_id', async ( req, res ) => {
	try {
		res.json( await BookClub.getAllSubs( req.params.bookClub_id ) )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )

router.get( '/read/:book_club_id', async ( req, res ) => {
	try {
		res.json( await BookClub.getAllBooksRead( req.params.book_club_id ) )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )
router.get( '/user/:user_id', async ( req, res ) => {
	try {
		res.json( await BookClub.getAllByAdmin( req.params.user_id ) )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )

router.get( '/genre', async ( req, res ) => {
	try {
		let arrByGenre = await Genre.getAll()
		for ( let genre of arrByGenre ) {
			genre.book_club = await BookClub.getAllByGenre( genre.id )
		}
		res.json( arrByGenre )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )

router.get( '/genre/:genre_id', async ( req, res ) => {
	try {
		res.json( await BookClub.getAllByGenre( req.params.genre_id ) )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )



module.exports = router