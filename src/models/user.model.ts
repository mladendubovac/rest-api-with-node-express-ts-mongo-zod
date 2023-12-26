import mongoose, { type HydratedDocument } from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';

export type UserInput = {
	email: string;
	name: string;
	password: string;
};

export type UserDocument = HydratedDocument<
	UserInput & {
		createdAt: Date;
		updatedAt: Date;
		comparePassword: (candidatePassword: string) => Promise<boolean>;
	}
>;

const userSchema = new mongoose.Schema<UserDocument>(
	{
		email: {
			type: String,
			required: true,
			unique: true
		},
		name: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	}
);

userSchema.pre(
	'save',
	async function (next: mongoose.CallbackWithoutResultAndOptionalError) {
		const user = this as UserDocument;
		if (!user.isModified) {
			return next();
		}
		const salt = await bcrypt.genSalt(config.get('saltWorkFactor'));
		const hash = await bcrypt.hash(user.password, salt);

		user.password = hash;
		return next();
	}
);

userSchema.methods.comparePassword = async function (
	candidatePassword: string
): Promise<boolean> {
	const user = this as UserDocument;

	try {
		return await bcrypt.compare(candidatePassword, user.password);
	} catch {
		return false;
	}
};

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;
