import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import cors from '@middy/http-cors';
import httpUrlEncodePathParser from '@middy/http-urlencode-path-parser';

const httpErrorHandler = () => { // @middy/http-error-handler
  return ({
    onError: (handler, next) => {
      // if there are a `statusCode` and an `error` field
      // this is a valid http error object
      if (handler.error.statusCode && handler.error.message) {
        console.error(handler.error);

        handler.response = {
          statusCode: handler.error.statusCode,
          body: JSON.stringify({ message: handler.error.message })
        }

        return next();
      }

      return next(handler.error);
    }
  })
}

export const middyfy = (handler) => {
  return middy(handler)
    .use(httpUrlEncodePathParser())
    .use(middyJsonBodyParser())
    .use(httpErrorHandler())
    .use(cors());
}
