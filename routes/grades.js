const express = require('express');
const {
	getGrades,
	getGrade,
	createGrade,
	updateGrade,
	deleteGrade
} = require('../controllers/grades');

const router = express.Router({mergeParams:true});

const {protect, authorize} = require('../Middleware/auth');

router.route('/').get(getGrades).post(protect, authorize('admin', 'professor'), createGrade);
router.route('/:id').get(getGrade).put(protect, authorize('admin', 'professor'), updateGrade).delete(protect, authorize('admin', 'professor'), deleteGrade);

module.exports = router;