import type { Request, Response } from 'express';
import logger from '../utils/logger';
import { createUser, findUser } from '../services/user.service';
import errorHandler from '../utils/errorHandler';
import { type CreateUserInput } from '../schema/user.schema';

async function createUserHandler(
	req: Request<{}, {}, CreateUserInput['body']>,
	res: Response
) {
	try {
		const user = await findUser({
			email: req.body.email
		});
		if (user) {
			return res
				.status(409)
				.send('Email is already in use. Please use a different email address.');
		}

		const newUser = await createUser(req.body);
		return res.send(newUser);
	} catch (error) {
		const { message } = errorHandler(error);
		logger.error(message);
		res.status(409).send(message);
	}
}

export { createUserHandler };
