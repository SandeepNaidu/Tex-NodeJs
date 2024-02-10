const basicAuth = require("./")
const {mockRequest, mockResponse, mockNext} = require("../../utils/Interceptor")
const fetch = require('node-fetch');
const { Response } = jest.requireActual("node-fetch")

jest.mock("node-fetch")

test('should work fine if google captcha returns success', async () => {
    let req = mockRequest();
    let res = mockResponse();
    let next = mockNext();
    req.body = {
        data: {token: "1234567890"},
        auditLog: {
          userId: "akshay-admin",
          activity: "account",
          description: "account widget:",
          page: "Custom Information Page",
          ipAddress: "103.209.88.70",
          hostName: "103",
        },   
      };
    const value = { success: true };
    const response = new Response(JSON.stringify(value));
    fetch.mockResolvedValueOnce(Promise.resolve(response));
    await basicAuth.humanCheck(req, res, next)
})

test('should return error if google captcha fails', async () => {

    let req = mockRequest();
    let res = mockResponse();
    let next = mockNext();
    req.body = {
        data: {token: "1234567890"},
        auditLog: {
          userId: "akshay-admin",
          activity: "account",
          description: "account widget:",
          page: "Custom Information Page",
          ipAddress: "103.209.88.70",
          hostName: "103",
        },   
      };
    const value = { success: false };
    const response = new Response(JSON.stringify(value));
    fetch.mockResolvedValueOnce(Promise.resolve(response));

    await basicAuth.humanCheck(req, res, next)

    // expect(res.json).toHaveBeenCalledWith({error: "Captcha token expired. Please refresh"})
})
