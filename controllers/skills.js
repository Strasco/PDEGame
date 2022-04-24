const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

const asyncHandler = require('../Middleware/async');

exports.updateSkill = asyncHandler(async (req, res, next) => {
	var user = await User.findOneAndUpdate(
		{ _id: req.params.id, 'skills.skillName': req.body.skill },
		{
			$set: {
				'skills.$.skillCurrentExp': req.body.exp,
				'skills.$.skillLevel': req.body.level
			}
		},
		{ new: true }
	);
	if (!user) {
		return next(new ErrorResponse(req.params.id, 404));
	}
	res.status(200).json({ success: true, data: user.skills });
});
