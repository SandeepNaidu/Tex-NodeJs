// const fs = require('fs');
// const AWS = require('aws-sdk');
//
// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: "ap-south-1"
// });
//
// exports.uploadFileToS3Bucket = async function (bucketName, keyName, fileName){
//   const fileName = 'fb.jpg';
//   const fileContent = fs.readFileSync(fileName);
//      const params = {
//          Bucket: 'avid-video', // pass your bucket name
//          Key: 'addresses.jpg', // file will be saved as testBucket/contacts.csv
//          Body: fileContent
//      };
//      s3.upload(params, function(s3Err, data) {
//          if (s3Err) throw s3Err
//          console.log(`File uploaded successfully at ${data.Location}`)
//      });
// };
