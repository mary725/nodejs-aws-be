import { S3, SQS } from 'aws-sdk';
import * as csvParser from 'csv-parser';

class ImportService {
    private bucketName = 'rs-react-app1-import';
    private sourcePath = 'uploaded';
    private destinationPath = 'parsed';
    private queueURL = process.env.SQS_URL;
    private s3 = new S3({ region: 'us-east-1', signatureVersion: 'v4' });
    private sqs = new SQS({ region: 'us-east-1' });

    public getSignedUrl = (name: string): Promise<string> => {
      const params = {
        Bucket: this.bucketName,
        Key: `${this.sourcePath}/${name}`,
        Expires: 60,
        ContentType: 'text/csv',
      };
      // cors settings are added to s3
      return this.s3.getSignedUrlPromise('putObject', params);
    }

    public importFileParser = async (key: string): Promise<void> => {
      await this.parseFile(key);
      await this.moveObject(key);
    }

    private parseFile = async (key: string) => {
      const params = {
        Bucket: this.bucketName,
        Key: key
      };

      return new Promise((resolve, reject) => {
        const s3Stream = this.s3.getObject(params).createReadStream();

        console.log('File parsing started');

        s3Stream
          .pipe(csvParser({
            mapValues: ({ header, value }) => header === 'price' ||	header === 'count' ? +value : value
          }))
          .on('data', this.pushProductToQueue)
          .on('end', () => {
            console.log('File parsing completed successfully');
            resolve(null);
          })
          .on('error', (error) => {
            console.log('File parsing completed with error');
            reject(error);
          });
      });
    }

    private pushProductToQueue = async (product: string) => {
      console.log(product);
      await this.sqs.sendMessage({
          QueueUrl: this.queueURL,
          MessageBody: JSON.stringify(product),
        })
        .promise();
    }

    private moveObject = async (key: string) => {
      console.log(`Copying of ${key} started ...`);

      await this.s3.copyObject({
        Bucket: this.bucketName,
        CopySource: `${this.bucketName}/${key}`,
        Key: key.replace(this.sourcePath, this.destinationPath)
      }).promise();

      console.log(`${key} is copied to ${this.destinationPath} folder`);

      await this.s3.deleteObject({
        Bucket: this.bucketName,
        Key: key
      }).promise();

      console.log(`${key} is deleted`);
    }
}

const importService = new ImportService();

export default importService;
