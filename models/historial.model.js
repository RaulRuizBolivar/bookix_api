const { executeQuery, executeQueryOne } = require( "../helpers/utils" );

const getSumVoteWeight = book_club_id => {
	return executeQueryOne( "select sum((select count(book_id) + 1 as vote_weight from historial where user_id = h.user_id and action = 'read' and book_club_id = ?)/2 )as vote_weight from historial h inner join book_club bc on h.book_club_id = bc.id where h.date > bc.changed_phase and h.book_club_id = ? and action = 'vote';", [ book_club_id, book_club_id ] )
}

const getUsersVote = ( book_club_id, book_id ) => {
	return executeQuery( "select  h.user_id as id, (select username from users where id = h.user_id) as username, (select email from users where id = h.user_id) as email, (select name from users where id = h.user_id) as name, (select image from users where id = h.user_id) as image, (select count(book_id) + 1 as vote_weight from historial where user_id = h.user_id and action = 'read' and book_club_id = ?) as vote_weight from historial h inner join book_club bc on h.book_club_id = bc.id where h.date > bc.changed_phase and h.book_club_id = ? and h.action = 'vote' and h.book_id = ?;", [ book_club_id, book_club_id, book_id ] )
}

const getArrBooksVoted = book_club_id => {
	return executeQuery( "select h.book_id as id, (select title from books where id = h.book_id) as title, (select author from books where id = h.book_id) as author, (select num_pages from books where id = h.book_id) as num_pages, (select genre from genres where id = (select genre_id from book_club where id = ?)) as genre, (select synopsis from books where id = h.book_id) as synopsis, (select front_page from books where id = h.book_id) as front_page from historial h inner join book_club bc on h.book_club_id = bc.id where h.date > bc.changed_phase and h.book_club_id = ?  and h.action = 'vote' group by h.book_id;", [ book_club_id, book_club_id ] )
}

const getVotes = async book_club_id => {
	let response = []
	const booksVoted = await getArrBooksVoted( book_club_id )
	for ( let book of booksVoted ) {
		const vote = await getSumVoteWeight( book_club_id )
		const users = await getUsersVote( book_club_id, book.id )
		response.push( {
			book: book,
			usersVoted: users,
			vote_weight: Number( vote.vote_weight )
		} )
	}
	return response
}

const getWinner = async book_club_id => {
	let books = await getVotes( book_club_id )
	return books
}

const getAction = ( { user_id, book_id, book_club_id, action } ) => {
	return executeQueryOne( 'select (select username from users where id = ? ) as user, (select name from book_club where id = ? ) as book_club, (select title from books where id = ? ) as book, action, comment from historial where user_id = ? and book_id = ? and book_club_id = ? and action = ? order by date desc', [ user_id, book_club_id, book_id, user_id, book_id, book_club_id, action ] )
}

const action = ( { user_id, book_id, book_club_id, action, comment } ) => {
	return executeQuery( 'insert into historial (user_id, book_id, book_club_id, action, comment) values (?, ?, ?, ?, ?)', [ user_id, book_id, book_club_id, action, comment ] )
}

module.exports = {
	action,
	getAction,
	getSumVoteWeight,
	getUsersVote,
	getArrBooksVoted,
	getVotes,
	getWinner
};