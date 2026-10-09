import express from "express";
import Blog from "../models/Blog.js";

const router = express.Router();

router.route('/all')
	.get(async (req, res) => {
		const blogs = await Blog.find().populate('author', 'fullname').sort({ createdAt: -1 });
		res.json(blogs);
	});


router.route('/create')
	.post(async (req, res) => {
		const { title, content, tag } = req.body;
		const newTitle = title.trim();
		const checkTitle = await Blog.findOne({ title: newTitle });
		if (checkTitle) return res.status(400).json({ error: "Title already exists" });

		const blog = new Blog({
			title: newTitle,
			content: btoa(content),
			author: req.user_id,
			tag: tag.toUpperCase()
		});
		await blog.save();

		const data = await Blog.findById(blog._id).populate('author', 'fullname');
		res.status(201).json(data);
	});

export default router