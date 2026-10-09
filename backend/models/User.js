import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
	fullname: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ["admin", "consultant", "user"],
		default: "user"
	},
	email: String,
	mobile: {
		type: Number,
		required: true
	},

	dob: String,
	address: String,
	profile: Object,
	public: Object,

	completed_exercises: [{
		_id: false,
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		date: {
			type: Date,
			select: false
		}
	}],

	badges: [{
		_id: false,
		level: Number,
		date: Date
	}],

	profile_complete: {
		type: Boolean,
		default: false
	},

	account: {
		recover: {
			_id: false,
			token: String,
			timestamp: String
		},
		recover_history: [{
			_id: false,
			ip: String,
			device: String,
			timestamp: Date
		}],
		login_history: [{
			_id: false,
			ip: String,
			device: String,
			timestamp: Date
		}]
	}
}, { timestamps: true });

// hash password before saving
UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}

	this.password = await bcrypt.hash(this.password, 10);
});


// password comparator
UserSchema.methods.verifyPassword = async function (input_password) {
	return await bcrypt.compare(input_password, this.password);
}

const User = mongoose.model('User', UserSchema);
export default User;