const httpStatus = require('http-status');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const request = require('supertest');
const api = require('../../../api');
const { auditLogsMockData, auditLogsMockDataFailed } = require('../../../config/fakeresponse');
const tex = require('../../../services/tex');
jest.mock('../../../services/tex', () => ({
  getAuditLogs: jest.fn(),
}));
app.use('/tex', api);

test('should return user log data branch if', async () => {
  let stateObj = {
    data: {
      userId: 'akshay-admin',
    },
    auditLog: {
      userId: 'akshay-admin',
      activity: 'Login',
      description: 'Login:',
      page: 'Login Page',
      ipAddress: '103.209.88.70',
      hostName: '103'
    }
  };
  tex.getAuditLogs.mockImplementation(() => Promise.resolve(auditLogsMockData));
  await request(app)
    .post('/tex/v1/auditLogs')
    .send(stateObj)
    .set('Accept', 'application/json')
    .expect(httpStatus.OK)
});

test('should return user log data branch else', async () => {
  let stateObj = {
    data: {
      userId: 'akshay-admin',
    },
    auditLog: {
      userId: 'akshay-admin',
      activity: 'Login',
      description: 'Login:',
      page: 'Login Page',
      ipAddress: '103.209.88.70',
      hostName: '103'
    }
  };
  tex.getAuditLogs.mockImplementation(() => Promise.resolve(auditLogsMockDataFailed));
  await request(app)
    .post('/tex/v1/auditLogs')
    .send(stateObj)
    .set('Accept', 'application/json')
    .expect(httpStatus.INTERNAL_SERVER_ERROR)
});

test('should return exception on passing invalid data', async () => {
  let stateObj = {
    data: {
      userId: 456,
    },
    auditLog: {
      userId: 'akshay-admin',
      activity: 'Login',
      description: 'Login',
      page: 'Login Page:',
      ipAddress: '103.209.88.70',
      hostName: '103'
    }
  };
  tex.getAuditLogs.mockImplementation(() => Promise.resolve(auditLogsMockData));
  await request(app)
    .post('/tex/v1/auditlogs')
    .send(stateObj)
    .set('Accept', 'application/json')
    .expect(httpStatus.BAD_REQUEST);
});

test('should return exception on passing empty params', async () => {
  let stateObj = {
    body: {}
  };
  await request(app)
    .post('/tex/v1/auditlogs')
    .send(stateObj)
    .expect(httpStatus.BAD_REQUEST);
});
