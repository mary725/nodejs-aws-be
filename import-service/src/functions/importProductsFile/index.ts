import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: true
            }
          }
        },
        authorizer: {
          name: 'tokenAuthorizer',
          arn: {
            'Fn::ImportValue': 'basicAuthorizerArn'
          },
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization',
          type: 'token'
        }
      }
    }
  ]
}
