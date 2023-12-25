import {
	FilterQuery,
	QueryOptions,
	UpdateQuery
} from 'mongoose';
import ProductModel, { type ProductDocument, ProductInput } from '../models/product.model';

async function createProduct(
	input: ProductInput
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
