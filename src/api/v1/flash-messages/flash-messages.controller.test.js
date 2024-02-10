const { flashMessagesInfo } = require("./flash-messages.controller");

jest.mock("knex", () => {
  const fn = () => {
    const { flashMessagesMockData } = require("../../../config/fakeresponse");
    return {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      raw: jest.fn().mockReturnThis(),
      then: jest.fn(function (done) {
        done([flashMessagesMockData]);
      }),
    };
  };
  return fn;
});
test("it should return flash messages info ", async () => {
  const mockResp = () => {
    const response = {
      responseCode: 200,
      body: {},
    };
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    return response;
  };
  const req = {
    body: {
      data: {
        account_id: "016016884245",
      },
      auditLog: {
        userId: "akshay-admin",
        activity: "Subscription Package Info",
        description: "Subscription Package Info: 016016884245",
        page: "Customer Information Page",
      },
    },
  };
  const res = mockResp();
  const result = await flashMessagesInfo(req, res);
  expect(result.responseCode).toEqual(200);
});
test("it should throw validation message on passing empty account_id in request body", async () => {
  const mockResp = () => {
    const response = {
      name: "ValidationError",
      message: "Validation Failed",
      responseCode: 400,
      error: "Bad Request",
      details: {
        body: [
          {
            message: '"data.account_id" is required',
            path: ["data", "account_id"],
            type: "any.required",
            context: {
              label: "data.account_id",
              key: "account_id",
            },
          },
        ],
      },
    };
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    return response;
  };
  const req = {
    data: {},
    auditLog: {
      userId: "akshay-admin",
      activity: "Subscription Package Info",
      description: "Subscription Package Info: 016016884245",
      page: "Customer Information Page",
    },
  };
  const res = mockResp();
  const ErrorMessage = 'data.account_ido is required';
  const result = await flashMessagesInfo(req, res);
  expect(result.responseCode).toBe(400);
  expect(result.message).toEqual('Validation Failed');
});