import * as dynamoose from 'dynamoose';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
const region = process.env.AWS_REGION || '';
console.log(accessKeyId);
console.log(secretAccessKey);
console.log(region);

const ddb = new dynamoose.aws.ddb.DynamoDB({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region,
});

dynamoose.aws.ddb.set(ddb);

export default dynamoose;
