type ErrorHandlerResponse = {
	name?: string;
	message: string;
};

function errorHandler(error: unknown): ErrorHandlerResponse {
	let name = '';
	let message = String(error);
	if (error instanceof Error) {
		name = error.name;
		message = error.message;
	}
	return {
		...(name && {
			name
		}),
		message
	};
}

export default errorHandler;
