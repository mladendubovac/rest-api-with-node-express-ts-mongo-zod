import { TypeOf, object, string } from 'zod';

const createSessionSchema = object({
	body: object({
		email: string({
			required_error: 'Email is required'
		}).email('Not a valid email'),
		password: string({
			required_error: 'Password is required'
		}).min(6, 'Password too short - should be 6 chars minimum')
	})
});

type CreateSessionInput = TypeOf<typeof createSessionSchema>;

export { createSessionSchema, type CreateSessionInput };
