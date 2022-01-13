import { main } from './handler';

jest.mock('pg', () => ({
  __esModule: true,
  Client: class {
    public connect = async () => {};
    public end = () => {};
    public query = async () => {
      return {
        rows: [
          {
            count: 1,
            description: 'Description',
            id: '7567ec4b-b10c-48c5-9345-fc73c48a80a0',
            price: 1,
            title: 'Product'
          }
        ]
      };
    };
  }
}));

describe('getProductsList lambda', () => {
  it('get product list response', async () => {
    const resp = await main({}, undefined, undefined);

    expect(resp.statusCode).toBe(200);
    expect(JSON.parse(resp.body)).toStrictEqual([{
      count: 1,
      description: 'Description',
      id: '7567ec4b-b10c-48c5-9345-fc73c48a80a0',
      price: 1,
      title: 'Product'
    }]);
  });
});
