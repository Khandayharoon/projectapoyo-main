import mongoose from "mongoose";

const ChatbotSchema = new mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	content: String,
	response: String,
}, { timestamps: true });


const ChatbotMessage = mongoose.model('ChatbotMessage', ChatbotSchema);
export default ChatbotMessage;