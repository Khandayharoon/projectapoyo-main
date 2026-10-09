
export const setAuthToken = (token) => {
	localStorage.setItem("apoyo_token", token);
}

export const unsetAuthToken = () => {
	localStorage.removeItem("apoyo_token");
}

export const getAuthToken = () => {
	const token = localStorage.getItem("apoyo_token");
	if (token) {
		return token;
	}
	return false;
}

export const randomString = (len = 6) => {
	let res = "";
	const opt = "abcdghijkmoqrstuwxyzABCDGHJKLMOQRSTUWXYZ123456789";
	const n = opt.length;
	for (let i = 0; i < len; i++) {
		res += opt.charAt(Math.floor(Math.random() * n));
	}

	return res;
}

export const isAdminOrDoctor = (profile) => {
	if(profile && (profile.role === 'admin' || profile.role === 'consultant')){
		return true;
	}
	return false;
}