import { main } from './handler';
import mock from './mock.json';

jest.mock('pg', () => ({
  __esModule: true,
  Client: class {
    public connect = async () => {};
    public end = () => {};
    public query = async ({ values: [id] }) => {
      return {
        rows: [
          [{
            count: 1,
            description: 'Description',
            id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
            price: 1,
            title: 'Product'
          }].find((product => product.id === id))
        ]
      };
    };
  }
}));

describe('getProductById lambda', () => {
  it('get product by id response', async () => {
    const resp = await main(mock, undefined, undefined);

    expect(resp.statusCode).toBe(200);
    expect(JSON.parse(resp.body)).toStrictEqual({
      count: 1,
      description: 'Description',
      id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
      price: 1,
      title: 'Product'
    });
  });

  it('product not found response', async () => {
    const resp = await main({ pathParameters: { productId: '2' } }, undefined, undefined);

    expect(resp.statusCode).toBe(404);
    expect(JSON.parse(resp.body)).toStrictEqual({ message: 'Product not found' });
  });
});
