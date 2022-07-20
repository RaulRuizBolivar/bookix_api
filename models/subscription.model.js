const { executeQuery, executeQueryOne } = require( '../helpers/utils' )

const getNumByBookClub = bookClub_id => {
	return executeQueryOne( 'select count(user_id) as num_subs from subscriptions where book_club_id = ?', [ bookClub_id ] )
}

module.exports = {
	getNumByBookClub
}