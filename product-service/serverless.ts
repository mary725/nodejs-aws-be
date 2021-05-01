import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductById from '@functions/getProductById';
import { productSchema } from '@functions/typings';

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
          url: 'https://bmyfe1s3e1.execute-api.us-east-1.amazonaws.com/dev'
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
          description: 'This is an product',
          contentType: 'application/json',
          schema: productSchema
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
  plugins: ['serverless-webpack', '@conqa/serverless-openapi-documentation'],
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
  functions: { getProductsList, getProductById },
};

module.exports = serverlessConfiguration;
