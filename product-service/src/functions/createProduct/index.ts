import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        cors: true,
        documentation: {
          summary: 'Create product',
          description: 'Create product',
          tags: ['products'],
          requestBody: {
            description: 'A product information object'
          },
          requestModels: {
            'application/json': 'NewProduct'
          },
          methodResponses: [
            {
              statusCode: '201',
              responseModels: {
                'application/json': 'Product'
              }
            },
            {
              statusCode: '400',
              responseModels: {
                'application/json': 'ErrorResponse'
              }
            },
            {
              statusCode: '500',
              responseModels: {
                'application/json': 'ErrorResponse'
              }
            }
          ]
        }
      }
    }
  ]
}
