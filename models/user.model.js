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

const create = ( { username, email, password, image, name } ) => {
	return executeQuery( "insert into users (username,email,password,image,name) values (?,?,?,?,?)", [ username, email, password, image, name ] )
}

const update = ( user_id, { username, email, password, image, name } ) => {
	return executeQuery( "update users u set username = ? , email = ? , password = ? , image = ? , name = ? where u.id = ?", [ username, email, password, image, name, user_id ] )
}

const deleteById = user_id => {
	return executeQuery( 'delete from users where id = ?', [ user_id ] )
}

module.exports = {
	getOne, getHistorial, getSubscriptions, create, update, deleteById
};