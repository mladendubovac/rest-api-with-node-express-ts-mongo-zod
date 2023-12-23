import mongoose from 'mongoose';
import { UserDocument } from './user.model';

export type SessionDocument = mongoose.Document & {
	user: UserDocument['_id'];
	valid: boolean;
	userAgent: string;
    createdAt: Date;
    updateAt: Date;
};

const sessionSchema = new mongoose.Schema<SessionDocument>(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		valid: {
			type: Boolean,
			default: true
		},
		userAgent: { type: String },
	},
	{
		timestamps: true
	}
);

const SessionModel = mongoose.model<SessionDocument>('Session', sessionSchema);

export default SessionModel;
