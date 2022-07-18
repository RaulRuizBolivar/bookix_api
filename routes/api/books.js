const router = require( 'express' ).Router()
const Book = require( '../../models/book.model' )


router.get( '/', async ( req, res ) => {
	try {
		res.json( await Book.getAll() )
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

module.exports = router