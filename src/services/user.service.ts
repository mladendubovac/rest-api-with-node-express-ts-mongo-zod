import { type FilterQuery } from 'mongoose';
import UserModel, { UserDocument } from '../models/user.model';
import errorHandler from '../utils/errorHandler';
import omit from 'lodash/omit';

async function createUser(
	input: FilterQuery<
		Omit<UserDocument, 'createdAt' | 'updatedAt' | 'comparePassword'>
	>
) {
	try {
		const user = await UserModel.create(input);
		return omit(user.toJSON(), 'password');
	} catch (error) {
		const { message } = errorHandler(error);
		throw new Error(message);
	}
}

async function validatePassword({
	email,
	password
}: {
	email: string;
	password: string;
}) {
	const user = await UserModel.findOne({
		email
	});

	if (!user) {
		return false;
	}

	const isValid = await user.comparePassword(password);

	if (!isValid) {
		return false;
	}

	return omit(user.toJSON(), 'password');
}

async function findUser(query: FilterQuery<UserDocument>) {
	return UserModel.findOne(query).lean();
}

export { createUser, validatePassword, findUser };
