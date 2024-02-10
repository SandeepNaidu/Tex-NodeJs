const { successCode, errorCode } = require('../../config/vars');
const { logger } = require('../../utils/logger');
const Moment = require('moment');
const cloudReporter = require('cloud-reports');
const AWS = require('aws-sdk');
AWS.config.apiVerison = 'latest';
AWS.config.credentials = new AWS.EC2MetadataCredentials({
  httpOptions: { timeout: 5000 }
});

function makeFileName (accountNumber) {
  return accountNumber + '_' + Moment().format('YYYY-MM-DD-hh-mm-ss') + '.csv';
}

function getAccountNumber (analyzedData) {
  if (analyzedData['aws.account']) {
    return analyzedData['aws.account'].summary.regions.global[0].resourceSummary.value;
  }
  return 'default';
}

exports.collectCloudReport = async (query) => {
  try {
    return new Promise((resolve, reject) => {
      const obj = {
        moduleNames: query.module,
        regions: query.region
      };
      const collectionPromise = cloudReporter.collect(obj);

      const analysisPromise = collectionPromise.then((collectedJson) => cloudReporter.analyze(collectedJson));
      analysisPromise.then((analysisJson) => {
        const fix = analysisJson;
        const accountNumber = getAccountNumber(analysisJson);
        const reportFileData = cloudReporter.generateCSV(fix);
        const reportJsonData = prepareRecords(fix, { showIssuesOnly: false });
        const reportFileName = makeFileName(accountNumber);
        resolve({
          resultCode: successCode,
          body: {
            filename: reportFileName,
            csvFile: reportFileData,
            jsonFile: reportJsonData
          }
        });
      }).catch((err) => {
        logger.error('Error Collecting Cloud Report: ', err);
        return { resultCode: errorCode, body: { message: err } };
      });
    });
  } catch (error) {
    logger.error('Failed Collect Cloud Report Service: ', error);
    return { resultCode: errorCode, body: { message: error } };
  }
};

function prepareRecords (reportData, options) {
  options = options || { showIssuesOnly: false };
  const records = [['ServiceName', 'CheckName', 'Region', 'ResourceName',
    'ResourceValue', 'Message', 'Action', 'Severity']];
  for (const serviceName in reportData) {
    for (const checkName in reportData[serviceName]) {
      for (const regionName in reportData[serviceName][checkName].regions) {
        let regionDetails = reportData[serviceName][checkName].regions[regionName];
        if (!regionDetails) {
          continue;
        }
        if (options.showIssuesOnly && regionDetails.length) {
          regionDetails = regionDetails.filter((resourceDetails) => {
            return resourceDetails.severity === 'Warning' ||
                          resourceDetails.severity === 'Failure';
          });
          reportData[serviceName][checkName].regions[regionName] = regionDetails;
        }
        for (const regionResourceDetails of regionDetails) {
          records.push([serviceName, checkName, regionName,
            regionResourceDetails.resourceSummary.name,
            (regionResourceDetails.resourceSummary.value || '').replace(/,/g, ' '),
            (regionResourceDetails.message || '').replace(/,/g, ' '),
            (regionResourceDetails.action || '').replace(/,/g, ' '),
            (regionResourceDetails.severity || '')
          ]);
        }
      }
    }
  }
  return records;
}

// exports.collectCloudReport = async (query) => {
//   try {
//     return new Promise((resolve, reject) => {
//       let collectionPromise = "";
//       if (query) {
//         let obj = { //default
//           moduleNames: ["acm", "cloudfront", "cloudwatch", "dynamodb", "ebs", "ec2", "elasticsearch", "elb", "iam", "lambda", "rds", "shift", "resourcegroups", "route53", "s3", "sns", "sqs", "trails", "vpc"],
//           regions: ["us-east-1", "us-west-2", "us-west-1", "eu-west-1", "eu-central-1", "ap-southeast-1", "ap-northeast-1", "ap-southeast-2", "ap-northeast-2", "sa-east-1", "cn-north-1", "ap-south-1"]
//         };
//         if (query.moduleNames) obj.moduleNames = query.moduleNames
//         if (query.regions) obj.regions = query.regions
//         collectionPromise  = cloudReporter.collect(obj); //ec2, ap-southeast-1
//       } else {
//         collectionPromise  = cloudReporter.collect();
//       }
//       const analysisPromise = collectionPromise.then((collectedJson) => cloudReporter.analyze(collectedJson));
//       analysisPromise.then((analysisJson) => {
//         const accountNumber = getAccountNumber(analysisJson);
//         const reportFileData = cloudReporter.generateCSV(analysisJson);
//         const reportFileName = makeFileName(accountNumber);
//         fs_1.writeFileSync(reportFileName, reportFileData);
//         opn(reportFileName, { wait: false });
//         resolve({
//           resultCode: successCode,
//           body: {
//             filename: reportFileName,
//             message: `${reportFileName} is generated in server 'reports-generated' directory`}
//           });
//       }).catch((err) => {
//         logger.error('Error Collecting Cloud Report: ', err);
//             reject({ resultCode: errorCode, body: {message: err} });
//       });
//     });
//   } catch (error) {
//     logger.error('Failed Collect Cloud Report Service: ', error);
//     throw error;
//   }
// };
