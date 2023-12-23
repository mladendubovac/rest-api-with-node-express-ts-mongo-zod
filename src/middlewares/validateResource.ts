import type { Request, Response, NextFunction } from 'express';
import { type AnyZodObject } from 'zod';
import errorHandler from '../utils/errorHandler';

const validateResource =
	(schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse({
				body: req.body,
				query: req.query,
				params: req.params
			});
            next();
		} catch (error) {
			const { message } = errorHandler(error);
			return res.status(400).send(message);
		}
	};

export default validateResource;
