const AWS = require('aws-sdk');

if (process.env.NODE_ENV !== 'local') {
  AWS.config.apiVerison = 'latest';
  AWS.config.credentials = new AWS.EC2MetadataCredentials({
    httpOptions: { timeout: 5000 }
  });
} else {
  AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });
}
