
const axios = require('axios');

const apiKey = '8e40c689-f470-11ed-addf-0200cd936042';
const otpTemplateName = 'tex-sms-otp';


exports.sendOTP = async function (OTP, mobileNo){

   const url = `https://2factor.in/API/V1/${apiKey}/SMS/${mobileNo}/${OTP}/${otpTemplateName}`;
// Send the GET request
axios.get(url)
  .then(function (response) {
    // Handle success
    console.log('OTP sent successfully:', response.data);
  })
  .catch(function (error) {
    // Handle error
    console.error('Failed to send OTP:', error);
  });

};


/*var myConfig = new AWS.Config();
myConfig.update({region: 'ap-southeast-1'})
const Config = {
   apiVersion: "2010-12-01",
   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
   accessSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
   region: "ap-southeast-1"
}
AWS.config.update(Config);
var sns = new AWS.SNS();

//function to send OTP using AWS-SNS
exports.sendOTP = async function (OTP, mobileNo){
   console.log("OTP generated: "+OTP+ " for number: "+mobileNo);
   const snsParams = {};
   snsParams.Message = "Welcome to Tex! your mobile verification code is: " + OTP;
   snsParams.PhoneNumber = mobileNo;
   console.log("sns param: ", snsParams);

      return sns.publish(snsParams).promise()
      .then(message => {
        console.log("OTP SEND SUCCESS"+JSON.stringify(message));
        })
        .catch(err => {
        console.log("Error "+err)
        return err;});
 };
 */
