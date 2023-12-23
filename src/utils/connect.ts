import mongoose from 'mongoose';
import config from 'config';
import logger from './logger';

async function connect() {
	const dbUri = config.get<string>('dbUri');
	try {
		logger.info('Connecting to DB...');
		await mongoose.connect(dbUri);
		logger.info('Connected to DB...');
	} catch (error) {
		logger.error('Could not connect to DB!');
		process.exit(1);
	}
}

export default connect;
