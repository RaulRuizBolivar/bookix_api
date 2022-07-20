const router = require( 'express' ).Router()
const User = require( '../../models/user.model' )
const BookClub = require( '../../models/book_club.model' )

router.get( '/historial/:user_id', async ( req, res ) => {
	try {
		res.json( await User.getHistorial( req.params.user_id ) )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )
router.get( '/suscripciones/:user_id', async ( req, res ) => {
	try {
		res.json( await User.getSubscriptions( req.params.user_id ) )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )
router.get( '/:user_id/book_club', async ( req, res ) => {
	let user = await User.getOne( req.params.user_id )
	user.book_club = await BookClub.getAllByAdmin( req.params.user_id )
	try {
		res.json( user )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )
router.get( '/:user_id', async ( req, res ) => {
	try {
		res.json( await User.getOne( req.params.user_id ) )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )

router.post( '/', async ( req, res ) => {
	try {
		let created = await User.create( req.body )
		console.log( created )
		res.json( await User.getOne( created.insertId ) )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )

router.post( '/comment', async ( req, res ) => {
	try {

	} catch ( err ) {
		res.json( { erros: err.message } )
	}
} )

router.put( '/:user_id', async ( req, res ) => {
	try {
		let updated = await User.update( req.params.user_id, req.body )
		console.log( updated )
		res.json( await User.getOne( req.params.user_id ) )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )

router.delete( '/:user_id', async ( req, res ) => {
	try {
		const { user_id } = req.params
		let deleted = await User.getOne( user_id )
		await User.deleteById( user_id )
		res.json( deleted )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )

module.exports = router