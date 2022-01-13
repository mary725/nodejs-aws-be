import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import ImportService from '../importService';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<void> = async (event) => {
  const url = await ImportService.getSignedUrl(
    event.queryStringParameters.name
  );
  return formatJSONResponse({ url });
}

export const main = middyfy(importProductsFile);
