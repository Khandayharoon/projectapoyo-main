import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import http from 'http';
import { Server } from 'socket.io';

// import utils
import { authMiddleware } from './middlewares/auth.js';

// import routes
import authRoutes from "./routes/auth.js";
import blogRoutes from "./routes/blog.js";
import profileRoutes from "./routes/profile.js";
import exerciseRoutes from "./routes/exercise.js";
import consultantRoutes from "./routes/consultant.js";
import messageRoutes from "./routes/message.js";

// ------------------- SERVER APP -------------------- //
dotenv.config()
const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"],
		credentials: true,
	},
});

// -------- MIDDLEWARES -------- //
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
	.then(() => console.log('Connected to MongoDB'))
	.catch(err => console.error('Could not connect to MongoDB', err));

// Routes
app.get('/', (req, res) => res.json({ message: "Welcome to Apoyo API" }));
app.use("/api/auth/", authRoutes);
app.use("/api/blog/", authMiddleware, blogRoutes);
app.use("/api/exercise/", authMiddleware, exerciseRoutes);
app.use("/api/profile/", authMiddleware, profileRoutes);
app.use("/api/consultant/", authMiddleware, consultantRoutes);
app.use("/api/messages/", messageRoutes);

// --------------- CHAT SERVER ---------------- //
io.on('connection', (socket) => {
	console.log('A user connected:', socket.id);

	socket.on('join-thread', (threadId) => {
		socket.join(threadId);
	});

	socket.on('typing', (data) => {
		io.to(data.threadId).emit('typing', data.sender);
	});

	socket.on('disconnect', () => {
		console.log('A user disconnected:', socket.id);
	});
});

server.listen(5000, () => console.log('Server running on port 5000'));
