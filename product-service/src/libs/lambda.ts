import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import cors from '@middy/http-cors';
import httpUrlEncodePathParser from '@middy/http-urlencode-path-parser';
import inputOutputLogger from '@middy/input-output-logger';
import { httpErrorHandler } from './httpErrorHandler';

const defaultInputMiddlewares = [
  httpUrlEncodePathParser(),
  middyJsonBodyParser()
];

const defaultOutputMiddlewares = [
  httpErrorHandler(),
  cors()
];

export const middyfy = (
  handler,
  middlewareBuilder = (iMids, oMids) => [...iMids, ...oMids]) => {
  return [...middlewareBuilder(defaultInputMiddlewares, defaultOutputMiddlewares), inputOutputLogger()]
    .reduce((acc, mid) => acc.use(mid), middy(handler));
}
