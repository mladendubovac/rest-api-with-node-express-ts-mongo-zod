import supertest from 'supertest';
import mongoose from 'mongoose';
import { createServer } from '../utils/server';
import * as userService from '../services/user.service';
import * as sessionService from '../services/session.service';
import { createUserSessionHandler } from '../controllers/session.controller';

const app = createServer();

const userId = new mongoose.Types.ObjectId().toString();

const userInput = {
	email: 'test@example.com',
	name: 'Jane Doe',
	password: 'Password123',
	passwordConfirmation: 'Password123'
};

const userPayload = {
	_id: userId,
	email: 'jane.doe@example.com',
	name: 'Jane Doe'
};

const sessionPayload = {
	_id: new mongoose.Types.ObjectId().toString(),
	user: userId,
	valid: true,
	userAgent: 'PostmanRuntime/7.29.4',
	createdAt: '2023-12-26T00:59:37.401Z',
	updatedAt: '2023-12-26T00:59:37.401Z',
	__v: 0
};

describe('user', () => {
	const mockUserPayloadPromiseVal = new Promise<any>((resolve) =>
		resolve(userPayload)
	);
	const mockSessionPayloadPromiseVal = new Promise<any>((resolve) =>
		resolve(userPayload)
	);
	describe('user registration', () => {
		describe('given the email already exists', () => {
			it('should return a 409 error', async () => {
				const findUserServiceMock = jest
					.spyOn(userService, 'findUser')
					.mockReturnValueOnce(mockUserPayloadPromiseVal);

				const { statusCode } = await supertest(app)
					.post('/api/users')
					.send(userInput);

				expect(statusCode).toBe(409);
				expect(findUserServiceMock).toHaveBeenCalledWith({
					email: userInput.email
				});
			});
		});

		describe('given the email and password are valid', () => {
			it('should return the user payload', async () => {
				jest
					.spyOn(userService, 'findUser')
					.mockReturnValueOnce(Promise.resolve(null));

				const createUserServiceMock = jest
					.spyOn(userService, 'createUser')
					.mockReturnValueOnce(mockUserPayloadPromiseVal);

				const { body, statusCode } = await supertest(app)
					.post('/api/users')
					.send(userInput);

				expect(statusCode).toBe(200);
				expect(body).toEqual(userPayload);
				expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
			});
		});

		describe('given the passwords do not match', () => {
			it('should return a 400 error', async () => {
				jest
					.spyOn(userService, 'findUser')
					.mockReturnValueOnce(Promise.resolve(null));

				const createUserServiceMock = jest
					.spyOn(userService, 'createUser')
					.mockReturnValueOnce(mockUserPayloadPromiseVal);

				const { statusCode } = await supertest(app)
					.post('/api/users')
					.send({ ...userInput, passwordConfirmation: 'does-not-match' });

				expect(statusCode).toBe(400);
				expect(createUserServiceMock).not.toHaveBeenCalled();
			});
		});

		describe('given the user service throws', () => {
			it('should return a 409 error', async () => {
				jest
					.spyOn(userService, 'findUser')
					.mockReturnValueOnce(Promise.resolve(null));

				const createUserServiceMock = jest
					.spyOn(userService, 'createUser')
					.mockRejectedValueOnce('ERROR');

				const { statusCode } = await supertest(app)
					.post('/api/users')
					.send(userInput);

				expect(statusCode).toBe(409);
				expect(createUserServiceMock).toHaveBeenCalled();
			});
		});
	});

	describe('create user session', () => {
		describe('given the username and password are valid', () => {
			it('should return a signed access and refresh tokens', async () => {
				jest
					.spyOn(userService, 'validatePassword')
					.mockReturnValueOnce(mockUserPayloadPromiseVal);

				jest
					.spyOn(sessionService, 'createSession')
					.mockReturnValue(mockSessionPayloadPromiseVal);

				const req = {
					get: () => 'a user agent',
					body: {
						email: 'test@test.com',
						password: 'Password123'
					}
				};
				const send = jest.fn();
				const res = {
					send
				};

				// @ts-ignore
				await createUserSessionHandler(req, res);
				expect(send).toHaveBeenCalledWith({
					accessToken: expect.any(String),
					refreshToken: expect.any(String)
				});
			});
		});
	});
});
