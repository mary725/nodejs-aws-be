import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import ProductService from '../productService';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<void, void> = async () => {
  const productList = ProductService.Products;
  return formatJSONResponse(productList);
}

export const main = middyfy(getProductsList);
