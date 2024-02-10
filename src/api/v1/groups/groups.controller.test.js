const {
  getGroups,
  createGroup,
  getPoliciesFromGroup,
  updateGroupStatus,
  editGroup,
} = require("./groups.controller");
const { mockRequest, mockResponse } = require("../../../utils/Interceptor");
const tex = require("../../../services/tex");
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
      raw: jest.fn().mockReturnThis(),
      then: jest.fn(function (done) {
        done([auditLogsMockData]);
      }),
    };
  };
  return fn;
});
test("it should create a new group", async () => {
  const mockResp = () => {
    const response = {
      responseCode: 200,
      body: {
        message: "Group has been successfully created",
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
        name: "CIP Admin Group",
        policies: [{ value: 1 }, { value: 2 }],
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
  const result = await createGroup(req, res);
  expect(result.status).toHaveBeenCalledWith(200);
});

test("it should throw an error if group name is not present", async () => {
  let req = mockRequest();
  req.body.name = null;
  req.body.policies = [];
  let res = mockResponse();

  tex.createGroup = jest.fn();
  tex.createGroup.mockRejectedValue({
    body: { error: "Cannot create group" },
  });
  await createGroup(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
});

test("it should get list of all groups branch if", async () => {
  const mockResp = () => {
    const response = {
      responseCode: 200,
      body: {
        groups: [{ value: 1, label: "CIP Admin Group" }],
      },
    };
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    return response;
  };
  let res = mockResp();

  const req = mockRequest();
  req.query.user = '11111111';
  const result = await getGroups(req, res);
  expect(result.status).toHaveBeenCalledWith(200);
});

test("it should get list of all groups branch else", async () => {
  const mockResp = () => {
    const response = {
      responseCode: 200,
      body: {
        groups: [{ value: 1, label: "CIP Admin Group" }],
      },
    };
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    return response;
  };
  let res = mockResp();

  const req = mockRequest();
  req.query.policies = true
  const result = await getGroups(req, res);
  expect(result.status).toHaveBeenCalledWith(200);
});

test("it should fail to get groups", async () => {
  let req = mockRequest();
  let res = mockResponse();

  tex.getGroups = jest.fn();
  tex.getGroups.mockRejectedValue({
    body: { data: "Cannot fetch list of groups" },
  });
  await getGroups(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
});

test("it should get list of policies based on group", async () => {
  const mockResp = () => {
    const response = {
      responseCode: 200,
      body: {
         policies: [
        { id: 1, name: "BillingPolicy" },
        { id: 2, name: "AccountPolicy" },
      ],
      },
    };
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    return response;
  };
  let res = mockResp();

  let req = mockRequest();
  req.params.groupId = 1;
  const result = await getPoliciesFromGroup(req, res);
  expect(result.status).toHaveBeenCalledWith(200);
});

test("it should fail to get policies based on group", async () => {
  let req = mockRequest();
  req.params.groupId = null;
  let res = mockResponse();

  tex.getPoliciesFromGroup = jest.fn();
  tex.getPoliciesFromGroup.mockRejectedValue({
    body: { data: "Cannot fetch list of policies" },
  });
  await getPoliciesFromGroup(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
});

test("it should update group status", async () => {
  let req = mockRequest();
  req.params.id = 1;
  req.query.status = "false";
  let res = mockResponse();

  tex.updateGroupStatus = jest.fn();
  tex.updateGroupStatus.mockResolvedValue({
    body: { message: "Group has been successfully deactivated" },
  });
  await updateGroupStatus(req, res);
  expect(res.json).toHaveBeenCalledWith({
    responseCode: 200,
    body: {
      group: {
        body: {
          message: "Group has been successfully deactivated",
        },
      },
    },
  });
  expect(res.status).toHaveBeenCalledWith(200);
});

test("it should throw an error if group id is not present in params for updating status", async () => {
  let req = mockRequest();
  req.params.id = null;
  let res = mockResponse();

  tex.updateGroupStatus = jest.fn();
  tex.updateGroupStatus.mockRejectedValue({
    body: { error: "Cannot update group status" },
  });
  await updateGroupStatus(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
});

test("it should update group details", async () => {
  let req = mockRequest();
  req.body = { id: 1, name: "Admin Group", policies: [1, 2, 3] };
  let res = mockResponse();

  tex.editGroup = jest.fn();
  tex.editGroup.mockResolvedValue({
    body: { message: "Group has been successfully edited" },
  });
  await editGroup(req, res);
  expect(res.json).toHaveBeenCalledWith({
    responseCode: 200,
    body: {
      group: {
        body: {
          message: "Group has been successfully edited",
        },
      },
    },
  });
  expect(res.status).toHaveBeenCalledWith(200);
});

test("it should throw an error if group id is not present in params for editing group details", async () => {
  let req = mockRequest();
  req.body = {};
  let res = mockResponse();

  tex.editGroup = jest.fn();
  tex.editGroup.mockRejectedValue({ body: { error: "Cannot update group" } });
  await editGroup(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
});

/*test("it should get list of all groups and attached policies", async () => {
  const mockResp = () => {
    const response = {
      responseCode: 200,
      body: {
         data: [
        {
          id: 1,
          name: "CIP Admin Group",
          status: 1,
          policies: ["Billing", "Account"],
          policyId: [1, 2],
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
  req.query.policies = true;
  const result = await getGroups(req, res);
  expect(result.status).toHaveBeenCalledWith(200);
});*/

/*test("it should get list of groups assigned to admin", async () => {
  const mockResp = () => {
    const response = {
      responseCode: 200,
      body: {
         groups: [
        { label: "Admin Group", value: 1 },
        { label: "New Group", value: 2 },
      ],
      },
    };
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    return response;
  };
  let res = mockResp();

  let req = mockRequest();
  req.query.user = "1";
  const result = await getGroups(req, res);
  expect(result.status).toHaveBeenCalledWith(200);
});*/
