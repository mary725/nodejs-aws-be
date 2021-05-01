import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

type EventParams<S, R> = { body: FromSchema<S>, pathParameters: FromSchema<R> };
type ValidatedAPIGatewayProxyEvent<S, R> = Omit<APIGatewayProxyEvent, 'body' | 'pathParameters'> & EventParams<S, R>;
export type ValidatedEventAPIGatewayProxyEvent<S,R> = Handler<ValidatedAPIGatewayProxyEvent<S,R>,APIGatewayProxyResult>;

export const formatJSONResponse = (response: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}
