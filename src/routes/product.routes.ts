import express from 'express';
import validateResource from '../middlewares/validateResource';
import requireUser from '../middlewares/requireUser';
import {
	createProductSchema,
	deleteProductSchema,
	getProductSchema,
	updateProductSchema
} from '../schema/product.schema';
import {
	createProductHandler,
	deleteProductHandler,
	getProductHandler,
	updateProductHandler
} from '../controllers/product.controller';

const router = express.Router();

router.post(
	'/api/products',
	[requireUser, validateResource(createProductSchema)],
	createProductHandler
);
router.put(
	'/api/products/:productId',
	[requireUser, validateResource(updateProductSchema)],
	updateProductHandler
);
router.get(
	'/api/products/:productId',
	validateResource(getProductSchema),
	getProductHandler
);
router.delete(
	'/api/products/:productId',
	[requireUser, validateResource(deleteProductSchema)],
	deleteProductHandler
);

export default router;
