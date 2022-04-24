const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../Middleware/async');
const User = require('../models/User');

//@desc     Register User
//@route    POST /api/v1/auth/register
//@access   public
exports.register = asyncHandler(async (req, res, next) => {
	const { email, password, role, name, skills } = req.body;

	//Create user
	const user = await User.create({
		email,
		password,
		role,
		name,
		skills
	});

	//Create token
	sendTokenResponse(user, 200, res);
});

//@desc     Login User
//@route    POST /api/v1/auth/login
//@access   public
exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;
	console.log(req.body);
	//Validate email and password(credentials)
	if (!email || !password) {
		return next(new ErrorResponse('Please provide an email and passsword'), 400);
	}

	//Check for user
	const user = await User.findOne({ email }).select('+password'); //this includes the password when we find a user.

	if (!user) {
		return next(new ErrorResponse('Invalid credentials'), 401);
	}

	//Check if password matches
	const isMatch = await user.matchPassword(password);

	if (!isMatch) {
		return next(new ErrorResponse('Invalid credentials'), 401);
	}

	sendTokenResponse(user, 200, res);
});

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
	//Create token
	const token = user.getSignedJwtToken();

	const options = {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
		httpOnly: true
	};

	if (process.env.NODE_ENV === 'production') {
		options.secure = true;
	}

	res.status(statusCode).cookie('token', token, options).json({
		user: user,
		success: true,
		token
	});
};

//  @desc Get current logged in user
//  @router POST/api/v1/auth/me
//  @access private
exports.getMe = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id).populate('inventory');

	res.status(200).json({
		success: true,
		data: user
	});
});
