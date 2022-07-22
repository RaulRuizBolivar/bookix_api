const { executeQuery, executeQueryOne } = require( '../helpers/utils' )

const getNumByBookClub = bookClub_id => {
	return executeQueryOne( 'select count(user_id) as num_subs from subscriptions where book_club_id = ?', [ bookClub_id ] )
}

const deleteById = user_id => {
	return executeQuery( 'delete from subscriptions where user_id = ?', [ user_id ] )
}

module.exports = {
	getNumByBookClub,
	deleteById
}