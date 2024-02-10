const {
  getRoles,
  createRoles,
  getGroupsFromRole,
  getSubRoles,
  editRoles,
  updateRoleStatus,
} = require("./roles.controller");
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
      distinct: jest.fn().mockReturnThis(),
      whereIn: jest.fn().mockReturnThis(),
      whereNot: jest.fn().mockReturnThis(),
      raw: jest.fn().mockReturnThis(),
      then: jest.fn(function (done) {
        done([auditLogsMockData]);
      }),
    };
  };
  return fn;
});
test("it should get all roles", async () => {
  const mockResp = () => {
    
    const response = {
      responseCode: 200,
      body: { roles: [{ id: 1, name: "Admin" }] },
    };
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    return response;
  };
  let res = mockResp();
  res.locals ={roleType :""}
  let req = mockRequest();
  const result = await getRoles(req, res);
  
  expect(result.status).toHaveBeenCalledWith(200);
});

test("it should fail to get roles", async () => {
  let req = mockRequest();
  let res = mockResponse();

  tex.getRoles = jest.fn();
  tex.getRoles.mockRejectedValue({
    body: { data: "Cannot fetch list of components" },
  });
  await getRoles(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
});

test("it should create a new role", async () => {
  const mockResp = () => {
    const response = {
      responseCode: 200,
      body: {
        policy: {
          message: "Role has been successfully created",
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
        name: "CIP admin",
        type: "user",
        module: 9,
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
  const result = await createRoles(req, res);
  expect(result.status).toHaveBeenCalledWith(200);
});

test("it should throw an error if role name is not present", async () => {
  let req = mockRequest();
  req.body.name = null;
  req.body.groups = [];
  let res = mockResponse();

  tex.createRoles = jest.fn();
  tex.createRoles.mockRejectedValue({ body: { error: "Cannot create role" } });
  await createRoles(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
});

test("it should get list of all groups based on a role", async () => {
  const mockResp = () => {
    const response = {
      responseCode: 200,
      body: { groups: [{ id: 1, name: "CIP Admin Group" }] },
    };
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    return response;
  };
  let res = mockResp();

  let req = mockRequest();
  req.params.roleId = 1;

  const result = await getGroupsFromRole(req, res);
  expect(result.status).toHaveBeenCalledWith(200);
});

test("it should fail to get groups based on role", async () => {
  let req = mockRequest();
  let res = mockResponse();

  tex.getGroupsFromRole = jest.fn();
  tex.getGroupsFromRole.mockRejectedValue({
    body: { data: "Cannot fetch list of groups based on role" },
  });
  await getGroupsFromRole(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
});

test("it should get list of sub roles based on a role id", async () => {
  const mockResp = () => {
    const response = {
      responseCode: 200,
      body: { roles: [{ id: 2, name: "CIP User" }] },
    };
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    return response;
  };
  let res = mockResp();

  let req = mockRequest();
  req.params.roleId = 1;

  const result = await getSubRoles(req, res);
  expect(result.status).toHaveBeenCalledWith(200);
});

test("it should fail to get sub roles", async () => {
  let req = mockRequest();
  let res = mockResponse();

  tex.getSubRoles = jest.fn();
  tex.getSubRoles.mockRejectedValue({
    body: { data: "Cannot fetch list of sub roles" },
  });
  await getSubRoles(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
});

test("it should update role", async () => {
  let req = mockRequest();
  req.body = {
    data: {
      business_unit_id: 1,
      groups: [17, 3],
      name: "CIP Agent Admin 04",
      parent_role_id: 44,
      type: "cip-agent-admin-04",
      user_type_id: 2
    },
    
    auditLog: {
      userId: "akshay-admin",
      activity: "account",
      description: "account widget:",
      page: "Custom Information Page",
      ipAddress: "103.209.88.70",
      hostName: "103",
    },
  };
  let res = mockResponse();
  res.locals = { username :"akshay-admin" };

  tex.updateRoles = jest.fn();
  tex.updateRoles.mockResolvedValue({
    body: { message: "Role has been successfully edited" },
  });
  await editRoles(req, res);
  expect(res.json).toHaveBeenCalledWith({
    responseCode: 200,
    body: {
      roles: {
        body: {
          message: "Role has been successfully edited",
        },
      },
    },
  });
  expect(res.status).toHaveBeenCalledWith(200);
});

test("it should throw an error if role data is not present for updation", async () => {
  let req = mockRequest();
  req.body = {};
  let res = mockResponse();

  tex.updateRoles = jest.fn();
  tex.updateRoles.mockRejectedValue({ body: { error: "Cannot update role" } });
  await editRoles(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
});

test("it should update role status", async () => {
  let req = mockRequest();
  req.params.id = 1;
  req.query.status = "false";
  let res = mockResponse();

  tex.updateRoleStatus = jest.fn();
  tex.updateRoleStatus.mockResolvedValue({
    body: { message: "Role has been successfully deactivated" },
  });
  await updateRoleStatus(req, res);
  expect(res.json).toHaveBeenCalledWith({
    responseCode: 200,
    body: {
      role: {
        body: {
          message: "Role has been successfully deactivated",
        },
      },
    },
  });
  expect(res.status).toHaveBeenCalledWith(200);
});

test("it should throw an error if role id is not present in params for updating status", async () => {
  let req = mockRequest();
  req.params.id = null;
  let res = mockResponse();

  tex.updateRoleStatus = jest.fn();
  tex.updateRoleStatus.mockRejectedValue({
    body: { error: "Cannot update role status" },
  });
  await updateRoleStatus(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
});

test("it should get admin roles branch dcaadmin", async () => {
  const mockResp = () => {
    const response = {
      responseCode: 200,
      body: { roles: [{ id: 2, name: "Admin" }] },
    };
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    return response;
  };
  let res = mockResp();
   res.locals ={roleType :"dcaadmin"}

  let req = mockRequest();
  req.query.type = "admin";

  const result = await getRoles(req, res);
  expect(result.status).toHaveBeenCalledWith(200);
});

test("it should get admin roles branch dcaadmin", async () => {
  const mockResp = () => {
    const response = {
      responseCode: 200,
      body: { roles: [{ id: 2, name: "Admin" }] },
    };
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    return response;
  };
  let res = mockResp();
   res.locals ={roleType :"dcaagency"}

  let req = mockRequest();
  req.query.type = "dcauser";

  const result = await getRoles(req, res);
  expect(result.status).toHaveBeenCalledWith(200);
});
