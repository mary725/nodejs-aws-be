import 'source-map-support/register';
import type { FromSchema } from 'json-schema-to-ts';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { CommonError } from '@libs/errors';

import schema from './pathParamsSchema';
import ProductService from '../productService';

const getProductById: ValidatedEventAPIGatewayProxyEvent<void, FromSchema<typeof schema>> = async (event) => {
  const product = await ProductService.getProductById(event.pathParameters.productId);
  if (!product) {
    throw new CommonError('Product not found', 404);
  }
  return formatJSONResponse(product);
}

export const main = middyfy(getProductById);
