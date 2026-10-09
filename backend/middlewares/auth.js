import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
	const token = req.cookies?.authtoken;
	if (!token) {
		return res.status(403).json({ message: 'Unauthorized access, please login first!' });
	}

	try {
		const { user_id } = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(user_id).select("-password -account -__v");
		if (!user) return res.status(404).json({ error: "User not found" });

		req.user = user;
		req.user_id = user._id.toString();
		next();
	} catch (err) {
		return res.status(403).json({ message: 'Unauthorized access, please login first!' });
	}
}