import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductById from '@functions/getProductById';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';
import { productSchema, newProductSchema } from '@functions/typings';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    documentation: {
      version: '1',
      title: 'product-service API',
      description: 'This is the best API ever',
      servers: [
        {
          url: 'https://wbnvs1sebc.execute-api.us-east-1.amazonaws.com/dev'
        }
      ],
      tags: [
        {
          name: 'products'
        }
      ],
      models: [
        {
          name: 'Product',
          description: 'This is a product',
          contentType: 'application/json',
          schema: productSchema
        },
        {
          name: 'NewProduct',
          description: 'This is a new product',
          contentType: 'application/json',
          schema: newProductSchema
        },
        {
          name: 'ProductList',
          contentType: 'application/json',
          schema: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Product'
            }
          }
        },
        {
          name: 'ErrorResponse',
          contentType: 'application/json',
          schema: {
            type: 'object',
            properties: {
                message: { type: 'string' }
            },
            required: ['message']
          }
        }
      ]
    }
  },
  plugins: [
    'serverless-webpack',
    'serverless-offline',
    '@conqa/serverless-openapi-documentation',
    'serverless-dotenv-plugin'
  ],
  // useDotenv: true, // instead of serverless-dotenv-plugin
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      // PG_HOST: '${env:PGHOST, ""}', // TODO: this feature in serverless-dotenv-plugin doesn't work ? https://github.com/neverendingqs/serverless-dotenv-plugin/issues/10
      // PG_PORT: '${env:PG_PORT, ""}',
      // PG_DATABASE: '${env:PG_DATABASE, ""}',
      // PG_USERNAME: '${env:PG_USERNAME, ""}',
      // PG_PASSWORD: '${env:PG_PASSWORD, ""}',
      SNS_ARN: {
        Ref: 'SNSTopic',
      },
      CREATE_PRODUCT_URL: {
        'Fn::Join' : ['', ['https://', { 'Ref' : 'ApiGatewayRestApi' }, '.execute-api.us-east-1.amazonaws.com/dev/products'] ] },
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: {
          Ref: 'SNSTopic'
        }
      }
    ],
  },
  resources: {
    Resources: {
      ApiGatewayAuthorizer: {
        DependsOn: ['ApiGatewayRestApi'],
        Type: 'AWS::ApiGateway::Authorizer',
        Properties: {
          Name: 'cognito-authorizer',
          IdentitySource: 'method.request.header.Authorization',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
          Type: 'COGNITO_USER_POOLS',
          ProviderARNs: ['${cf:authorization-service-dev.CognitoUserPoolArn}'],
        },
      },
      GatewayResponseDefault4XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Methods': "'GET,OPTIONS'"
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi'
          }
        }
      },
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'rs-react-products-queue',
        }
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'rs-react-products-topic',
        }
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'test.subscription.1+not_enough@outlook.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic'
          },
          FilterPolicy: {
            count: [{'numeric': ['<=', 0]}]
          }
        }
      },
      SNSSubscription2: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'test.subscription.1+exist@outlook.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic'
          },
          FilterPolicy: {
            count: [{'numeric': ['>', 0]}]
          }
        }
      }
    },
    Outputs: {
      SqsUrl: {
        Value: {
          Ref: 'SQSQueue'
        }
      },
      SqsArn: {
        Value: {
          'Fn::GetAtt': ['SQSQueue', 'Arn']
        },
        Export: {
          Name: 'SqsArn-dev' // custom name
        }
      }
    }
  },
  // import the function via paths
  functions: {
    getProductsList,
    getProductById,
    createProduct,
    catalogBatchProcess
  },
};

module.exports = serverlessConfiguration;
