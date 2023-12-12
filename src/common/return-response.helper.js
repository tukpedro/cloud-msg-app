module.exports.returnResponseHelper = (result, statusCode) => {
	return {
		statusCode,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true,
			'Access-Control-Allow-Headers': 'X-API-KEY',
		},
		body: JSON.stringify(result),
	};
};
