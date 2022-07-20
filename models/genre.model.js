const { executeQuery, executeQueryOne } = require( '../helpers/utils' )

const getAll = () => {
	return executeQuery( 'select * from genres' )
}

module.exports = {
	getAll
}