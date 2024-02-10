const { sendMail } = require('./email.service');
const { uploadFileTos3, getFileFromS3, getSignedUrlFromS3, multiPartUploadToS3, triggerSendEmail } = require('./s3bucket.service');
const { collectCloudReport } = require('./cloud-report.service');
const { sendOTP } = require('./otp.service');
// const { uploadFileToS3Bucket } = require('./s3fileupload.service');

module.exports = {
  sendMail,
  uploadFileTos3,
  getFileFromS3,
  getSignedUrlFromS3,
  multiPartUploadToS3,
  triggerSendEmail,
  collectCloudReport,
  sendOTP
  // uploadFileToS3Bucket
};
