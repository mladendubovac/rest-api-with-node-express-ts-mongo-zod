import {
	FilterQuery,
	Document,
	QueryOptions,
	UpdateQuery
} from 'mongoose';
import ProductModel, { ProductDocument } from '../models/product.model';

async function createProduct(
	input: FilterQuery<Omit<ProductDocument, 'createdAt' | 'updatedAt'>>
) {
	return ProductModel.create(input);
}

async function findProduct(
	query: FilterQuery<ProductDocument>,
	options: QueryOptions = { lean: true }
) {
	return ProductModel.findOne(query, {}, options);
}

async function findAndUpdateProduct(
	query: FilterQuery<ProductDocument>,
	update: UpdateQuery<ProductDocument>,
	options: QueryOptions
) {
	return ProductModel.findOneAndUpdate(query, update, options);
}

async function deleteProduct(query: FilterQuery<ProductDocument>) {
	return ProductModel.deleteOne(query);
}

export { createProduct, findProduct, findAndUpdateProduct, deleteProduct };
