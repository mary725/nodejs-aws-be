import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductById from '@functions/getProductById';
import createProduct from '@functions/createProduct';
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
      PG_HOST: '${env:PGHOST, ""}',
      PG_PORT: '${env:PGHOST, ""}',
      PG_DATABASE: '${env:PGHOST, ""}',
      PG_USERNAME: '${env:PGHOST, ""}',
      PG_PASSWORD: '${env:PGHOST, ""}',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: {
    getProductsList,
    getProductById,
    createProduct
  },
};

module.exports = serverlessConfiguration;
