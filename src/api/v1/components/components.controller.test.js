const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const {
  getComponents,
  createComponent,
  editComponent,
  updateComponentStatus,
  getComponentsById,
} = require("./components.controller");
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
      orderBy: jest.fn().mockReturnThis(),
      raw: jest.fn().mockReturnThis(),
      then: jest.fn(function (done) {
        done([auditLogsMockData]);
      }),
    };
  };
  return fn;
});
test("it should get list of all components", async () => {
  const mockResp = () => {
    const response = {
      responseCode: 200,
      body: {
        components: [{ value: 1, label: "Subscription Information" }],
      },
    };
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    return response;
  };
  let res = mockResp();

  const req = { body: { data: { userId: "akshay-admin" } } };
  const result = await getComponents(req, res);
  expect(result.status).toHaveBeenCalledWith(200);
});

test("it should fail to get components", async () => {
  let req = mockRequest();
  let res = mockResponse();

  tex.getComponents = jest.fn();
  tex.getComponents.mockRejectedValue({
    body: { data: "Cannot fetch list of components" },
  });
  await getComponents(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
});

test("it should create a new component", async () => {
  const mockResp = () => {
    const response = {
      responseCode: 200,
      body: {
        message: "Component has been successfully created",
      },
    };
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    return response;
  };
  let res = mockResp();

  const req = {
    body: {
      data: { name: "Account Information" },
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
  const result = await createComponent(req, res);
  expect(result.status).toHaveBeenCalledWith(200);
});

test("it should throw an error if component name is not present", async () => {
  let req = mockRequest();
  req.body.name = null;
  let res = mockResponse();

  tex.createComponent = jest.fn();
  tex.createComponent.mockRejectedValue({
    body: { error: "Cannot create component" },
  });
  await createComponent(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
});

test("it should update component name", async () => {
  let req = mockRequest();
  req.params.id = 1;
  req.body = {
    data: { name: "Account Information" },
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

  tex.editComponent = jest.fn();
  tex.editComponent.mockResolvedValue({
    body: { message: "Component has been successfully edited" },
  });
  await editComponent(req, res);
  expect(res.json).toHaveBeenCalledWith({
    responseCode: 200,
    body: {
      component: {
        body: {
          message: "Component has been successfully edited",
        },
      },
    },
  });
  expect(res.status).toHaveBeenCalledWith(200);
});

test("it should throw an error if component id is not present in params", async () => {
  let req = mockRequest();
  req.params.id = null;
  let res = mockResponse();

  tex.editComponent = jest.fn();
  tex.editComponent.mockRejectedValue({
    body: { error: "Cannot update component" },
  });
  await editComponent(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
});

test("it should update component status", async () => {
  let req = mockRequest();
  req.params.id = 1;
  req.query.status = "false";
  let res = mockResponse();

  tex.updateComponentStatus = jest.fn();
  tex.updateComponentStatus.mockResolvedValue({
    body: { message: "Component has been successfully deactivated" },
  });
  await updateComponentStatus(req, res);
  expect(res.json).toHaveBeenCalledWith({
    responseCode: 200,
    body: {
      component: {
        body: {
          message: "Component has been successfully deactivated",
        },
      },
    },
  });
  expect(res.status).toHaveBeenCalledWith(200);
});

test("it should throw an error if component id is not present in params for updating status", async () => {
  let req = mockRequest();
  req.params.id = null;
  let res = mockResponse();

  tex.updateComponentStatus = jest.fn();
  tex.updateComponentStatus.mockRejectedValue({
    body: { error: "Cannot update component status" },
  });
  await updateComponentStatus(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
});

test("it should get component data based on id", async () => {
  const mockResp = () => {
    const response = {
      responseCode: 200,
      body: {
        components: [{ label: "Account Info", value: 1 }],
      },
    };
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    return response;
  };
  let res = mockResp();
  let req = mockRequest();
  req.params.id = 1;
  const result = await getComponentsById(req, res);
  expect(result.status).toHaveBeenCalledWith(200);
});

test("it should throw an error if component id is not present in params for getting data", async () => {
  let req = mockRequest();
  req.params.id = null;
  let res = mockResponse();

  tex.getComponentsById = jest.fn();
  tex.getComponentsById.mockRejectedValue({
    body: { error: "Cannot fetch component data" },
  });
  await getComponentsById(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
});
