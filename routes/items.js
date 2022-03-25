const express = require('express');
const { getItems, createItem } = require('../controllers/items');

const router = express.Router();

const Item = require('../models/Item');

const { protect, authorize } = require('../Middleware/auth');
const advancedResults = require('../Middleware/advancedResult');

router
	.post('/', protect, authorize('admin', 'player'), createItem)
	.get('/', protect, authorize('admin', 'player'), getItems);

module.exports = router;
