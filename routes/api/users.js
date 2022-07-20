const router = require( 'express' ).Router()
const User = require( '../../models/user.model' )
const BookClub = require( '../../models/book_club.model' )
const Historial = require( '../../models/historial.model' )
const bcrypt = require( "bcryptjs" );
const { body, validationResult } = require( "express-validator" );
const { createToken } = require( "../../helpers/utils" );

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
		req.body.password = bcrypt.hashSync( req.body.password, 12 );
		let created = await User.create( req.body )
		console.log( created )
		res.json( await User.getOne( created.insertId ) )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )

router.post( '/:action/user/:user_id/book/:book_id/book_club/:book_club_id', async ( req, res ) => {
	try {
		const { user_id, book_id, book_club_id, action } = req.params
		const { comment } = req.body
		await Historial.action( { user_id, book_id, book_club_id, action, comment } )
		res.json( await Historial.getAction( { user_id, book_id, book_club_id, action } ) )
	} catch ( err ) {
		res.json( { erro1: err.message } )
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