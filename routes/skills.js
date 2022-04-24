const express = require('express');
const { updateSkill } = require('../controllers/skills');

const User = require('../models/User');
const advancedResults = require('../Middleware/advancedResult');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../Middleware/auth');

router.route('/:id').put(protect, authorize('player', 'admin'), updateSkill);

module.exports = router;
