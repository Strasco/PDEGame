const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

const asyncHandler = require('../Middleware/async');

exports.getUsers = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

exports.createUser = asyncHandler(async (req, res, next) => {
	console.log(req.body);
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
	console.log(req.body.itemName + 'WOWOWOWOWOW');
	var user = await User.findById(req.params.id);
	var found = false;

	for (let index = 0; index < user.inventory.length; index++) {
		if (user.inventory[index].itemName === req.body.itemName) {
			user.inventory[index].quantity += req.body.quantity;
			found = true;
			console.log('getting here');
		}
	}

	if (!found) {
		console.log('getting here NOT');
		user.inventory.push(req.body);
		console.log(user.inventory[user.inventory.length - 1].itemName + ' watch this inventory');
	}

	await User.findByIdAndUpdate({ _id: req.params.id }, user, { new: true });
	res.status(200).json({ success: true, data: user });
});

exports.updateInventory = asyncHandler(async (req, res, next) => {
	var user = await User.findByIdAndUpdate({ _id: req.params.id }, { $set: { inventory: req.body } }, { new: true });
	res.status(200).json({ success: true, data: user.inventory });
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
	console.log(user.gold);
	res.status(200).json({ success: true, gold: user.gold });
});

exports.addWorker = asyncHandler(async (req, res, next) => {
	delete req.body._id;

	var user = await User.findOneAndUpdate(
		{ _id: req.params.id },
		{
			$push: { workers: req.body }
		},
		{ new: true, upsert: true }
	);

	if (!user) {
		return next(new ErrorResponse(req.params.id, 404));
	}
	res.status(200).json({ success: true, data: user.workers[user.workers.length - 1] });
});

exports.deleteWorker = asyncHandler(async (req, res, next) => {
	var id = req.body._id;
	var user = await User.findOneAndUpdate(
		{ _id: req.params.id },
		{ $pull: { workers: { _id: req.body._id } } },
		{ new: true }
	);
	res.status(200).json({ success: true, data: id });
});

exports.upgradeHouse = asyncHandler(async (req, res, next) => {
	var user = await User.findOneAndUpdate(
		{ _id: req.params.id },
		{ $set: { houseLevel: req.body.level } },
		{ new: true }
	);

	res.status(200).json({ success: true, data: user.houseLevel });
});
