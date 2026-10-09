import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
	patient: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	consultant: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	messages: [Object],
});

const Message = mongoose.model('Message', MessageSchema);
export default Message;