import crypto from 'crypto';
import fs from 'fs';
import logger from './src/utils/logger';

function generateKeyPair() {
	try {
		const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
			modulusLength: 2048,
			publicKeyEncoding: {
				type: 'pkcs1',
				format: 'pem'
			},
			privateKeyEncoding: {
				type: 'pkcs1',
				format: 'pem'
			}
		});
		fs.writeFileSync(__dirname + '/config/jwt/id_rsa_public.pem', publicKey);
		fs.writeFileSync(__dirname + '/config/jwt/id_rsa_private.pem', privateKey);
		logger.info('Successfully generated key pair!');
	} catch (error) {
		logger.error(error);
		process.exit(1);
	}
}

generateKeyPair();
