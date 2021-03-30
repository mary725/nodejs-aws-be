export class ProductNotFound extends Error {
    public statusCode = 404;
    constructor() {
        super('Product not found');
    }
}
