const { executeQuery, executeQueryOne } = require( "../helpers/utils" );
const Book = require( './book.model' )
const Historial = require( './historial.model' )


const getAll = () => {
	return executeQuery( 'select * from book_club;' )
}
const getOne = bookClub_id => {
	return executeQueryOne( 'select  bc.*, (select genre from genres where id = genre_id) as genre , (select username from users where id = user_id) as user , (select title from books where id = book_id) as book from book_club bc where id = ?;', [ bookClub_id ] )
}
const getAllByAdmin = user_id => {
	return executeQuery( 'select bc.id,bc.num_pages,bc.creation_date,bc.name,bc.image,bc.phase, g.genre,bc.user_id from book_club bc  inner join genres g on bc.genre_id = g.id where user_id = ?', [ user_id ] )

}
const getHistorial = bookClub_id => {
	return executeQuery( 'select  (select username from users where id = h.user_id) as username, (select name from users where id = h.user_id) as name, (select image from users where id = h.user_id) as image, (select front_page from books where id = h.book_id) as front_page, (select title from books where id = h.book_id) as title,(select author from books where id = h.book_id) as author,(select num_pages from books where id = h.book_id) as num_pages,(select synopsis from books where id = h.book_id) as synopsis, action, date, comment,book_id from historial h  where h.book_club_id = ? order by h.date desc;', [ bookClub_id ] )
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

const getPhase = bookClub_id => {
	return executeQueryOne( "select phase from book_club where id = ?", [ bookClub_id ] )
}

const setPhase = ( phase, book_club_id ) => {
	return executeQueryOne( 'update book_club set phase = ? where id = ?', [ phase, book_club_id ] )
}

const setMissingPages = ( missingPages, book_club_id ) => {
	return executeQueryOne( 'update book_club set missing_pages = ? where id = ?', [ missingPages, book_club_id ] )
}

const setNewBook = ( newBook_id, book_club_id ) => {
	return executeQueryOne( 'update book_club set book_id = ? where id = ?', [ newBook_id, book_club_id ] )
}


const create = ( { num_pages, name, image, phase, genre_id, user_id } ) => {
	if ( !image ) image = 'https://www.pamplona.es/sites/default/files/inline-images/libros_biblioteca-web_2.jpg'
	return executeQuery( 'insert into book_club (num_pages, name, image, phase, genre_id, user_id) values (?,?,?,?,?,?)', [ num_pages, name, image, phase, genre_id, user_id ] )
}

const update = ( id, { num_pages, name, image, phase, genre_id, user_id } ) => {
	if ( !image ) image = 'https://www.pamplona.es/sites/default/files/inline-images/libros_biblioteca-web_2.jpg'
	return executeQuery( 'update book_club set num_pages = ?, name = ?, image = ? , phase = ? , genre_id = ? , user_id = ?  where id = ?', [ num_pages, name, image, phase, genre_id, user_id, id ] )
}

const deleteById = book_id => {
	return executeQuery( 'delete from book_club where id = ?', [ book_id ] )
}

const startRead = async () => {
	const allBookClub = await getAll()
	for ( const bookClub of allBookClub ) {
		await setPhase( 'read', bookClub.id )
		if ( bookClub.missing_pages < 0 ) {
			const books = await Historial.getWinner( bookClub.id )
			let winner = {
				book: books[ 0 ],
				weight: 0
			}
			for ( let vote of books ) {
				if ( vote.vote_weight > winner.weight ) {
					winner.book = vote.book
					winner.weight = vote.vote_weight
				}
			}
			setNewBook( winner.book.id, bookClub.id )
			setMissingPages( winner.book.num_pages, bookClub.id )
		}
		const newMissingPages = bookClub.missing_pages - bookClub.num_pages
		await setMissingPages( newMissingPages, bookClub.id )
	}
	console.log( 'Todos los clubs de lectura ahora están leyendo' )
}

const readoOrComment = async () => {
	const allBookClub = await getAll()
	for ( const bookClub of allBookClub ) {
		console.log( bookClub.missing_pages )
		if ( bookClub.missing_pages < 0 ) {
			console.log( bookClub.name + ': Ahora está comentando' )
			return await setPhase( 'comment', bookClub.id )
		}
		await setPhase( 'read', bookClub.id )
	}
}

const commentOrVote = async () => {
	const allBookClub = await getAll()
	console.log( 'commentOrVote' )
	for ( const bookClub of allBookClub ) {
		console.log( bookClub.missing_pages )
		if ( bookClub.missing_pages < 0 ) {
			console.log( bookClub.name + ': Ahora está votando' )
			return await setPhase( 'vote', bookClub.id )
		}
		console.log( bookClub.name + ': Ahora está comentando' )
		await setPhase( 'comment', bookClub.id )
	}
}

module.exports = {
	getAllByAdmin,
	getAllByGenre,
	getAll,
	getAllSubs,
	getAllBooksRead,
	getHistorial,
	getOne,
	create,
	update,
	deleteById,
	getPhase,
	setPhase,
	setMissingPages,
	startRead,
	readoOrComment,
	commentOrVote,
	setNewBook
};