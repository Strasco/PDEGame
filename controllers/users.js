const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

const asyncHandler = require('../Middleware/async');

exports.getUsers = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

exports.createUser = asyncHandler(async (req, res, next) => {
	const user = await User.create(req.body);

	res.status(200).json({
		success: true,
		data: user
	});
});

exports.getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		return next(new ErrorResponse(req.params.id, 404));
	}
	res.status(200).json({ success: true, data: user });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});

	if (!user) {
		return next(new ErrorResponse(req.params.id, 404));
	}
	return res.status(200).json({ success: true, data: user });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(new ErrorResponse(req.params.id, 404));
	}

	user.remove();
	return res.status(200).json({ success: true, data: {} });
});

exports.getInventory = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		return next(new ErrorResponse(req.params.id, 404));
	}
	console.log(user);
	res.status(200).json({ user });
});

exports.addToInventory = asyncHandler(async (req, res, next) => {
	console.log(req.body.itemCategory + ' vlaad');
	var user = await User.findById(req.params.id);
	var found = false;

	for (let index = 0; index < user.inventory.length; index++) {
		if (user.inventory[index].itemName === req.body.itemName) {
			user.inventory[index].quantity += req.body.quantity;
			found = true;
		}
	}

	if (!found) {
		user.inventory.push(req.body);
	}

	await User.updateOne({ _id: req.params.id }, user);
	res.status(200).json({ success: true, data: user });
});

exports.updateGold = asyncHandler(async (req, res, next) => {
	var user = await User.findOneAndUpdate(
		{ _id: req.params.id },
		{
			$inc: { gold: req.body.gold }
		},
		{ new: true }
	);

	if (!user) {
		return next(new ErrorResponse(req.params.id, 404));
	}
	console.log(user);
	res.status(200).json({ success: true, gold: user.gold });
});
