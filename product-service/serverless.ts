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
      api: {
        info: {
          version: '2',
          title: 'product-service API',
          description: 'This is the best API ever'
        }
      },
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
              $ref: '{{model: Product}}'
            }
          }
        },
        {
          name: 'ProductNotFound',
          contentType: 'text/plain',
          schema: {
            type: 'string'
          }
        }
      ]
    }
  },
  plugins: ['serverless-webpack', 'serverless-aws-documentation'],
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
