const httpStatus = require("http-status");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const request = require("supertest");
const api = require("../..");
const { flashMessagesPassed, flashMessagesFailed } = require("../../../config/fakeresponse");
const tex = require("../../../services/tex");
jest.mock("../../../services/tex", () => ({
    getFlashMessageInfo: jest.fn(),
}));
app.use("/tex", api);

test("should return flash message info branch if", async () => {
  let stateObj = {
    data: { account_id: "98843606" },
    auditLog: {
      userId: "akshay-admin",
      activity: "flashmessage",
      description: "flash message data:",
      page: "Custom Information Page",
      ipAddress: "103.209.88.70",
      hostName: "103",
    },
  };
  tex.getFlashMessageInfo.mockImplementation(() => Promise.resolve(flashMessagesPassed));
  await request(app)
    .post("/tex/v1/flashMessages")
    .send(stateObj)
    .set('Accept', 'application/json')
    .expect(httpStatus.OK);
});

test("should return flash message info branch else", async () => {
  let stateObj = {
    data: { account_id: "98843606" },
    auditLog: {
      userId: "akshay-admin",
      activity: "flashmessage",
      description: "flash message data:",
      page: "Custom Information Page",
      ipAddress: "103.209.88.70",
      hostName: "103",
    },
  };
  tex.getFlashMessageInfo.mockImplementation(() => Promise.resolve(flashMessagesFailed));
  await request(app)
    .post("/tex/v1/flashMessages")
    .send(stateObj)
    .set('Accept', 'application/json')
    .expect(httpStatus.OK);
});

test("should return validation error for invalid account id- falsh messages", async () => {
  let stateObj = {
    data: { account_id: 9 },
    auditLog: {
      userId: "akshay-admin",
      activity: "flashmessages",
      description: "flashmessages:",
      page: "Custom Information Page",
      ipAddress: "103.209.88.70",
      hostName: "103",
    },
  };

  await request(app)
    .post("/tex/v1/flashMessages")
    .send(stateObj)
    .set('Accept', 'application/json')
    .expect(httpStatus.BAD_REQUEST);
});

test("should return exception on passing empty params - flash message Info", async () => {
  let stateObj = {};
  await request(app)
    .post("/tex/v1/flashMessages")
    .send(stateObj)
    .expect(httpStatus.OK);
});
