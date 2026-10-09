export const getGreetingMessage = () => {
	const currentHour = new Date().getHours();

	let greetingMessage;
	if (currentHour >= 5 && currentHour < 12) {
		greetingMessage = "Good Morning! 🌅";
	} else if (currentHour >= 12 && currentHour < 17) {
		greetingMessage = "Good Afternoon! ☀️";
	} else if (currentHour >= 17 && currentHour < 21) {
		greetingMessage = "Good Evening! 🌆";
	} else {
		greetingMessage = "Good Night! 🌙";
	}

	return greetingMessage;
};

