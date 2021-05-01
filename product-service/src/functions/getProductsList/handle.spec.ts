import { main } from './handler';
import productsMock from '../productList.mock.json';

JSON.stringify = (f) => f;

describe('getProductsList lambda', () => {
  it('get product list response', async () => {
    const resp = await main({}, undefined, undefined);
    expect(resp).toStrictEqual({ body: productsMock, statusCode: 200});
  });
});
