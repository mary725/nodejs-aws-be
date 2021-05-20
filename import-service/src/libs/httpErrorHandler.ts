export const httpErrorHandler = () => { // @middy/http-error-handler
    return ({
      onError: (handler, next) => {
        // if there are a `statusCode` and an `error` field
        // this is a valid http error object
        if (handler.error.message) {
          console.error(handler.error);
  
          handler.response = {
            statusCode: handler.error.statusCode || 500,
            body: JSON.stringify({ message: handler.error.message })
          }
  
          return next();
        }
  
        return next(handler.error);
      }
    })
};
