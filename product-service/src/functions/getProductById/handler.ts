import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import schema from './pathParamsSchema';

import ProductService from '../productService';
import { CommonError } from '@functions/errors';

const getProductById: ValidatedEventAPIGatewayProxyEvent<void, typeof schema> = async (event) => {
  console.log(`getProductById. event: ${JSON.stringify(event.pathParameters)}`);
  const product = await ProductService.getProductById(event.pathParameters.productId);
  if (!product) {
    throw new CommonError('Product not found', 404);
  }
  console.log(`getProductById. product: ${JSON.stringify(product)}`);
  return formatJSONResponse(product);
}

export const main = middyfy(getProductById);
