import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import config from 'config';

import connect from './utils/connect';
import logger from './utils/logger';

import deserializeUser from './middlewares/deserializeUser';
import router from './routes';

const port = config.get<number>('port');

const app = express();

app.use(express.json());

app.use(deserializeUser);

app.listen(port, async () => {
	logger.info(`App is running at http://localhost:${port}`);
	await connect();
	app.use(router);
});
