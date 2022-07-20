const { executeQuery, executeQueryOne } = require( "../helpers/utils" );

const getAction = ( { user_id, book_id, book_club_id, action } ) => {
	return executeQueryOne( 'select (select username from users where id = ? ) as user, (select name from book_club where id = ? ) as book_club, (select title from books where id = ? ) as book, action, comment from historial where user_id = ? and book_id = ? and book_club_id = ? and action = ? order by date desc', [ user_id, book_club_id, book_id, user_id, book_id, book_club_id, action ] )
}

const action = ( { user_id, book_id, book_club_id, action, comment } ) => {
	return executeQuery( 'insert into historial (user_id, book_id, book_club_id, action, comment) values (?, ?, ?, ?, ?)', [ user_id, book_id, book_club_id, action, comment ] )
}

module.exports = {
	action,
	getAction
};