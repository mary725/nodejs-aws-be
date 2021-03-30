import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/products/{productId}',
        documentation: {
          summary: 'Get product by ID',
          description: 'Gets product data by ID',
          tags: ['products'],
          pathParams: [
            {
              name: 'productId',
              description: 'ID of the product you want to get',
              required: true
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
                "text/plain": "ProductNotFound"
              }
            }
          ]
        }
      }
    }
  ]
}
