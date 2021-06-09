import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: [
          'arn:aws:s3:::rs-react-app1-import'
        ]
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: [
          'arn:aws:s3:::rs-react-app1-import/*'
        ]
      },
      {
        Effect: 'Allow',
        Action: 'sqs:SendMessage',
        Resource: [
          {
            'Fn::ImportValue': 'SqsArn-dev'
          }
        ]
      }
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SQS_URL: '${cf:product-service-dev.SqsUrl}'
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: {
    importProductsFile,
    importFileParser
  },
  resources: {
    Resources: {
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
      }
    }
  }
};

module.exports = serverlessConfiguration;
