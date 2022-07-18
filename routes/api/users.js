const router = require( 'express' ).Router()


router.get( '/', ( req, res ) => {
	res.json( { success: 'success' } )
} )


module.exports = router