const dayjs = require( "dayjs" );
const jwt = require( "jsonwebtoken" );
const Usuarios = require( "../models/usuarios.model" );

const checkToken = async ( req, res, next ) => {
  // 1 Comprobar si el token viene incluido con la peticion
  if ( !req.headers[ "authorization" ] ) {
    return res.json( { error: "El token no está en la cabecera" } );
  }
  // 2 Comprobar si el token es correcto
  const token = req.headers[ "authorization" ];
  let obj;
  try {
    obj = jwt.verify( token, "gimnasio" );
  } catch ( err ) {
    return res.json( { error: "Que 👃 de token me estas mandando?? 👹" } );
  }
  // 3 Comprobar si el token esta caducado
  if ( obj.expDate < dayjs().unix() ) {
    return res.json( { error: "El token ha caducado 🤮" } );
  }

  // Recuperar el usuario que hace la peticion --> obj.userId

  const user = await Usuarios.getById( obj.userId );
  req.user = user;

  next();
};


const checkRole = ( role ) => {
  return ( req, res, next ) => {
    if ( req.user.role !== role ) {
      return res.json( { error: "El usuario no tiene permitido el acceso ⛔️" } );
    }
    next();
  };
};

module.exports = { checkToken, checkAdmin, checkRole };
