const AWS = require('aws-sdk');
const { logger } = require('../../utils/logger');
exports.uploadFileTos3 = async (params, region) => {
  logger.info('params', params);
  logger.info('region', region);
  AWS.config.update({ region: region });
  const s3Client = new AWS.S3({ apiVersion: '2006-03-01' });
  return new Promise((resolve, reject) => {
    s3Client.upload(params, (err, data) => {
      if (err) {
        logger.error('err while uploading file to s3', err);
        reject(err);
      };
      resolve(data);
    });
  });
};

exports.getFileFromS3 = async (params, region) => {
  logger.info('params', params);
  logger.info('region', region);
  AWS.config.update({ region: region });
  const s3Client = new AWS.S3({ apiVersion: '2006-03-01' });
  return new Promise((resolve, reject) => {
    s3Client.getObject(params, (err, data) => {
      if (err) {
        logger.error('err while downloading file to s3', err);
        reject(err);
      };
      logger.info('File from s3', data);
      resolve(data);
    });
  });
};

exports.getSignedUrlFromS3 = async (params, region) => {
  logger.info('Inside getSignedUrlFromS3');
  logger.info('params', params);
  logger.info('region', region);
  AWS.config.update({ region: region });
  const s3Client = new AWS.S3({ apiVersion: '2006-03-01' });
  return new Promise((resolve, reject) => {
    s3Client.getSignedUrl('getObject', params, (err, url) => {
      logger.info(`Signed Url : ${url}`);
      if (err) {
        logger.error('err while downloading file to s3', err);
        reject(err);
      };
      logger.info('Signed Url  from s3', url);
      resolve(url);
    });
  });
};

exports.getFileFromS3New = async (params, region) => {
  logger.info('params', params);
  logger.info('region', region);
  AWS.config.update({ region: region });
  const s3Client = new AWS.S3({ apiVersion: '2006-03-01' });
  return new Promise((resolve, reject) => {
    resolve(s3Client.getObject(params).createReadStream);
    // s3Client.getObject(params, (err, data) => {
    //   if (err) {
    //     logger.error('err while downloading file to s3', err);
    //     reject(err);
    //   };
    //   logger.info('File from s3', data);
    //   resolve(data);
    // });
  });
};

const startMultiPartUpload = (s3Client, params) => {
  return new Promise((resolve, reject) => {
    s3Client.createMultipartUpload(params, (err, data) => {
      if (err) {
        logger.error('err while startMultiPartUpload to s3', err);
        reject(err);
      } else {
        logger.info('startMultiPartUpload  from s3', data);
        resolve(data);
      }
    });
  });
};

const uploadPart = (s3Client, credentials, buffer, uploadId, partNumber) => {
  const params = {
    Key: credentials.Key,
    Bucket: credentials.Bucket,
    Body: buffer,
    PartNumber: partNumber, // Any number from one to 10.000
    UploadId: uploadId // UploadId returned from the first method
  };
  return new Promise((resolve, reject) => {
    s3Client.uploadPart(params, (err, data) => {
      if (err) {
        reject(JSON.stringify({ PartNumber: partNumber, error: err }));
        // reject(err);
      } else {
        resolve({ PartNumber: partNumber, ETag: data.ETag });
      };
    });
  });
};

const abortUpload = async (s3Client, credentials, uploadId) => {
  const params = {
    Key: credentials.Key,
    Bucket: credentials.Bucket,
    UploadId: uploadId
  };
  return new Promise((resolve, reject) => {
    s3Client.abortMultipartUpload(params, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
};

const completeUpload = async (s3Client, credentials, uploadId, parts) => {
  const params = {
    Key: credentials.Key,
    Bucket: credentials.Bucket,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts
    }
  };
  return new Promise((resolve, reject) => {
    s3Client.completeMultipartUpload(params, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
};

const multiPartUploadToS3 = async (params, region, fileInfo, fileData) => {
  AWS.config.update({ region: region });
  const s3Client = new AWS.S3({ apiVersion: '2006-03-01' });
  const file = fileData; // read the file from the path specified
  logger.info('fileData', file);
  // return new Promise(async (resolve, reject) => {
  const chunkSize = Math.pow(1024, 2) * 3; // chunk size is set to 3MB
  const fileSize = fileInfo.size;
  const iterations = Math.ceil(fileSize / chunkSize); // number of chunks to be broken
  const arr = Array.from(Array(iterations).keys()); // dummy array to loop through
  let uploadId = ''; // we will use this later
  try {
    const uploadIdObj = await startMultiPartUpload(s3Client, params);
    logger.info('uploadIdObj', uploadIdObj);
    uploadId = uploadIdObj.UploadId; // this will start the connection and return UploadId
    const parts = await Promise.allSettled(
      arr.map(item => {
        return uploadPart(
          s3Client,
          params,
          file.slice((item - 1) * chunkSize, item * chunkSize),
          uploadId,
          item
        );
      })
    );
    // ;console.log(parts);
    /*
    The response looks like this ->
    [
      { status: "rejected", reason: { PartNumber: "1234", error: {...} } }
      { status: "fulfilled", reason: { PartNumber: "1234", ETag: '"d8c2eafd90c266e19ab9dcacc479f8af"' } }
    ]
    Now we can retry uploading the rejected Parts!
    */
    const failedParts = parts
      .filter((part) => part.status === 'rejected')
      .map((part) => part.reason);
    const succeededParts = parts
      .filter((part) => part.status === 'fulfilled')
      .map((part) => part.value);
    let retriedParts = [];
    if (!failedParts.length) { // if some parts got failed then retry
      retriedParts = await Promise.all(
        failedParts.map((failedPart) => {
          const { PartNumber } = JSON.parse(failedPart);
          return uploadPart(
            s3Client,
            params,
            data.slice((PartNumber - 1) * chunkSize, PartNumber * chunkSize),
            uploadId,
            PartNumber
          );
        })
      );
    }
    succeededParts.push(...retriedParts); // when the failed parts succeed after retry
    const data = await completeUpload(
      s3Client,
      params,
      uploadId,
      succeededParts.sort((a, b) => a.PartNumber - b.PartNumber) // needs sorted array
    );
    logger.info('data in s3 from multipart Upload', data); // the URL to access the object in S3
    // resolve(data);
    sendEmail(`File upload is successful. ${params.Key.split('/').pop()}\nKindly check after few minutes..... `);
    return data;
  } catch (err) {
    const done = await abortUpload(s3Client, params, uploadId); // in case of failure even after retry, abort the process
    logger.info('error in multipart Upload', err);
    logger.info('abort message', done);
    // reject(err);
    sendEmail(`File upload failed. ${params.Key.split('/').pop()}\n error ${err} `);
    return { error: err, message: done };
  };
  // });
};

exports.multiPartUploadToS3 = multiPartUploadToS3;

const sendEmail = async function (emailAddresses, data, status, activity) {
  const ses = new AWS.SES({ region: 'ap-southeast-1' });
  return new Promise((resolve, reject) => {
    const params = {
      Destination: {
        ToAddresses: emailAddresses
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: data
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: `${activity} Upload Confirmation - Upload ${status}`
        }
      },
      Source: process.env.DCA_EMAIL_FROM_ADDRESS
    };

    ses.sendEmail(params, (err, response) => {
      if (err) {
        logger.error('err sending email.', err);
        reject(err);
      };
      logger.info('Email Sent', response);
      resolve(response);
    });
  });
  // const emailSentResponse = await  ses.sendEmail(params).promise() ;
  // console.log('sending email.....', emailSentResponse);
};

exports.triggerSendEmail = sendEmail;
