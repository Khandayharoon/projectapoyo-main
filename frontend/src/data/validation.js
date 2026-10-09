export const validation_auth_username = {
	required: {
		value: true,
		message: "Username is required"
	},
	minLength: {
		value: 5,
		message: "Username should be atleast 6 characters long"
	}
}


export const validation_auth_fullname = {
	required: {
		value: true,
		message: "Fullname is required"
	},
	minLength: {
		value: 4,
		message: "Fullname should be atleast 4 characters long"
	}
}

export const validation_auth_password = {
	required: {
		value: true,
		message: "Password is required"
	},
	minLength: {
		value: 8,
		message: "Password should be atleast 8 characters long"
	}
}

export const validation_auth_email = {
	required: {
		value: true,
		message: "Email address is required"
	},
	pattern: {
		value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
		message: "Enter a valid email address"
	}
}

export const validation_auth_mobile = {
	required: {
		value: true,
		message: "Mobile number is required"
	},
	minLength: {
		value: 10,
		message: "Enter 10 digit mobile number"
	},
	maxLength: {
		value: 10,
		message: "Enter 10 digit mobile number"
	},
	pattern: {
		value: /^[1-9][0-9]{9}$/,
		message: "Enter a valid mobile number"
	}
}


export const validation_auth_dob = {
	required: {
		value: true,
		message: "Date of Birth is required"
	},
	pattern: {
		value: /^\d{4}-\d{2}-\d{2}$/,
		message: "Enter a valid date of birth"
	},
	min: {
		value: "1900-01-01",
		message: "Enter a valid date of birth"
	},
	max: {
		value: new Date().toISOString().split('T')[0],
		message: "Enter a valid date of birth"
	}
}