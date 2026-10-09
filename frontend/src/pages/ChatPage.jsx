import axios from 'axios';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
	withCredentials: true,
});

const ChatPage = ({ threadId, role }) => {
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState('');
	const [isTyping, setIsTyping] = useState(false);

	useEffect(() => {
		axios.get(`http://localhost:5000/api/messages/threads/${threadId}`).then((response) => {
			setMessages(response.data.messages);
		});

		socket.emit('join-thread', threadId);

		socket.on('new-message', (msg) => {
			setMessages((prev) => [...prev, msg]);
		});

		socket.on('typing', (sender) => {
			if (sender !== role) {
				setIsTyping(true);
				setTimeout(() => setIsTyping(false), 2000);
			}
		});

		return () => {
			socket.off('new-message');
			socket.off('typing');
		};
	}, [threadId, role]);

	const sendMessage = async () => {
		if (message.trim()) {
			await axios.post(`http://localhost:5000/api/messages/threads/${threadId}`, {
				sender: role,
				content: message,
			});
			setMessage('');
		}
	};

	const handleTyping = () => {
		socket.emit('typing', { threadId, sender: role });
	};

	return (
		<div>
			<div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
				{messages.map((msg, index) => (
					<div key={index} style={{ margin: '10px 0' }}>
						<strong>{msg.sender}:</strong> {msg.content}
					</div>
				))}
				{isTyping && <p>Typing...</p>}
			</div>
			<input
				type="text"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				onKeyPress={handleTyping}
				placeholder="Type a message"
				style={{ width: '80%', marginRight: '10px' }}
			/>
			<button onClick={sendMessage}>Send</button>
		</div>
	);
};

export default ChatPage;
