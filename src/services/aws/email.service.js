
const { logger } = require('../../utils/logger');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const AWS = require('aws-sdk');//npm install aws-sdk

var myConfig = new AWS.Config();
myConfig.update({region: 'ap-southeast-1'})
const Config = {
   apiVersion: "2010-12-01",
   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
   accessSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
   region: "ap-southeast-1"
}
AWS.config.update(Config);
var ses = new AWS.SES();


exports.sendMail = async function (emailParams) {
  // const ses = new SESClient({ region: process.env.AWS_REGION });
  console.log('email param:', emailParams);
  logger.info('Email is being sent..');

  /* The following example sends a formatted email: */
  const params = {
    Destination: {
      BccAddresses: [
      ],
      CcAddresses: [
      ],
      ToAddresses: [ emailParams.email ]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: emailParams.body + '<br> This is auto generated mail'
        },
        Text: {
          Charset: 'UTF-8',
          Data: 'This is the message body in text format.'
        }
      },
      Subject: {
      Data:  emailParams.subject,
      Charset: 'UTF-8'
      }
    },
    Source: process.env.TEX_EMAIL,
    ReplyToAddresses: [
    /* more items */
    ]
  };
  console.log("email param----:   ",params);
  try {
    ses.sendEmail(params, function(err, data) {
       if (err) console.log(err, err.stack); // an error occurred
       else     console.log(data);           // successful response
     });
    // const data = await ses.send(new SendEmailCommand(params));
    // logger.info('email sent: Success', data);
    // return data; // For unit tests.
  } catch (err) {
    throw new Error(err);
  }
};
