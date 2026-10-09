
import express from "express";
import Exercise from "../models/Exercise.js";
import User from "../models/User.js";
import { getBadgeName } from "../utils/badges.js";

const router = express.Router();

router.route('/all')
	.get(async (req, res) => {
		const exercises = await Exercise.find().populate('author', 'fullname').sort({ createdAt: -1 });
		res.json(exercises);
	});

// create
router.route('/create')
	.post(async (req, res) => {
		const { title, content, tag } = req.body;
		if (!title || !content) return res.status(400).json({ error: "Title and content are required" });

		const newTitle = title.trim();
		const checkTitle = await Exercise.findOne({ title: newTitle });
		if (checkTitle) return res.status(400).json({ error: "Title already exists" });

		const exercise = new Exercise({
			title: newTitle,
			content: btoa(content),
			author: req.user_id,
			tag: tag.toUpperCase()
		});
		await exercise.save();

		const data = {...exercise._doc, author: {
			fullname: req.user.fullname,
			_id: req.user_id
		}};
		res.status(201).json(data);
	});

router.route('/complete')
	.post(async (req, res) => {
		const { exercise_id } = req.body;
		if (!req.user.completed_exercises.some(obj => obj.id.toString() === exercise_id)) {
			const updates = {
				completed_exercises: {
					id: exercise_id,
					date: new Date()
				}
			}

			// give badges
			const count = req.user.completed_exercises.length + 1;
			const badgeName = getBadgeName(count);
			if (badgeName[0] != "NULL") {
				updates.badges = {
					level: count,
					date: new Date()
				}
			}

			const user = await User.findByIdAndUpdate(
				req.user_id, {
				$push: updates
			}, { new: true }
			);

			return res.json({
				message: "Exercise completed",
				badge: badgeName[0] !== "NULL" ? `${badgeName[1]} ${badgeName[0]}` : null
			});
		} else {
			res.status(400).json({ error: "Exercise already completed" });
		}
	});

export default router;