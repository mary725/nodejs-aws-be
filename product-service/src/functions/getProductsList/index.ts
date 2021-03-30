import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        documentation: {
          summary: 'Get products',
          description: 'Gets all products',
          tags: ['products'],
          methodResponses: [
            {
              statusCode: '200',
              responseModels: {
                'application/json': 'ProductList'
              }
            }
          ]
        }
      }
    }
  ]
}
