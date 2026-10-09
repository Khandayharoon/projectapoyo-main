import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Blog from "../models/Blog.js";
import Exercise from "../models/Exercise.js";
import { sendProfile } from "../utils/profile.js";

const router = express.Router();
router.route('/me')
	.get(async (req, res) => {
		const profile = sendProfile(req.user);
		res.json(profile);
	});


router.route('/password')
	.post(async (req, res) => {
		const { old_password, new_password } = req.body;
		console.log(await bcrypt.hash(new_password, 10));

		if (!old_password || !new_password) return res.status(400).json({ error: "Please provide both old and new passwords" });

		const user = await User.findById(req.user._id);
		const isMatch = await bcrypt.compare(old_password, user.password);

		if (!isMatch) return res.status(400).json({ error: "Invalid current password" });

		user.password = new_password;
		await user.save();
		res.json({ message: "Password updated successfully" });
	})

router.route("/update")
	.put(async (req, res) => {
		const { fullname, email, dob, mobile, specialization, location, bio, allow_messages } = req.body;
		if (!fullname || !email || !dob || !mobile) return res.status(400).json({ error: "Please provide all fields" });

		const user = await User.findById(req.user._id).select("-badges -account -password -createdAt -updatedAt -__v");
		user.fullname = fullname;
		user.email = email;
		user.dob = dob;
		user.mobile = mobile;

		if (req.user.role === "consultant") {
			user.public = { specialization, location, bio, allow_messages };
			user.profile_complete = true;
		}
		await user.save();
		res.json({ message: "Profile updated successfully", profile: user });
	})

router.route("/badges")
	.get(async (req, res) => {
		const badges = [...req.user.badges];
		badges.sort((a, b) => new Date(b.date) - new Date(a.date));
		badges.push({ level: 0, date: req.user.createdAt })
		res.json(badges);
	});

router.route("/dashboard")
	.get(async (req, res) => {
		let data = {};
		const completed_exercises = req.user?.completed_exercises.map((item) => item.id);

		if (req.user.role === "consultant") {
			data = {
				blogs: await Blog.countDocuments({ author: req.user_id }),
				exercises: await Exercise.countDocuments({ author: req.user_id }),
				badges: req.user?.badges.length || 0
			}
		} else {
			data = {
				exercises: req.user?.completed_exercises.length || 0,
				badges: req.user?.badges.length || 0,
				chats: 0
			}
		}
		res.json(data);
	})


export default router;