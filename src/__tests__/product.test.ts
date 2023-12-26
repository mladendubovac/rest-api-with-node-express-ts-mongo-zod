import supertest from 'supertest';
import mongoose from 'mongoose';
import { createServer } from '../utils/server';
import { signJwt } from '../utils/jwt.utils';
import * as productService from '../services/product.service';

const app = createServer();

const userId = new mongoose.Types.ObjectId().toString();

const mockProductPayload = {
	user: userId,
	title: 'Canon EOS 1500D DSLR Camera with 18-55mm Lens',
	description:
		'Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.',
	price: 879.99,
	image: 'https://i.imgur.com/QlRphfQ.jpg'
};

const mockProduct = {
	_id: '6589ad438fb6fb993cee7fb9',
	...mockProductPayload,
	productId: 'product-aa4d1020-2019-4bae-9d2c-53841e895899',
	createdAt: '2023-12-25T16:26:43.701Z',
	updatedAt: '2023-12-25T16:26:43.701Z',
	__v: 0
};

const userPayload = {
	_id: userId,
	email: 'jane.doe@example.com',
	name: 'Jane Doe'
};

describe('product', () => {
	const mockProductPromiseVal = new Promise<any>((resolve) =>
		resolve(mockProduct)
	);

	describe('get product route', () => {
		describe('given the product does not exist', () => {
			it('should return a 404', async () => {
				const productId = 'product-123';
				jest
					.spyOn(productService, 'findProduct')
					.mockImplementation(() => Promise.resolve(null));

				await supertest(app).get(`/api/products/${productId}`).expect(404);
			});
		});

		describe('given the product does exist', () => {
			it('should return a 200 status and the product', async () => {
				jest
					.spyOn(productService, 'findProduct')
					.mockReturnValue(mockProductPromiseVal);

				const { body, status } = await supertest(app).get(
					`/api/products/${mockProduct.productId}`
				);
				expect(status).toBe(200);
				expect(body).toEqual({
					__v: 0,
					_id: expect.any(String),
					createdAt: expect.any(String),
					description: expect.any(String),
					image: 'https://i.imgur.com/QlRphfQ.jpg',
					price: 879.99,
					productId: expect.any(String),
					title: 'Canon EOS 1500D DSLR Camera with 18-55mm Lens',
					updatedAt: expect.any(String),
					user: expect.any(String)
				});
			});
		});
	});

	describe('create product route', () => {
		describe('given the user is not logged in', () => {
			it('should return a 403', async () => {
				const { statusCode } = await supertest(app).post('/api/products');

				expect(statusCode).toBe(403);
			});
		});

		describe('given the user is logged in', () => {
			it('should return a 200 and create the product', async () => {
				const jwt = signJwt(userPayload);

				jest
					.spyOn(productService, 'createProduct')
					.mockReturnValue(mockProductPromiseVal);

				const { statusCode, body } = await supertest(app)
					.post('/api/products')
					.set('Authorization', `Bearer ${jwt}`)
					.send(mockProductPayload);

				expect(statusCode).toBe(200);

				expect(body).toEqual({
					__v: 0,
					_id: expect.any(String),
					createdAt: expect.any(String),
					description: expect.any(String),
					image: 'https://i.imgur.com/QlRphfQ.jpg',
					price: 879.99,
					productId: expect.any(String),
					title: 'Canon EOS 1500D DSLR Camera with 18-55mm Lens',
					updatedAt: expect.any(String),
					user: expect.any(String)
				});
			});
		});
	});
});
