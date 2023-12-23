import mongoose from 'mongoose';
import { randomUUID } from 'crypto';
import { UserDocument } from './user.model';

export type ProductDocument = mongoose.Document & {
	productId: string;
	user: UserDocument['_id'];
	title: string;
	description: string;
	price: number;
	image: string;
	createdAt: Date;
	updatedAt: Date;
};

const productSchema = new mongoose.Schema<ProductDocument>(
	{
		productId: {
			type: String,
			required: true,
			unique: true,
			default: () => `product-${randomUUID()}`
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true
        },
	},
	{
		timestamps: true
	}
);

const ProductModel = mongoose.model<ProductDocument>('Product', productSchema);

export default ProductModel;
