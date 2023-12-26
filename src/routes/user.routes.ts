import express from 'express';
import validateResource from '../middlewares/validateResource';
import { createUserSchema } from '../schema/user.schema';
import { createUserHandler } from '../controllers/user.controller';

const router = express.Router();

router.post(
	'/api/users',
	validateResource(createUserSchema),
	createUserHandler
);

export default router;
