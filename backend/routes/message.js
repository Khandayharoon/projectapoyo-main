import express from 'express';
import Message from '../models/Message.js';
import { io } from '../server.js';

const router = express.Router();

// API to get a thread
router.route('/threads/:id')
	.get(async (req, res) => {
		const thread = await Message.findOne({ _id: req.params.id });
		// , $or: [{ patient: req.user._id }, { consultant: req.user._id }] 

		if (!thread) return res.status(404).json({ error: "Thread not found" });

		res.json(thread);
	})
	.post(async (req, res) => {
		const { sender, content } = req.body;
		const thread = await Message.findOne({ _id: req.params.id });;

		if (!thread) return res.status(404).json({ error: "Thread not found" });

		thread.messages.push({ sender, content });
		await thread.save();
		io.to(thread._id).emit('new-message', { sender, content });
		res.sendStatus(200);
	});

export default router;