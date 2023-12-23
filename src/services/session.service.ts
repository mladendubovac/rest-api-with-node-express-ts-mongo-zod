import { FilterQuery, UpdateQuery } from 'mongoose';
import config from 'config';
import get from 'lodash/get';
import SessionModel, { SessionDocument } from '../models/session.model';
import { signJwt, verifyJwt } from '../utils/jwt.utils';
import { findUser } from './user.service';

async function createSession(userId: string, userAgent: string) {
	const session = await SessionModel.create({
		user: userId,
		userAgent
	});
	return session.toJSON();
}

async function findSessions(query: FilterQuery<SessionDocument>) {
	return SessionModel.find(query).lean();
}

async function updateSession(
	query: FilterQuery<SessionDocument>,
	update: UpdateQuery<SessionDocument>
) {
	return SessionModel.updateOne(query, update);
}

async function reIssueAccessToken({ refreshToken }: { refreshToken: string }) {
	const { decoded, expired, valid } = verifyJwt(refreshToken);

	if (!decoded || !get(decoded, 'session')) {
		return false;
	}

	const session = await SessionModel.findById(get(decoded, 'session'));

	if (!session || !session?.valid) {
		return false;
	}

	const user = await findUser({ _id: session.user });

	if (!user) {
		return false;
	}

	const accessToken = signJwt(
		{
			...user,
			session: session._id
		},
		{
			expiresIn: config.get<string>('accessTokenTtl') // 15 minutes
		}
	);

	return accessToken;
}

export { createSession, findSessions, updateSession, reIssueAccessToken };
