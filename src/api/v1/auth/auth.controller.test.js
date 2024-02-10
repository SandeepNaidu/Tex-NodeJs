const { login, changePassword, signOut, forgotPassword, confirmForgotPassword, adminResetPassword} = require('./auth.controller');
const { mockRequest, mockResponse } = require("../../../utils/Interceptor")
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const aws = require("../../../services/aws")
const tex = require("../../../services/tex")
const {encryptJSON} = require("../../../utils/common")

/*test('should login user', async () => {  
    let req = mockRequest();
    const pwd = '21342133123423'
    req.body = {data:{username: 'test', password: pwd},
    auditLog: {
        userId: "akshay-admin",
        activity: "Address",
        description: "Address data:",
        page: "Custom Information Page",
        ipAddress: "103.209.88.70",
        hostName: "103",
      },}
    let res = mockResponse();

    aws.login = jest.fn()
    tex.fetchUserDetails = jest.fn()
    aws.login.mockResolvedValue({idToken: "123412323", refreshToken: "1234234124233"})
    tex.fetchUserDetails.mockResolvedValue({body: {userData: {id: 1, username: "test", firstName: "Test", lastName: "User"}}})
    await login(req, res)
    // expect(res.json).toHaveBeenCalledWith(
    //     { 
    //         responseCode: 200, 
    //         body: "afdfkbadfa=adf+asdafaf"
    //     }
    // )
    expect(res.status).toHaveBeenCalledWith(200);
}, 30000);*/

/*test('should send a response of force password change', async () => {   
    let req = mockRequest();
    const pwd = '21342133123423'
    req.body = {username: 'test', password: pwd}
    let res = mockResponse();

    aws.login = jest.fn()
    aws.login.mockResolvedValue({passwordChangeRequired: true})
    await login(req, res)
    expect(res.json).toHaveBeenCalledWith(
        { 
            responseCode: 200, 
            body: { passwordChangeRequired: true }
        }
    )
    expect(res.status).toHaveBeenCalledWith(200);
});*/

test('it should throw an error if username and password are not present', async () => {
    let req = mockRequest();
    req.body = {}
    let res = mockResponse();

    aws.login = jest.fn()
    aws.login.mockRejectedValue({ body: { data: "Login failed" }})
    await login(req, res)
    expect(res.status).toHaveBeenCalledWith(500);
})

test('should logout user', async () => {   
    let req = mockRequest();
    let res = mockResponse();
    req.headers.authorization = "asff3123x1r23rx"
    tex.signOut = jest.fn()
    tex.signOut.mockResolvedValue({ signOut: true })
    await signOut(req, res)
    expect(res.json).toHaveBeenCalledWith({ logout: true})
    expect(res.status).toHaveBeenCalledWith(200);
});

// test('should change password', async () => {   
//     let req = mockRequest();
//     const pwd = '21342133123423'
//     const newPwd = '21342133123423'
//     req.body = { data: {username: 'test', password: pwd, newPassword: newPwd}}
//     let res = mockResponse();

//     aws.changePassword = jest.fn()
//     aws.changePassword.mockResolvedValue(true)
//     await changePassword(req, res)
//     expect(res.json).toHaveBeenCalledWith(
//         { 
//             responseCode: 200, 
//             body: { message: 'Reset Password is successful' }
//         }
//     )
//     expect(res.status).toHaveBeenCalledWith(200);
// });

test('it should throw an error if new password is missing', async () => {
    let req = mockRequest();
    const pwd = '21342133123423'
    req.body = {username: 'test', password: pwd}
    let res = mockResponse();

    aws.changePassword = jest.fn()
    aws.changePassword.mockRejectedValue({ body: { data: "Password changed failed" }})
    await changePassword(req, res)
    expect(res.status).toHaveBeenCalledWith(500);
})

// test('should send verification code for forgot password', async () => {   
//     let req = mockRequest();
//     req.body = { data: { username: 'test'} }
//     let res = mockResponse();

//     tex.forgotPassword = jest.fn()
//     tex.forgotPassword.mockResolvedValue(true)
//     await forgotPassword(req, res)
//     expect(res.json).toHaveBeenCalledWith(
//         { 
//             responseCode: 200, 
//             body: {
//                     message: 'Verification code sent on your email'
//                 }
//         }
//     )
//     expect(res.status).toHaveBeenCalledWith(200);
// });

test('it should throw an error if username is missing in forgor password', async () => {
    let req = mockRequest();
    req.body = { data: { username: ''} }
    let res = mockResponse();

    tex.forgetPassword = jest.fn()
    tex.forgetPassword.mockRejectedValue({ body: { errors: [ { errorMessage: 'Please enter valid username' } ]}})
    await changePassword(req, res)
    expect(res.status).toHaveBeenCalledWith(500);
})

// test('should confirm forgot password', async () => {   
//     let req = mockRequest();
//     const pwd = 'Qwerty12345'
//     req.body = { data: { username: 'test', confirmationCode: '123456', password: pwd} }
//     let res = mockResponse();

//     aws.confirmForgotPassword = jest.fn()
//     aws.confirmForgotPassword.mockResolvedValue(true)
//     await confirmForgotPassword(req, res)
//     expect(res.json).toHaveBeenCalledWith(
//         { 
//             responseCode: 200, 
//             body: {
//                     message: 'Password Reset is successful'
//                 }
//         }
//     )
//     expect(res.status).toHaveBeenCalledWith(200);
// });

test('it should throw an error if code is wrong in forgot password', async () => {
    let req = mockRequest();
    const pwd = ''
    req.body = { data: { username: '', confirmationCode: '', password: pwd} }
    let res = mockResponse();

    tex.confirmForgotPassword = jest.fn()
    tex.confirmForgotPassword.mockRejectedValue({ body: { errors: [ { errorMessage: 'Please enter valid data' } ]}})
    await changePassword(req, res)
    expect(res.status).toHaveBeenCalledWith(500);
})

test('should reset password', async () => {   
    let req = mockRequest();
    const pwd = 'xxxxxxx'
    req.body = { data: {username: 'test', password: pwd}}
    let res = mockResponse();

    tex.adminResetPassword = jest.fn()
    tex.adminResetPassword.mockResolvedValue(true)
    await adminResetPassword(req, res)
    expect(res.json).toHaveBeenCalledWith(
        { 
            responseCode: 200, 
            body: { message: 'Password Reset Successful' }
        }
    )
    expect(res.status).toHaveBeenCalledWith(200);
});
