import express, { type Request, type Response } from 'express';

import userRoutes from './user.routes';
import sessionRoutes from './session.routes';
import productRoutes from './product.routes';

const router = express.Router();

router.get('/healthcheck', (_req: Request, res: Response) => res.send(200));
router.use([userRoutes, sessionRoutes, productRoutes]);

export default router;
