const router = require( 'express' ).Router()


router.get( '/', ( req, res ) => {
	console.log( req )
	res.json( { success: 'success' } )
} )


module.exports = router