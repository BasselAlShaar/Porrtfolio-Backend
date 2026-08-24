import type {Request, Response} from "express";

export const sendContactMessage = (req: Request, res: Response): Response => {
	const {name, email, message} = req.body ?? {};

	if (
		typeof name !== "string" ||
		typeof email !== "string" ||
		typeof message !== "string" ||
		!name.trim() ||
		!email.trim() ||
		!message.trim()
	) {
		return res.status(400).json({
			message: "Name, email, and message are required.",
		});
	}

	return res.status(200).json({
		message: "Contact message sent successfully.",
	});
};
