import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
	title: String,
	content: String,
	tag: String,
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
}, { timestamps: true });

const Blog = mongoose.model('Blog', BlogSchema);
export default Blog;