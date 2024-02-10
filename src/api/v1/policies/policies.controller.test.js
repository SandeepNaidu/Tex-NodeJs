const {
  getPolicies,
  createPolicy,
  editPolicy,
  updatePolicyStatus,
} = require("./policies.controller");
const { mockRequest, mockResponse } = require("../../../utils/Interceptor");
const tex = require("../../../services/tex);
jest.mock("knex", () => {
  const fn = () => {
    const { auditLogsMockData } = require("../../../config/fakeresponse");
    return {
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
        done([auditLogsMockData]);
      }),
    };
  };
  return fn;
});
test("it should create a new policy", async () => {
  const mockResp = () => {
    const response = {
      responseCode: 200,
      body: {
        policy: {
          message: "Policy has been successfully created",
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
        name: "Account Subscription Policy",
        components: [{ value: 1 }, { value: 2 }],
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
  const result = await createPolicy(req, res);
  expect(result.status).toHaveBeenCalledWith(200);
});

test("it should throw an error if policy name is not present", async () => {
  let req = mockRequest();
  req.body.name = null;
  req.body.components = [];
  let res = mockResponse();

  tex.createPolicy = jest.fn();
  tex.createPolicy.mockRejectedValue({
    body: { error: "Cannot create policy" },
  });
  await createPolicy(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
});

test("it should get list of all policies", async () => {
  const mockResp = () => {
    const response = {
      responseCode: 200,
      body: { policies: [{ value: 1, label: "Account Subscription Policy" }] },
    };
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    return response;
  };
  let res = mockResp();

  let req = mockRequest();
  const result = await getPolicies(req, res);
  expect(result.status).toHaveBeenCalledWith(200);
});

test("it should fail to get policies", async () => {
  let req = mockRequest();
  let res = mockResponse();

  tex.getPolicies = jest.fn();
  tex.getPolicies.mockRejectedValue({
    body: { data: "Cannot fetch list of policies" },
  });
  await getPolicies(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
});

test("it should update policy details", async () => {
  let req = mockRequest();
  req.body = { id: 1, name: "BillingAddress", components: [1, 2] };
  let res = mockResponse();

  tex.editPolicy = jest.fn();
  tex.editPolicy.mockResolvedValue({
    body: { message: "Policy has been updated" },
  });
  await editPolicy(req, res);
  expect(res.json).toHaveBeenCalledWith({
    responseCode: 200,
    body: {
      policy: {
        body: {
          message: "Policy has been updated",
        },
      },
    },
  });
  expect(res.status).toHaveBeenCalledWith(200);
});

test("it should throw an error if component id is not present in params", async () => {
  let req = mockRequest();
  req.body = {};
  let res = mockResponse();

  tex.editPolicy = jest.fn();
  tex.editPolicy.mockRejectedValue({
    body: { error: "Cannot update policy" },
  });
  await editPolicy(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
});

test("it should update policy status", async () => {
  let req = mockRequest();
  req.params.id = 1;
  req.query.status = "false";
  let res = mockResponse();

  tex.updatePolicyStatus = jest.fn();
  tex.updatePolicyStatus.mockResolvedValue({
    body: { message: "Policy has been successfully deactivated" },
  });
  await updatePolicyStatus(req, res);
  expect(res.json).toHaveBeenCalledWith({
    responseCode: 200,
    body: {
      policy: {
        body: {
          message: "Policy has been successfully deactivated",
        },
      },
    },
  });
  expect(res.status).toHaveBeenCalledWith(200);
});

test("it should throw an error if policy id is not present in params for updating status", async () => {
  let req = mockRequest();
  req.params.id = null;
  let res = mockResponse();

  tex.updatePolicyStatus = jest.fn();
  tex.updatePolicyStatus.mockRejectedValue({
    body: { error: "Cannot update policy status" },
  });
  await updatePolicyStatus(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
});

test("it should get list of all policies and components", async () => {
    const mockResp = () => {
        const response = {
          responseCode: 200,
          body: {       data: [
            {
              id: 1,
              name: "Account Subscription Policy",
              status: 1,
              components: ["Billing", "Address"],
              componentId: [1, 2],
            },
          ],
    
          },
        };
        response.status = jest.fn().mockReturnValue(response);
        response.json = jest.fn().mockReturnValue(response);
        return response;
      };
      let res = mockResp();
    
       let req = mockRequest();
    req.query.components = true
      const result = await getPolicies(req, res);
      expect(result.status).toHaveBeenCalledWith(200);
});

test("it should get list of policies based on group ids", async () => {
    const mockResp = () => {
        const response = {
          responseCode: 200,
          body: {       policies: [
            { id: 1, name: "Account Subscription Policy" },
            { id: 2, name: "Address Account Policy" },
          ],
    
          },
        };
        response.status = jest.fn().mockReturnValue(response);
        response.json = jest.fn().mockReturnValue(response);
        return response;
      };
      let res = mockResp();
    
       let req = mockRequest();
      req.query.groups = "1,2";
    
      const result = await getPolicies(req, res);
      expect(result.status).toHaveBeenCalledWith(200);
});
