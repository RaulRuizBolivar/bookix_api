const { executeQuery, executeQueryOne } = require( "../helpers/utils" );

const getAll = () => {
	return executeQuery( 'select * from book_club;' )
}
const getOne = bookClub_id => {
	return executeQueryOne( 'select * from book_club where id = ?', [ bookClub_id ] )
}
const getAllByAdmin = user_id => {
	return executeQuery( 'select bc.id,bc.num_pages,bc.creation_date,bc.name,bc.image,bc.phase, g.genre,bc.user_id from book_club bc  inner join genres g on bc.genre_id = g.id where user_id = ?', [ user_id ] )

}
const getHistorial = bookClub_id => {
	return executeQuery( 'select  h.book_id book,  h.book_club_id book_club,  h.user_id user,  h.action,  h.comment ,h.date from historial h where h.book_club_id = ? order by h.date desc;', [ bookClub_id ] )
}
const getAllByGenre = genre_id => {
	return executeQuery( 'select bc.* from book_club as bc where genre_id = ?;', [ genre_id ] )
}
const getAllSubs = bookClub_id => {
	return executeQuery( 'select  u.id, u.username, u.email, u.image, u.name from users u inner join subscriptions s on s.user_id = u.id where s.book_club_id = ?', [ bookClub_id ] )
}

const getAllBooksRead = bookClub_id => {
	return executeQuery( "select b.id, b.title, b.author, b.num_pages, g.genre, b.synopsis, b.front_page from books b inner join historial h on h.book_id = b.id inner join genres g on b.genre_id = g.id where h.book_club_id = ? and h.action = 'read';", [ bookClub_id ] )
}

module.exports = {
	getAllByAdmin,
	getAllByGenre,
	getAll,
	getAllSubs,
	getAllBooksRead,
	getHistorial,
	getOne
};