import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { bodyValidator } from '@libs/bodyValidator';

import { NewProduct, newProductSchema } from '../typings';
import ProductService from '../productService';

const createProduct: ValidatedEventAPIGatewayProxyEvent<NewProduct, void> = async (event) => {
  const product = await ProductService.createProduct(event.body);
  return formatJSONResponse(product, 201);
}

export const main = middyfy(
  createProduct,
  (iMids, oMids) => [...iMids, bodyValidator({ schema: newProductSchema}), ...oMids]);
