import type { Request, Response } from 'express';
import config from 'config';
import { validatePassword } from '../services/user.service';
import {
	createSession,
	findSessions,
	updateSession
} from '../services/session.service';
import { signJwt } from '../utils/jwt.utils';

async function createUserSessionHandler(req: Request, res: Response) {
	const user = await validatePassword(req.body);

	if (!user) {
		return res.status(401).send('Invalid email or password');
	}

	const session = await createSession(user._id, req.get('user-agent') ?? '');

	const accessToken = signJwt(
		{
			...user,
			session: session._id
		},
		{
			expiresIn: config.get<string>('accessTokenTtl') // 15 minutes
		}
	);

	const refreshToken = signJwt(
		{
			...user,
			session: session._id
		},
		{
			expiresIn: config.get<string>('refreshTokenTtl') // 1 year
		}
	);

	return res.send({ accessToken, refreshToken });
}

async function getUserSessionsHandler(req: Request, res: Response) {
	const userId = res.locals.user._id;

	const sessions = await findSessions({ user: userId, valid: true });

	return res.send(sessions);
}

async function deleteSessionHandler(req: Request, res: Response) {
	const sessionId = res.locals.user.session;

	await updateSession({ _id: sessionId }, { valid: false });

	return res.send({
		accessToken: null,
		refreshToken: null
	});
}

export {
	createUserSessionHandler,
	getUserSessionsHandler,
	deleteSessionHandler
};
