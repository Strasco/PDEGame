const express = require('express');
const {
	getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/users');
const User = require('../models/User');
const advancedResults = require('../Middleware/advancedResult');

const router = express.Router({mergeParams:true});

const {protect, authorize} = require('../Middleware/auth')

const populate = { //this should not be here  !!!
    select:'-_id',
    path: 'grades',
    model: 'Grade',
    select: 'grade -student -_id',
    populate:{
        path: "course",
        model: "Course",
        select: 'title -_id'
    }
}

router.route('/').get(protect, authorize('professor', 'admin'), advancedResults(User, populate), getUsers).post(protect, authorize('admin', 'professor'), createUser);
router.route('/:id').get(protect, authorize ('admin', 'professor'),getUser).put(protect, authorize('admin'), updateUser).delete(protect, authorize('admin'), deleteUser);

module.exports = router;

