import jwt from 'jsonwebtoken';
import config from 'config';
import errorHandler from './errorHandler';

const privateKey = config.get<string>('privateKey');
const publicKey = config.get<string>('publicKey');

function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
	return jwt.sign(object, privateKey, {
		...(options && options),
		algorithm: 'RS256'
	});
}

function verifyJwt(token: string) {
	try {
		const decoded = jwt.verify(token, publicKey);
		return {
			valid: true,
			expired: false,
			decoded
		};
	} catch (error) {
		const { message } = errorHandler(error);
		return {
			valid: false,
			expired: message === 'jwt expired',
			decoded: null
		};
	}
}

export { signJwt, verifyJwt };
