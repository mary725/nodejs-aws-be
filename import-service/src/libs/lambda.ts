import middy from '@middy/core'
import middyJsonBodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors';
import httpUrlEncodePathParser from '@middy/http-urlencode-path-parser';
import inputOutputLogger from '@middy/input-output-logger';
import { httpErrorHandler } from './httpErrorHandler';

export const middyfy = (handler) => {
  return middy(handler)
    .use(httpUrlEncodePathParser())
    .use(middyJsonBodyParser())
    .use(httpErrorHandler())
    .use(cors())
    .use(inputOutputLogger());
}
