import express from 'express';
import router from '../routes';
import deserializeUser from '../middlewares/deserializeUser';

function createServer() {
	const app = express();

	app.use(express.json());

	app.use(deserializeUser);

	app.use(router);

	return app;
}

export { createServer };
