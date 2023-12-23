import fs from 'fs';

const publicKey = fs.readFileSync(__dirname + '/jwt/id_rsa_public.pem', 'utf8');
const privateKey = fs.readFileSync(
	__dirname + '/jwt/id_rsa_private.pem',
	'utf8'
);

export default {
	port: 1337,
	dbUri: '',
	saltWorkFactor: 10,
	accessTokenTtl: '15m',
	refreshTokenTtl: '1y',
	publicKey,
	privateKey
};
