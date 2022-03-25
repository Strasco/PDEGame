const express = require('express');
const { sellItem, buyItem, getItems } = require('../controllers/marketplace');
const advancedResults = require('../Middleware/advancedResult');

const router = express.Router();

const Marketplace = require('../models/Marketplace');

const { protect, authorize } = require('../Middleware/auth');

router
	.post('/:id', protect, authorize('admin', 'player'), sellItem)
	.put('/:id', protect, authorize('admin', 'player'), buyItem)
	.get('/', protect, authorize('admin', 'player'), advancedResults(Marketplace), getItems);

module.exports = router;
 