import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        cors: true,
        //authorizer: { // ENABLE COGNITO
        //  type: 'COGNITO_USER_POOLS',
        //  authorizerId: { Ref: 'ApiGatewayAuthorizer' },
        //},
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
