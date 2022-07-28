const { executeQuery, executeQueryOne } = require( "../helpers/utils" );


const getAll = () => {
	return executeQuery( 'select b.id,b.title,b.author,b.num_pages,g.genre,b.genre_id,b.synopsis, b.front_page from books b inner join genres g on g.id = b.genre_id order by b.id;' )
}

const getOne = book_id => {
	return executeQueryOne( 'select books.* ,(select genre from genres where id = genre_id) as genre from books where id = ?', [ book_id ] )
}

const getAllByGenre = genre_id => {
	return executeQuery( 'select b.* from books as b where genre_id = ?;', [ genre_id ] )
}

const getAllByAuthor = author => {
	return executeQuery( 'select * from books where author = ?', [ author ] )
}

const getLargerThan = num_pages => {
	return executeQuery( 'select * from books where num_pages >= ? order by num_pages desc', [ num_pages ] )
}

const getSmallerThan = num_pages => {
	return executeQuery( 'select * from books where num_pages <= ? order by num_pages asc', [ num_pages ] )
}

const getTimesAction = ( book_id, action ) => {
	return executeQueryOne( "select count(user_id) as times from historial where book_id = ? and action = ?", [ book_id, action ] )
}

const getAllReadBookClub = book_id => {
	return executeQuery( "select bc.*, count(h.book_club_id) as users_read from book_club bc inner join historial h on bc.id = h.book_club_id where h.book_id = ? and h.action = 'read' GROUP BY bc.id;", [ book_id ] )
}


const create = ( { title, author, num_pages, genre_id, synopsis, front_page } ) => {
	return executeQuery( 'insert into books (title,author,num_pages,genre_id,synopsis,front_page) values (?,?,?,?,?,?)', [ title, author, num_pages, genre_id, synopsis, front_page ] )
}

const update = ( id, { title, author, num_pages, genre_id, synopsis, front_page } ) => {
	return executeQuery( 'update books set title = ?, author = ? , num_pages = ? , genre_id = ? , synopsis = ? , front_page = ?  where id = ?', [ title, author, num_pages, genre_id, synopsis, front_page, id ] )
}

const deleteById = book_id => {
	return executeQuery( 'delete from books where id = ?', [ book_id ] )
}


module.exports = {
	getAll,
	getAllByGenre,
	getAllByAuthor,
	getLargerThan,
	getSmallerThan,
	getOne,
	getTimesAction,
	getAllReadBookClub,
	create,
	update,
	deleteById
};