const { executeQuery, executeQueryOne } = require( "../helpers/utils" );

const getAll = () => {
	return executeQuery( 'select b.id,b.title,b.author,b.num_pages,g.genre,b.genre_id,b.synopsis, b.front_page from books b inner join genres g on g.id = b.genre_id;' )
}
const getAllByGenre = genre_id => {
	return executeQuery( 'select b.* from books as b where genre_id = ?;', [ genre_id ] )
}

const getAllByAuthor = author => {
	return executeQuery( 'select * from books where author = ?', [ author ] )
}

const getLargerThan = num_pages => {
	return executeQuery( 'select * from books where num_pages >= ?', [ num_pages ] )
}

const getSmallerThan = num_pages => {
	return executeQuery( 'select * from books where num_pages <= ?', [ num_pages ] )
}

const getAllTitleIncludes = include => {
	return executeQuery( 'select * from books where title like ?', [ '%' + include + '%' ] )
}

const getOne = book_id => {
	return executeQueryOne( '', [ book_id ] )
}

module.exports = {
	getAll,
	getAllByGenre,
	getAllByAuthor,
	getLargerThan,
	getSmallerThan,
	getAllTitleIncludes,
	getOne
};