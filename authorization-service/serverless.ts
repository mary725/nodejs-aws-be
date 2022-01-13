import type { AWS } from '@serverless/typescript';

import basicAuthorizer from '@functions/basicAuthorizer';

const serverlessConfiguration: AWS = {
  service: 'authorization-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: [
    'serverless-webpack',
    'serverless-dotenv-plugin'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: {
    basicAuthorizer
  },
  resources: {
    Outputs: {
      BasicAuthorizerQualifiedArn: {
        Export: {
          Name: 'basicAuthorizerArn'
        },
        Value: {
          'Fn::GetAtt': ['BasicAuthorizerLambdaFunction', 'Arn'] // function name: https://github.com/sid88in/serverless-appsync-plugin/issues/136#issuecomment-411910035
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
