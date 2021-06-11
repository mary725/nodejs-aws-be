import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';

type EventParams<S, R> = { body: S, pathParameters: R };
type ValidatedAPIGatewayProxyEvent<S, R> = Omit<APIGatewayProxyEvent, 'body' | 'pathParameters'> & EventParams<S, R>;
export type ValidatedEventAPIGatewayProxyEvent<S,R> = Handler<ValidatedAPIGatewayProxyEvent<S,R>,APIGatewayProxyResult>;

export const formatJSONResponse = (response: any, statusCode: number = 200) => {
  return {
    statusCode,
    body: JSON.stringify(response)
  }
}
