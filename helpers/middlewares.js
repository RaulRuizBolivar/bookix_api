const dayjs = require( "dayjs" );
const jwt = require( "jsonwebtoken" );
const User = require( "../models/user.model" );

const checkToken = async ( req, res, next ) => {
	if ( !req.headers[ "authorization" ] ) {
		return res.json( {
			error: "No tienes token en la cabecera",
			message: req.headers
		} );
	}
	const token = req.headers[ "authorization" ];
	let obj;
	try {
		obj = jwt.verify( token, "bookix" );
	} catch ( err ) {
		return res.json( { error: err.message } );
	}
	if ( obj.expDate < dayjs().unix() ) {
		return res.json( { error: "El token ha caducado" } );
	}
	const user = await User.getOne( obj.userId );
	req.user = user;

	next();
};


module.exports = { checkToken }