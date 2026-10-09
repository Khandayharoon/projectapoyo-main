import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { sendProfile } from "../utils/profile.js";
import { randomString } from "../../frontend/src/data/utils.js";
import { sendMail } from "../services/mail.js";

const router = express.Router();

/**
 * REGISTER CONTROLLER
 */
router.route('/register')
	.post(async (req, res) => {
		let msg = undefined;
		const { fullname, email, mobile, consultant } = req.body;

		// INPUT VALIDATION
		if (!fullname || fullname.length < 4) {
			msg = "Fullname should be atleast 4 characters long";
		} else if (!email) {
			msg = "Please provide a valid email address";
		} else if (!mobile) {
			msg = "Please provide a valid mobile number";
		}

		if (msg) {
			res.status(400).json({ error: msg });
			return;
		}

		// CHECK IF ALREADY EXIST
		const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
		if (existingUser) {
			const already_exist = existingUser.email == email ? "Email address" : "Mobile number";
			return res.status(400).json({ error: `${already_exist} already exists` });
		}

		// PRE-PROCESS STUFF
		const role = consultant ? "consultant" : "user";
		const password = randomString(8).toUpperCase();

		// SEND TO DATABASE
		const user = await User.create({
			fullname,
			role,
			email,
			mobile,
			password
		});

		if (user) {
			await sendMail(email, `Welcome to Apoyo!`, `Dear ${fullname},<br/>Welcome to APOYO,<br/>Your account password is ${password}<br/><br/>Thanks for registering...`);
			res.status(201).json({ message: "Account created successfully and password has been sent to your mail box" });
		} else {
			res.status(400).json({ error: "Unable to process your request, please try again later!" })
		}
	});


/**
 * LOGIN CONTROLLER
 */
router.route('/login')
	.post(async (req, res) => {
		const { email, password } = req.body;
		if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

		const user = await User.findOne({ email }, { badges: 0, __v: 0, account: 0 });
		if (!user || !await user.verifyPassword(password)) {
			return res.status(400).json({ error: "Invalid Email or password" });
		}

		const token = jwt.sign({
			user_id: user._id.toString()
		},
			process.env.JWT_SECRET,
			{ expiresIn: process.env.JWT_VALIDITY }
		);

		res.cookie('authtoken', token, { httpOnly: true, secure: false });
		res.json({ message: `Welcome back ${user.fullname}!`, profile: sendProfile(user) });
	});

/**
 * RECOVER CONTROLLER
 */

router.route("/recover")
	.post(async (req, res) => {
		const { email } = req.body;
		if (!email) return res.status(400).json({ error: "Email address is required" });

		// check user
		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ error: "No user found with this email address" });

		// generate token
		const token = randomString(32);
		const link = `${process.env.APP_URL}/api/auth/reset/${token}`;
		user.account.recover = {
			token,
			timestamp: Date.now()
		}

		// save user
		await user.save();

		// send mail
		await sendMail(user.email, "Password recovery", `Dear ${user.fullname},<br/>Your password recovery link is <a href="${link}">${link}</a><br/>Valid for 10 minutes only<br/>Thanks for using our services...`);
		res.json({ message: "Recovery link has been sent to your email address" });
	})

/**
 * RESET CONTROLLER
 */
router.route("/reset/:token")
	.get(async (req, res) => {
		const { token } = req.params;
		if (!token) return res.status(400).send("<h1>Invalid request</h1>");

		// check user
		const user = await User.findOne({ "account.recover.token": token });
		if (!user) return res.status(400).send("<h1>Invalid recovery link</h1>");

		// check timestamp
		const { timestamp } = user.account.recover;
		const diff = Date.now() - new Date(timestamp);
		console.log(timestamp, new Date(), diff);


		if (diff > 10000) return res.status(400).send("<h1>Recovery link expired, please request a new link!</h1>");

		// generate new password
		const password = randomString(8).toUpperCase();

		// update password
		user.password = password;
		user.account.recover = {};
		await user.save();
		
		// send mail
		await sendMail(user.email, "Password recovery", `Dear ${user.fullname},<br/>Your new password is ${password}<br/>Thanks for using our services...`);
		res.send("<h1>Password has been reset and sent to your email address</h1>");
	})

router.route('/logout')
	.post((req, res) => {
		res.clearCookie('authtoken');
		res.json({ message: 'Logged out successfully' });
	});


export default router;