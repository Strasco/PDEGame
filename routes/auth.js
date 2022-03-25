const express = require('express');
const { register, login, getMe } = require('../controllers/auth');

const router = express.Router();
const User = require('../models/User');

const { protect } = require('../Middleware/auth');
const advancedResults = require('../Middleware/advancedResult');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, advancedResults(User), getMe);

module.exports = router;
