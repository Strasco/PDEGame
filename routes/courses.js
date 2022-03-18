const express = require('express');
const {
	getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses');

const router = express.Router({mergeParams:true});

const {protect, authorize} = require('../Middleware/auth')


router.route('/').get(getCourses).post(protect, authorize('admin', 'professor'), createCourse);
router.route('/:id').get(getCourse).put(protect, authorize('admin', 'professor'), updateCourse).delete(protect, authorize('admin'), deleteCourse);

module.exports = router;