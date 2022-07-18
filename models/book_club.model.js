const { executeQuery, executeQueryOne } = require( "../helpers/utils" );

const getAllByAdmin = user_id => {
	return executeQuery( 'select * from book_club where user_id = ?', [ user_id ] )
}


module.exports = {
	getAllByAdmin
};