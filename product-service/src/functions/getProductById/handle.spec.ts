import { main } from './handler';

jest.mock('../productList.mock.json', () => ({
    __esModule: true,
    default: [{
      title: 'Product',
      id: '1'
    }],
}));

JSON.stringify = (f) => f;

describe('getProductById lambda', () => {
  it('get product by id response', async () => {
    const resp = await main({ pathParameters: { productId: '1' } }, undefined, undefined);
    expect(resp).toStrictEqual({ body: { title: 'Product', id: '1' }, statusCode: 200 });
  });

  it('product not found response', async () => {
    const resp = await main({ pathParameters: { productId: '2' } }, undefined, undefined);
    expect(resp).toStrictEqual({ body : { message: 'Product not found' }, statusCode: 404 });
  });
});
