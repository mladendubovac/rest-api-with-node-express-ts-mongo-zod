import type { Express, Request, Response } from 'express';
import validateResource from './middlewares/validateResource';

import requireUser from './middlewares/requireUser';

import { createUserSchema } from './schema/user.schema';
import { createUserHandler } from './controllers/user.controller';

import { createSessionSchema } from './schema/session.schema';
import {
	createUserSessionHandler,
	deleteSessionHandler,
	getUserSessionsHandler
} from './controllers/session.controller';
import {
	createProductSchema,
	deleteProductSchema,
	getProductSchema,
	updateProductSchema
} from './schema/product.schema';
import {
	createProductHandler,
	deleteProductHandler,
	getProductHandler,
	updateProductHandler
} from './controllers/product.controller';

function routes(app: Express) {
	// HEALTHCHECK
	app.get('/healthcheck', (_req: Request, res: Response) =>
		res.sendStatus(200)
	);

	// USERS
	app.post('/api/users', validateResource(createUserSchema), createUserHandler);

	// SESSIONS
	app.post(
		'/api/sessions',
		validateResource(createSessionSchema),
		createUserSessionHandler
	);
	app.get('/api/sessions', requireUser, getUserSessionsHandler);
	app.delete('/api/sessions', requireUser, deleteSessionHandler);

	// PRODUCTS
	app.post(
		'/api/products',
		[requireUser, validateResource(createProductSchema)],
		createProductHandler
	);
	app.put(
		'/api/products',
		[requireUser, validateResource(updateProductSchema)],
		updateProductHandler
	);
	app.get(
		'/api/products',
		validateResource(getProductSchema),
		getProductHandler
	);
	app.delete(
		'/api/products',
		[requireUser, validateResource(deleteProductSchema)],
		deleteProductHandler
	);
}

export default routes;
