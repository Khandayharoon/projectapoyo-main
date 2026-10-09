export const sendProfile = (user) => {
	const profile = { ...user._doc };
	profile.completed_exercises = profile.completed_exercises.map((item) => item.id);
	delete profile.password;
	delete profile.badges;
	return profile
}