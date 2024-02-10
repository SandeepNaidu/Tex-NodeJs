const { auditLog } = require('./audit-logs.controller');
const knex = require('knex');
// const db = require('../../../services/db');
// const { GetSyncDBConnection } = require("../../../services/db")
// jest.mock('../../../services/db', () => ({
//   GetSyncDBConnection:jest.fn()
// }));
jest.mock('knex', () => {
    const fn = () => {
      // const db = require('../../../services/db');
        const { auditLogsMockData } = require("../../../config/fakeresponse");
        return {
            // dbconnection: jest.fn().mockReturnValue(()=>{db.GetSyncDBConnection()}),
            select: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            first: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            raw: jest.fn().mockReturnThis(),
            then: jest.fn(function (done) {
              done([auditLogsMockData])
            })       
        }
    }
    return fn
})
test('it should get user logs', async () => {
  const mockResp = () => {
    const response = {
      responseCode: 200,
      body: {
        data: [
          {
            userId: 'akshay-admin',
            activity: 'Login',
            description: 'Login',
            page: 'Login Page:',
            timestamp: '2021-03-25 18:37:11',
            ipAddress: '103.209.88.70',
            hostName: '103'
          }
        ]
      }
    };
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    return response;
  };
  const res = mockResp();
  // db.GetSyncDBConnection.mockImplementation(() => Promise.resolve(res));

  const req = { body: { data: { userId: 'akshay-admin' } } };
  // const res = mockResp();
  const result = await auditLog(req, res);
  expect(result.responseCode).toEqual(200);
});

test('should fail when excpetion occurs', async () => {
  const mockResp = () => {
    const response = {
      responseCode: 200,
      body: {
        data: [
          {
            userId: 'akshay-admin',
            activity: 'Login',
            description: 'Login',
            page: 'Login Page:',
            timestamp: '2021-03-25 18:37:11',
            ipAddress: '103.209.88.70',
            hostName: '103'
          }
        ]
      }
    };
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    return response;
  };

  const req = { body: { userId: 'akshay-admin' } };
  const res = mockResp();
  const ErrorMessage = 'exception';
  expect(auditLog(req, res)).rejects.toThrowError(new Error(ErrorMessage));
});
