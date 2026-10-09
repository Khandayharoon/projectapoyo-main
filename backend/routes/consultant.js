import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.route('/all')
	.get(async (req, res) => {
		const data = await User
			.find({
				role: 'consultant',
				profile_complete: true,
				_id: { $ne: req.user_id }
			})
			.select('fullname public')
			.sort({ createdAt: -1 });
		res.json(data);
	});

export default router;