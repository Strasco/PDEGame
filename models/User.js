const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SkillLevels = () => {
	var levels = [ 150 ];
	var multiplier = 0.11;
	for (i = 0; i < 100; i++) {
		levels.push(levels[i] + levels[i] * multiplier);
		if (multiplier > 0.1) multiplier -= 0.005;
	}

	return levels;
};

const SkillSchema = new mongoose.Schema({
	skillName: {
		type: String,
		required: [ true, 'Please add skill name' ]
	},
	skillLevel: {
		type: Number,
		default: 0
	},
	skillCurrentExp: {
		type: Number,
		default: 0
	}
});

const workerSchema = new mongoose.Schema({
	workerTier: {
		type: Number
	},
	workerType: {
		type: String
	}
});

const UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: [ true, 'Please add an email' ],
			unique: true,
			match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email' ]
		},
		role: {
			type: String,
			enum: [ 'player', 'admin' ],
			default: 'player'
		},
		gold: {
			type: Number,
			default: 0
		},
		password: {
			type: String,
			required: [ true, 'Please add a password' ],
			minlength: 6,
			select: false
		},
		resetPasswordToken: String,
		resetPasswordExpire: Date,
		createdAt: {
			type: Date,
			default: Date.now
		},
		name: {
			type: String,
			required: [ true, 'Please add name' ],
			unique: true,
			trim: true,
			maxlength: [ 50, 'Name cannot be more than 50 characters' ]
		},
		inventory: {
			type: Array
		},
		itemStats: {
			type: Object
		},
		skills: {
			type: [ SkillSchema ]
		},
		houseLevel: {
			type: Number,
			default: 0
		},
		workers: {
			type: [ workerSchema ]
		}
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

// UserSchema.virtual('items', {
// 	ref: 'Item',
// 	localField: '_id',
// 	foreignField: 'user',
// 	justOne: false
// });

//Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

//Sign JWT
UserSchema.methods.getSignedJwtToken = function() {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE
	});
};

//Match user entered password to hashed password in database.
UserSchema.methods.matchPassword = async function(enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
