const router = require( 'express' ).Router()
const User = require( '../../models/user.model' )
const BookClub = require( '../../models/book_club.model' )
const Historial = require( '../../models/historial.model' )
const Subscription = require( '../../models/subscription.model' )
const bcrypt = require( "bcryptjs" );
const { createToken } = require( "../../helpers/utils" );
const { checkToken } = require( '../../helpers/middlewares' )

router.get( '/historial/', checkToken, async ( req, res ) => {
	try {
		res.json( await User.getHistorial( req.user.id ) )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )
router.get( '/historial/:user_id', checkToken, async ( req, res ) => {
	try {
		res.json( await User.getHistorial( req.params.user_id ) )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )
router.get( '/subscriptions', checkToken, async ( req, res ) => {
	try {
		res.json( await User.getSubscriptions( req.user.id ) )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )
router.get( '/book_club', checkToken, async ( req, res ) => {
	try {
		res.json( await BookClub.getAllByAdmin( req.user.id ) )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )
router.get( '/book_club/:user_id', async ( req, res ) => {
	try {
		res.json( await BookClub.getAllByAdmin( req.params.user_id ) )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )

router.get( '/', checkToken, async ( req, res ) => {
	try {
		res.json( await User.getOne( req.user.id ) )
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

router.post( '/subscribe/:book_club_id', checkToken, async ( req, res ) => {
	console.log( 'intento de suscripcion' )
	try {
		await User.subscribe( req.user.id, req.params.book_club_id )
		res.json( {
			success: 'Suscripción terminada con exito!'
		} )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )

router.post( '/:action/user/:user_id/book/:book_id/book_club/:book_club_id', async ( req, res ) => {
	try {
		const { user_id, book_id, book_club_id, action } = req.params
		const { comment } = req.body
		const { phase } = await BookClub.getPhase( book_club_id )
		const bookFromBookClub = await BookClub.getOne( book_club_id )
		console.log( phase )
		if ( phase !== action ) return res.json( { error: 'No puedes hacer ahora esa acción, espera a que el club de lectura se encuentre en la fase que permita ' + action } )
		if ( bookFromBookClub.book_id !== Number( book_id ) ) return res.json( { error: 'No puedes hacer una acción sobre un libro que no es el activo del club de lectura' } )
		await Historial.action( { user_id, book_id, book_club_id, action, comment } )
		res.json( await Historial.getAction( { user_id, book_id, book_club_id, action } ) )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )



router.post( '/register', async ( req, res ) => {
	console.log( req.body )
	if ( await User.getOneByUsername( req.body.username ) || await User.getOneByEmail( req.body.email ) ) return res.json( { error: "Nombre de usuario o email en uso, por favor, elija otro" } )
	try {
		req.body.password = bcrypt.hashSync( req.body.password, 12 );
		if ( !req.body.image ) req.body.image = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
		let created = await User.create( req.body )
		console.log( created )
		res.json( await User.getOne( created.insertId ) )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )

router.post( '/login', async ( req, res ) => {
	const { email, password } = req.body
	try {
		const user = await User.getOneByEmail( email )
		const iguales = bcrypt.compareSync( password, user.password )
		if ( !user && iguales ) return res.json( { error: 'Email y/o contraseña incorrectos' } )
		res.json( {
			success: "Login correcto!! ✅",
			token: createToken( user )
		} )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )


router.put( '/', checkToken, async ( req, res ) => {
	console.log( req.user )
	try {
		req.body.password = bcrypt.hashSync( req.body.password, 12 );
		let updated = await User.update( req.user.id, req.body )
		console.log( updated )
		res.json( await User.getOne( req.user.id ) )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )


router.delete( '/subscribe/:book_club_id', checkToken, async ( req, res ) => {
	try {
		await User.unsubscribe( req.user.id, req.params.book_club_id )
		res.json( {
			success: 'Suscripción terminada con exito!'
		} )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )
module.exports = router