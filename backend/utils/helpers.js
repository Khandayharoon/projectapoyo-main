export const randomString = (len = 6) => {
	let res = "";
	const opt = "abcdghijkmoqrstuwxyzABCDGHJKLMOQRSTUWXYZ123456789";
	const n = opt.length;
	for (let i = 0; i < len; i++) {
		res += opt.charAt(Math.floor(Math.random() * n));
	}

	return res;
}