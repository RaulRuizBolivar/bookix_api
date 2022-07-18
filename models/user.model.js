const { executeQuery, executeQueryOne } = require( "../helpers/utils" );

const getOne = user_id => {
	return executeQueryOne( 'select * from users where id = ?;', [ user_id ] )
}
const getHistorial = user_id => {
	return executeQuery( 'select * from historial where user_id = ?;', [ user_id ] )
}
const getSubscriptions = user_id => {
	return executeQuery( 'select * from subscriptions where user_id = ?;', [ user_id ] )
}


module.exports = {
	getOne, getHistorial, getSubscriptions
};