import nodemailer from 'nodemailer';

const MAIL_PROVIDER = {
	server: "",
	username: "",
	password: "",
	sender: ""
}

export const sendMail = async (recipient, subject, body) => {
	const transporter = nodemailer.createTransport({
		host: MAIL_PROVIDER.server,
		port: 465,
		secure: true,

		auth: {
			user: MAIL_PROVIDER.username,
			pass: MAIL_PROVIDER.password,
		},
	});

	const mailOptions = {
		from: `${MAIL_PROVIDER.sender} <${MAIL_PROVIDER.username}>`,
		to: recipient,
		subject: subject,
		html: body
	};

	try {
		await transporter.sendMail(mailOptions);
		return true;
	} catch (error) {
		return false
	}
}