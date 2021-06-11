import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        cors: true,
        documentation: {
          summary: 'Get product by ID',
          description: 'Gets product data by ID',
          tags: ['products'],
          pathParams: [
            {
              name: 'productId',
              description: 'ID of the product you want to get',
              schema: {
                type: 'string'
              }
            }
          ],
          methodResponses: [
            {
              statusCode: '200',
              responseModels: {
                'application/json': 'Product'
              }
            },
            {
              statusCode: '404',
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
