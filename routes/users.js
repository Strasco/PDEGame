const express = require('express');
const {
	getUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
	getInventory,
	updateGold,
	addToInventory
} = require('../controllers/users');
const User = require('../models/User');
const advancedResults = require('../Middleware/advancedResult');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../Middleware/auth');

router
	.route('/')
	.get(protect, authorize('player', 'admin'), advancedResults(User), getUsers)
	.post(protect, authorize('admin', 'player'), createUser);

router
	.route('/inventory/:id')
	.get(protect, authorize('player', 'admin'), getInventory)
	.put(protect, authorize('player', 'admin'), updateGold)
	.post(protect, authorize('admin', 'player'), addToInventory);

router
	.route('/:id')
	.get(protect, authorize('admin', 'player'), getUser)
	.put(protect, authorize('admin'), updateUser)
	.delete(protect, authorize('admin'), deleteUser);

module.exports = router;
