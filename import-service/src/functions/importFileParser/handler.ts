import 'source-map-support/register';
import type { S3Handler } from 'aws-lambda';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import ImportService from '../importService';

const importFileParser: S3Handler = async (event) => {
  for (const record of event.Records) {
    await ImportService.importFileParser(record.s3.object.key);
  };
  return formatJSONResponse(null) as any;
}

export const main = middyfy(importFileParser);
