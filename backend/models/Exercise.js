import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
	title: String,
	content: String,
	tag: String,
	icon: String,
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
}, { timestamps: true });

const Exercise = mongoose.model('Exercise', ExerciseSchema);
export default Exercise;