const {
    getAlerts,
    createAlert,
    editAlert,
    deleteAlert,
  } = require("./alerts.controller");
  const { mockRequest, mockResponse } = require("../../../utils/Interceptor");
  const tex = require("../../../services/tex");
  const db = require('../../../services/db');
jest.mock('../../../services/db', () => ({
  GetSyncDBConnection:jest.fn()
}));
  jest.mock("knex", () => {
    const fn = () => {
      const { alertsMockData } = require("../../../config/fakeresponse");
      return {
        dbconnection: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        column: jest.fn().mockReturnThis(),
        first: jest.fn().mockReturnThis(),
        into: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockReturnThis(),
        whereIn: jest.fn().mockReturnThis(),  
        raw: jest.fn().mockReturnThis(),
        then: jest.fn(function (done) {
          done([alertsMockData]);
        }),
      };
    };
    return fn;
  });
  test("it should create a new alert", async () => {
    const mockResp = () => {
      const response = {
        responseCode: 200,
        body: {
          policy: {
            message: "Alert has been successfully created",
          },
        },
      };
      response.status = jest.fn().mockReturnValue(response);
      response.json = jest.fn().mockReturnValue(response);
      return response;
    };
    let res = mockResp();
    const req = {
      body: {
        data: {
          "alertMessage": "Important: Application contain Nielsen under personal or commercial submission, please check account flashes at 0943100896 for relevant contact no., email, PIC. Obtain VT HOD approval if any",
          "priority": "3",
          "isActive": "1",
          "check": "",
          "rag": "G"
        },
        auditLog: {
          userId: "akshay-admin",
          activity: "account",
          description: "account widget:",
          page: "Custom Information Page",
          ipAddress: "103.209.88.70",
          hostName: "103",
        },
      },
    };
    const result = await createAlert(req, res);
    expect(result.responseCode).toEqual(200);
  });
  
  test("it should throw an error if alert data is not present", async () => {
    let req = mockRequest();
    req.body.name = null;
    req.body.data = [];
    let res = mockResponse();
  
    tex.createAlert = jest.fn();
    tex.createAlert.mockRejectedValue({
      body: { error: "Cannot create alert" },
    });
    await createAlert(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
  
  test("it should get list of all alerts branch active false", async () => {
    const mockResp = () => {
      const response = {
        responseCode: 200,
        body: { 
          alerts: [{
          "ALERT_MSG": "Escalate to Elite Team if submission from K0101133",
          "PRIORITY": "1",
          "ISACTIVE": "0",
          "CHECK": "0",
          "RAG": "R",
          "ALERT_ID": 1
          }] 
        }
      };
      response.status = jest.fn().mockReturnValue(response);
      response.json = jest.fn().mockReturnValue(response);
      return response;
    };
    let res = mockResp();
    const req = {
        query :{
        active: false
      }
    };
    const result = await getAlerts(req, res);
    expect(result.responseCode).toEqual(200);
  });

  test("it should get list of all alerts branch active true", async () => {
    const mockResp = () => {
      const response = {
        responseCode: 200,
        body: { 
          alerts: [{
          "ALERT_MSG": "Escalate to Elite Team if submission from K0101133",
          "PRIORITY": "1",
          "ISACTIVE": "0",
          "CHECK": "0",
          "RAG": "R",
          "ALERT_ID": 1
          }] 
        }
      };
      response.status = jest.fn().mockReturnValue(response);
      response.json = jest.fn().mockReturnValue(response);
      return response;
    };
    let res = mockResp();
    const req = {
        query :{
        active: true
      }
    };
    const result = await getAlerts(req, res);
    expect(result.responseCode).toEqual(200);
  });
  
  test("it should fail to get alerts", async () => {
    let req = mockRequest();
    let res = mockResponse();
  
    tex.getAlerts = jest.fn();
    tex.getAlerts.mockRejectedValue({
      body: { data: "Cannot fetch list of alerts" },
    });
    await getAlerts(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
  
  test("it should update alert details", async () => {
    const mockResp = () => {
      const response = {
        responseCode: 200,
        body: { message: "Alert has been updated" },
      };
      response.status = jest.fn().mockReturnValue(response);
      response.json = jest.fn().mockReturnValue(response);
      return response;
    };
    let req = mockRequest();
    req.params.id = 1;
    req.body = { 
      data:{
      "ALERT_MSG": "Escalate to Elite Team if submission from K0101133",
      "PRIORITY": "1",
      "ISACTIVE": "0",
      "CHECK": "0",
      "RAG": "R",
      "ALERT_ID": 1
      }
      };
    let res = mockResp();
   const result =  await editAlert(req, res);
    expect(result.responseCode).toEqual(200);
  });
  
  test("it should throw an error if alert id is not present in params", async () => {
    let req = mockRequest();
    req.body = {};
    let res = mockResponse();
  
    tex.editAlert = jest.fn();
    tex.editAlert.mockRejectedValue({
      body: { error: "Cannot update alert" },
    });
    await editAlert(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
  test("it should delete alert", async () => {
    const mockResp = () => {
      const response = {
        responseCode: 200,
        body: { message: "Alert has been deleted" },
      };
      response.status = jest.fn().mockReturnValue(response);
      response.json = jest.fn().mockReturnValue(response);
      return response;
    };
    let req = mockRequest();
    req.params.id = 1;
    req.body = { 
      data:{
      "ALERT_MSG": "Escalate to Elite Team if submission from K0101133",
      "PRIORITY": "1",
      "ISACTIVE": "0",
      "CHECK": "0",
      "RAG": "R",
      "ALERT_ID": 1
      }
      };
    let res = mockResp();
   const result =  await deleteAlert(req, res);
    expect(result.responseCode).toEqual(200);
  });
  
  test("it should throw an error if delete alert id is not present in params", async () => {
    let req = mockRequest();
    req.body = {};
    let res = mockResponse();
  
    tex.editAlert = jest.fn();
    tex.editAlert.mockRejectedValue({
      body: { error: "Cannot delete alert" },
    });
    await deleteAlert(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });