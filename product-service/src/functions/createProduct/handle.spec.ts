import { main } from './handler';
import mock from './mock.json';

jest.mock('pg', () => ({
  __esModule: true,
  Client: function Client() {
    if (!(Client as any)._instance) {
      (Client as any)._instance = {
        connect: jest.fn(),
        end: jest.fn(),
        query: jest.fn()
      };
    }
    return (Client as any)._instance;
  }
}));

describe('createProduct lambda', () => {
  it('create product response', async () => {
    const { Client } = require('pg');
    (new Client()).query.mockImplementation(() => ({ rows: [
      { id: '7567ec4b-b10c-48c5-9345-fc73c48a80a0' }
    ]}));

    const resp = await main(mock, undefined, undefined);

    expect(resp.statusCode).toBe(201);
    expect(JSON.parse(resp.body)).toStrictEqual({
      title: 'title mock',
      description: 'description mock',
      price: 1,
      count: 1,
      id: '7567ec4b-b10c-48c5-9345-fc73c48a80a0'
    });
  });

  it('invalid body. price - string', async () => {
    const resp = await main(
      {
        "headers": {
            "Content-Type": "application/json"
        },
        "body": "{\"title\":\"title mock\",\"description\":\"description mock\",\"price\":\"1\",\"count\":1}"
      }, undefined, undefined);

    expect(resp.statusCode).toBe(400);
    expect(JSON.parse(resp.body)).toStrictEqual({ message: 'price must be number' });
  });

  it('invalid body. title - minLength', async () => {
    const resp = await main(
      {
        "headers": {
            "Content-Type": "application/json"
        },
        "body": "{\"title\":\"mock\",\"description\":\"description mock\",\"price\":1,\"count\":1}"
      }, undefined, undefined);

    expect(resp.statusCode).toBe(400);
    expect(JSON.parse(resp.body)).toStrictEqual({ message: 'title must NOT have fewer than 10 characters' });
  });
});
