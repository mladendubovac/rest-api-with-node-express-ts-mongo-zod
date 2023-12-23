import type { Request, Response } from 'express';
import {
	CreateProductInput,
	DeleteProductInput,
	GetProductInput,
	UpdateProductInput
} from '../schema/product.schema';
import {
	createProduct,
	deleteProduct,
	findAndUpdateProduct,
	findProduct
} from '../services/product.service';
import errorHandler from '../utils/errorHandler';
import logger from '../utils/logger';

async function createProductHandler(
	req: Request<{}, {}, CreateProductInput['body']>,
	res: Response
) {
	try {
		const userId = res.locals.user._id;

		const body = req.body;
		const product = await createProduct({ ...body, user: userId });

		res.send(product);
	} catch (error) {
		const { message } = errorHandler(error);
		logger.error(message);
		res.sendStatus(400);
	}
}

async function updateProductHandler(
	req: Request<UpdateProductInput['params'], {}, UpdateProductInput['body']>,
	res: Response
) {
	try {
		const userId = res.locals.user._id;

		const productId = req.params.productId;

		const update = req.body;

		const product = await findProduct({
			productId
		});

		if (!product) {
			return res.sendStatus(404);
		}

		if (String(product.user) !== userId) {
			return res.sendStatus(403);
		}

		const updatedProduct = await findAndUpdateProduct(
			{
				productId
			},
			update,
			{ new: true }
		);

		return res.send(updatedProduct);
	} catch (error) {
		const { message } = errorHandler(error);
		logger.error(message);
		res.sendStatus(400);
	}
}

async function getProductHandler(
	req: Request<GetProductInput['params']>,
	res: Response
) {
	try {
		const productId = req.params.productId;

		const product = await findProduct({
			productId
		});

		if (!product) {
			return res.sendStatus(404);
		}

		return res.send(product);
	} catch (error) {
		const { message } = errorHandler(error);
		logger.error(message);
		res.sendStatus(400);
	}
}

async function deleteProductHandler(
	req: Request<DeleteProductInput['params']>,
	res: Response
) {
	try {
		const userId = res.locals.user._id;
		const productId = req.params.productId;

		const product = await findProduct({
			productId
		});

		if (!product) {
			return res.sendStatus(404);
		}

		if (String(product.user) !== userId) {
			return res.sendStatus(403);
		}

		await deleteProduct({
			productId
		});

		return res.sendStatus(200);
	} catch (error) {
		const { message } = errorHandler(error);
		logger.error(message);
		res.sendStatus(400);
	}
}

export {
	createProductHandler,
	updateProductHandler,
	getProductHandler,
	deleteProductHandler
};
