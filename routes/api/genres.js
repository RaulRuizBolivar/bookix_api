const router = require( 'express' ).Router()
const Genre = require( '../../models/genre.model' )

router.get( '/', async ( req, res ) => {
	try {
		res.json( await Genre.getAll() )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )


module.exports = router