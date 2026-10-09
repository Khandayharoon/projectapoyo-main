import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../css/chatbot.css'; // Import your CSS file for Chatbot styling

const Chatbot = () => {
    const [question, setQuestion] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const chatEndRef = useRef(null);

    // Fetch chat history on component mount
    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/chat_history`, { withCredentials: true });
                setChatHistory(res.data);
            } catch (error) {
                console.error('Error fetching chat history', error);
            }
        };

        fetchChatHistory();
    }, []);

    // Scroll to the bottom of the chat when a new message is added
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const handleInputChange = (e) => {
        setQuestion(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/chatbot`, { question }, { withCredentials: true });
            const newMessage = { role: 'user', message: question };
            const botResponse = { role: 'bot', response: res.data.response };
            setChatHistory((prevChatHistory) => [...prevChatHistory, newMessage, botResponse]); // Append new messages to the end
            setQuestion('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/logout`, {}, { withCredentials: true });
            window.location.href = '/';
        } catch (error) {
            console.error('Error logging out', error);
        }
    };

    return (
        <div className="chatbot-container">
            <h1 className="chatbot-title">Mental Health Chatbot</h1>
            <span className="consultancy-button">
                <a href="/consultants"><button>Consultancy</button></a>
                <a href="/dashboard"><button>Dashboard</button></a> 
            </span>
            <div className="chat-history">
                {chatHistory.map((chat, index) => (
                    <div key={index} className={`message ${chat.role}`}>
                        <div className="message-bubble">
                            <p className="message-text">{chat.role === 'user' ? chat.message : chat.response}</p>
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef}></div>
            </div>
            <form onSubmit={handleSubmit} className="chat-form">
                <input
                    type="text"
                    value={question}
                    onChange={handleInputChange}
                    placeholder="Ask a question..."
                    className="input-question"
                />
                <button type="submit" className="submit-button">Submit</button>
            </form>
            {/* <button onClick={handleLogout} className="logout-button">Logout</button> */}
        </div>
    );
};

export default Chatbot;
