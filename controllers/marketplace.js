const ErrorResponse = require('../utils/errorResponse');
const Marketplace = require('../models/Marketplace');
const User = require('../models/User');
const asyncHandler = require('../Middleware/async');

exports.getItems = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

exports.sellItem = asyncHandler(async (req, res, next) => {
	console.log(req.body);
	const user = await User.findById(req.params.id);
	const item = await Marketplace.create(req.body);

	for (let index = 0; index < user.inventory.length; index++) {
		if (user.inventory[index].itemName === item.itemName) {
			user.inventory[index].quantity -= req.body.itemQuantity;
			if (user.inventory[index].quantity <= 0) {
				user.inventory.splice(index, 1);
				await User.updateOne({ _id: req.params.id }, user);
			} else {
				await User.updateOne({ _id: req.params.id }, user);
			}
		}
	}

	res.status(200).json({
		success: true,
		data: item
	});
});

exports.buyItem = asyncHandler(async (req, res, next) => {
	const item = await Marketplace.findById(req.body._id);
	if (!item) {
		return next(new ErrorResponse(req.params.id, 404));
	}

	var user = await User.findById(req.params.id);
	var found = false;
	for (let index = 0; index < user.inventory.length; index++) {
		if (user.inventory[index].itemName === item.itemName) {
			user.inventory[index].quantity += req.body.itemQuantity;
			found = true;
		}
	}

	if (!found) {
		user.inventory.push({
			itemName: item.itemName,
			quantity: req.body.itemQuantity,
			itemCategory: req.body.itemCategory
		});
	}
	item.itemQuantity -= req.body.itemQuantity;

	await User.updateOne({ _id: req.params.id }, user);
	await User.findOneAndUpdate(
		{ _id: item.soldById },
		{
			$inc: { gold: req.body.total }
		},
		{ new: true }
	);

	if (item.itemQuantity <= 0) {
		await Marketplace.deleteOne({ _id: req.body._id });
	} else {
		await Marketplace.updateOne({ _id: req.body._id }, item);
	}

	res.status(200).json({
		success: true,
		data: item
	});
});
