const advancedResults = (model) => async (req, res, next) => {
	let query;
	//copy of req.query for later usage
	const reqQuery = { ...req.query };
	//Fields to exclude
	const removeFields = [ 'select', 'sort', 'limit', 'page' ];

	//Loop over removeFields and delete them from reqQuery
	removeFields.forEach((param) => delete reqQuery[param]);

	//create query string
	let queryStr = JSON.stringify(reqQuery);

	//Creates all the operators in the query, GTE, GT, LTE, LT,
	queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

	//Finding resource
	query = model.find(JSON.parse(queryStr));

	//select fields
	if (req.query.select) {
		const fields = req.query.select.split(',').join(' ');
		query = query.select(fields);
	}

	//sort
	if (req.query.sort) {
		const sortBy = req.query.sort.split(',').join(' ');
		query = query.sort(sortBy);
	} else {
		query = query.sort('pricePerUnit');
	}

	//Pagination
	const page = parseInt(req.query.page, 10) || 1; //the page we are currently at
	const limit = parseInt(req.query.limit, 10) || 25; //the limit of elements displayed on the page

	//example: if we are on the third page and a limit of 10-> 3-1 = 2*10=20, we will skip a total of 20 items
	//which are also the first 2 pages, so we skip 20 and get to the third page
	const startIndex = (page - 1) * limit;

	//last index of the current page. if page is 2 and limit 10-> endIndex=20;
	const endIndex = page * limit;
	const total = await model.countDocuments(query); //gets the total amount of items we will have

	query = query.skip(startIndex).limit(limit); //jumps over the elements to display based in the limit and the page

	//Executing query
	const results = await query;

	//Pagination result
	console.log(endIndex + '  ' + total);
	const pagination = {};
	if (endIndex < total) {
		//if the last index of the current page is less than the total number of items, it means we have a next page
		pagination.next = {
			page: page + 1,
			limit
		};
	}

	if (startIndex > 0) {
		//if the first index of the current page is bigger 0 that means we have a previous page
		pagination.prev = {
			page: page - 1,
			limit
		};
	}

	res.advancedResults = {
		success: true,
		count: results.length,
		pagination,
		data: results
	};
	next();
};
module.exports = advancedResults;
