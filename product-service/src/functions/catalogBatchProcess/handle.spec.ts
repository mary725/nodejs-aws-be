import { SNS } from 'aws-sdk';
import axios from 'axios';

import { main } from './handler';

jest.mock('axios');
jest.mock('aws-sdk', () => {
  return {
    SNS: jest.fn().mockImplementation(function () {
      this.publish = jest.fn();
    })
  };
});

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedSNS = SNS as jest.MockedClass<typeof SNS>;

describe('catalogBatchProcess lambda', () => {
  const event = {
    Records: [{
      body: '{\"title\":\"title mock\",\"description\":\"description mock\",\"price\":1,\"count\":1}'
    }]
  };

  it('product should be sent', async () => {
    await main(event, undefined, undefined);

    expect(mockedAxios.post).toBeCalledTimes(1);
  });

  it('notification should be sent', async () => {
    mockedAxios.post.mockResolvedValue(null);

    await main(event, undefined, undefined);

    const snsInstance = mockedSNS.mock.instances[0];
    expect(snsInstance.publish).toBeCalledTimes(1);
  });
});
