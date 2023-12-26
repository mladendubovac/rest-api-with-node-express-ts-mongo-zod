import express from 'express';
import validateResource from '../middlewares/validateResource';
import requireUser from '../middlewares/requireUser';
import { createSessionSchema } from '../schema/session.schema';
import {
	createUserSessionHandler,
	deleteSessionHandler,
	getUserSessionsHandler
} from '../controllers/session.controller';

const router = express.Router();

router.post(
	'/api/sessions',
	validateResource(createSessionSchema),
	createUserSessionHandler
);
router.get('/api/sessions', requireUser, getUserSessionsHandler);
router.delete('/api/sessions', requireUser, deleteSessionHandler);

export default router;
