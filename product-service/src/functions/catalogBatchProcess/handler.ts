import 'source-map-support/register';
import type { SQSHandler } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import axios from 'axios';

import { middyfy } from '@libs/lambda';

const sns = new SNS({ region: 'us-east-1' });
const snsARN: string = process.env.SNS_ARN;

const catalogBatchProcess: SQSHandler = async (event) => {
  const products = event.Records.map(({ body }) => JSON.parse(body));

  products.forEach(async (product) => {
    try {
      await axios.post(process.env.CREATE_PRODUCT_URL, product);
      await sns.publish({
        Subject: 'You are invited processed',
        Message: `The following products is added to DB: ${product.title}`,
        TopicArn: snsARN,
        MessageAttributes: {
          count: {
            DataType: 'Number',
            StringValue: `${product.count}`,
          },
        },
      })
      .promise();
      console.log(`Product ${JSON.stringify(product)} saving is finished successfully`);
    } catch(error) {
      console.log(`Product ${JSON.stringify(product)} saving is finished with error`, error);
    }
  });
}

export const main = middyfy(catalogBatchProcess);
