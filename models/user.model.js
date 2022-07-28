const { executeQuery, executeQueryOne } = require( "../helpers/utils" );

const Historial = require( './historial.model' )

const getOne = user_id => {
	return executeQueryOne( 'select * from users where id = ?;', [ user_id ] )
}
const getOneByEmail = email => {
	return executeQueryOne( 'select * from users where email = ?;', [ email ] )
}
const getOneByUsername = username => {
	return executeQueryOne( 'select * from users where username = ?', [ username ] )
}
const getHistorial = user_id => {
	return executeQuery( 'select (select username from users where id = ?) as username, (select name from users where id = ?) as name, (select image from users where id = ?) as image, action, date, comment, (select title from books where id = historial.book_id) as title,(select author from books where id = historial.book_id) as author,(select num_pages from books where id = historial.book_id) as num_pages, (select front_page from books where id = historial.book_id) as front_page, (select id from books where id = historial.book_id) as book_id from historial where user_id = ? order by date desc;', [ user_id, user_id, user_id, user_id ] )
}
const getSubscriptions = user_id => {
	return executeQuery( 'select (select name from book_club where id = subscriptions.book_club_id) as name,(select image from book_club where id = subscriptions.book_club_id) as image, subscriptions.* from subscriptions where user_id = ?;', [ user_id ] )
}

const subscribe = ( user_id, book_club_id ) => {
	console.log( 'subscribe' )
	return executeQuery( 'insert into subscriptions (user_id,book_club_id) values(?,?)', [ user_id, book_club_id ] )
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

const unsubscribe = ( user_id, book_club_id ) => {
	return executeQuery( 'delete from subscriptions where user_id = ? and book_club_id = ? ', [ user_id, book_club_id ] )
}

const readAll = async ( book_club_id, book_id, arrSubs ) => {
	let response = []
	for ( let sub of arrSubs ) {
		let read = await Historial.action( { user_id: sub.id, book_id: book_id, book_club_id: book_club_id, action: 'read', comment: '' } )
		response.push( read )
		console.log( '###########' + sub.name + ' ha leido ' + book_id + '###########' )
	}
	return response
}

module.exports = {
	getOne,
	getHistorial,
	getSubscriptions,
	create,
	update,
	deleteById,
	getOneByEmail,
	getOneByUsername,
	subscribe,
	unsubscribe,
	readAll
};