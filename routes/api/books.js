const router = require( 'express' ).Router()
const Book = require( '../../models/book.model' )
const Genre = require( '../../models/genre.model' )


router.get( '/', async ( req, res ) => {
	try {
		let books = await Book.getAll()
		for ( let book of books ) {
			let readed = await Book.getTimesAction( book.id, 'read' )
			let voted = await Book.getTimesAction( book.id, 'vote' )
			book.times_read = readed.times
			book.times_vote = voted.times
		}
		res.json( books )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )

router.get( '/:book_id', async ( req, res ) => {
	try {
		let book = await Book.getOne( req.params.book_id )
		let readed = await Book.getTimesAction( book.id, 'read' )
		let voted = await Book.getTimesAction( book.id, 'vote' )
		book.times_read = readed.times
		book.times_vote = voted.times
		res.json( book )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )
router.get( '/genre', async ( req, res ) => {
	try {
		let arrByGenre = await Genre.getAll()
		for ( let genre of arrByGenre ) {
			genre.books = await Book.getAllByGenre( genre.id )
		}
		res.json( arrByGenre )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )

router.get( '/genre/:genre_id', async ( req, res ) => {
	try {
		res.json( await Book.getAllByGenre( req.params.genre_id ) )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )

router.get( '/larger_than/:num_pages', async ( req, res ) => {
	try {
		res.json( await Book.getLargerThan( req.params.num_pages ) )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )

router.get( '/smaller_than/:num_pages', async ( req, res ) => {
	try {
		res.json( await Book.getSmallerThan( req.params.num_pages ) )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )

router.get( '/book_club/:book_id', async ( req, res ) => {
	try {
		res.json( await Book.getAllReadBookClub( req.params.book_id ) )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )

router.post( '/', async ( req, res ) => {
	try {
		let created = await Book.create( req.body )
		res.json( await Book.getOne( created.insertId ) )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )

router.put( '/:book_id', async ( req, res ) => {
	try {
		await Book.update( req.params.book_id, req.body )
		res.json( await Book.getOne( req.params.book_id ) )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )


router.delete( '/:book_id', async ( req, res ) => {
	try {
		let borrado = await Book.getOne( req.params.book_id )
		await Book.deleteById( req.params.book_id )
		res.json( borrado )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )

module.exports = router