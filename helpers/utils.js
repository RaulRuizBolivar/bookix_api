const dayjs = require( "dayjs" );
const jwt = require( "jsonwebtoken" );

const executeQuery = ( pQuery, values = [] ) => {
  return new Promise( ( resolve, reject ) => {
    db.query( pQuery, values, ( err, result ) => {
      if ( err ) return reject( err );
      resolve( result );
    } );
  } );
};

// Solo lo ejecutamos cuando en una query de SELECT queremos recuperar un unico elemento
const executeQueryOne = ( pQuery, values ) => {
  return new Promise( ( resolve, reject ) => {
    db.query( pQuery, values, ( err, result ) => {
      if ( err ) return reject( err );
      if ( result.length === 0 ) return resolve( null );
      resolve( result[ 0 ] );
    } );
  } );
};

const createToken = ( user ) => {
  const obj = {
    userId: user.id,
    expDate: dayjs().add( 1, "days" ).unix(),
  };
  return jwt.sign( obj, "bookix" );
};

module.exports = { executeQuery, executeQueryOne, createToken };