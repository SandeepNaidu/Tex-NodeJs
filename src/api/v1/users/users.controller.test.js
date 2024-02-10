const {  listUsers,createUser, getUserDetails, updateUser, deleteUser, checkEmailAvailability, checkUsernameAvailability, getUserData, softDeleteUser, downloadUserList, usernameList } = require('./users.controller');
const { mockRequest, mockResponse } = require("../../../utils/Interceptor")
const tex = require("../../../services/tex")
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
jest.mock("knex", () => {
    const fn = () => {
      return {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        raw: jest.fn().mockReturnThis(),
        then: jest.fn(function (done) {
          done({
            data: {
                Users:[
                      {username: "test",
                       firstName: "Test",
                        lastName: "User",
                         email:'sdas@gmail.com',
                         contactNumber:'567890',
                         roleId:'4',
                         status:'confirmed',
                         enabled: true,
                         notes:'fsdfsdfdsfsdf'
                      
                      }
                ],
                PaginationToken:'adsdasddfxghjkhg'
            },
          });
        }),
      };
    };
    return fn;
  });

test('it should get list of users', async () => {
    const mockResp = () => {
        const response = {
          responseCode: 200,
          data: {
              Users:[
                    {username: "test",
                     firstName: "Test",
                      lastName: "User",
                       email:'sdas@gmail.com',
                       contactNumber:'567890',
                       roleId:'4',
                       status:'confirmed',
                       enabled: true,
                       notes:'fsdfsdfdsfsdf'
                    
                    }
              ],
              PaginationToken:'adsdasddfxghjkhg'
          },
        };
        response.status = jest.fn().mockReturnValue(response);
        response.json = jest.fn().mockReturnValue(response);
        return response;
      };
    let req = mockRequest();
    req.query = {
        field:'',
        value:'',
        roleId:'4'
    };
    let res = mockResp();
        tex.listUsers = jest.fn()
        tex.listUsers.mockResolvedValue([{username: "test", firstName: "Test", lastName: "User"}])
        await listUsers(req, res)
        expect(res.json).toHaveBeenCalledWith(
            { 
                responseCode: 500, 
                body: 
                    {
                        errors: [
                            {debugDescription: undefined, errorCode: 500, errorMessage: "A generic error occurred on the server ",errorUIMessage:"A generic error occurred on the server "}
                        ] 
                    }
            }
        )
        expect(res.status).toHaveBeenCalledWith(500);
})


test('it should throw an error if user data is not present', async () => {
    let req = mockRequest();
    req.body = {}
    let res = mockResponse();

    tex.createUser = jest.fn()
    tex.createUser.mockRejectedValue({ body: { errors: [{errorMessage: "Cannot create user"}]}})
    await createUser(req, res)
    expect(res.status).toHaveBeenCalledWith(500);
})

test('it should get user details', async () => {
    let req = mockRequest();
    req.params.username = 'test';
    let res = mockResponse();

    tex.getUser = jest.fn()
    tex.getUserGroupIds = jest.fn()
    tex.getUserPolicyIds = jest.fn()
    tex.getUser.mockResolvedValue({id: 1, username: "test", firstName: "Test", lastName: "User"})
    tex.getUserGroupIds.mockResolvedValue([1, 2])
    tex.getUserPolicyIds.mockResolvedValue([2,3,5])
    await getUserDetails(req, res)
    expect(res.json).toHaveBeenCalledWith(
        { 
            responseCode: 200, 
            body: 
                {
                    groupIds: [1,2],
                    policyIds: [2,3,5]
                }
        }
    )
    expect(res.status).toHaveBeenCalledWith(200);
})

test('it should throw an error if user params is not present', async () => {
    let req = mockRequest();
    req.params.username = null
    let res = mockResponse();

    tex.getUser = jest.fn()
    tex.getUserGroupIds = jest.fn()
    tex.getUserPolicyIds = jest.fn()
    tex.getUser.mockRejectedValue({ body: { data: {error: "Cannot fetch user details"}}})
    await getUserDetails(req, res)
    expect(res.status).toHaveBeenCalledWith(500);
})

test('it should throw an error if user updated data is not present', async () => {
    let req = mockRequest();
    req.body = {}
    let res = mockResponse();

    tex.updateUser = jest.fn()
    tex.updateUser.mockRejectedValue({ body: { errors: [{errorMessage: "Cannot update user"}]}})
    await updateUser(req, res)
    expect(res.status).toHaveBeenCalledWith(500);
})


test('it should fail to enable disable user', async () => {
    let req = mockRequest();
    req.params.username = null
    let res = mockResponse();
       res.locals = {roleType :""}
    tex.deleteUser = jest.fn()
    tex.deleteUser.mockRejectedValue({ body: { errors: [{errorMessage: "Cannot enable disbale user"}]}})
    await deleteUser(req, res)
    expect(res.status).toHaveBeenCalledWith(500);
})

test('it should check for username availability', async () => {
    let req = mockRequest();
    req.body = {data:{username:'test'},
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

    tex.checkUsernameAvailability = jest.fn()
    tex.checkUsernameAvailability.mockResolvedValue({ body: { isAvailable: true }})
    await checkUsernameAvailability(req, res)
    expect(res.json).toHaveBeenCalledWith(
        { 
            responseCode: 200, 
            body: { isAvailable: { body: { isAvailable: true } } }
        }
    )
    expect(res.status).toHaveBeenCalledWith(200);
})

test('it should fail to check username availability', async () => {
    let req = mockRequest();
    req.body.username = null
    let res = mockResponse();

    tex.checkUsernameAvailability = jest.fn()
    tex.checkUsernameAvailability.mockRejectedValue({ body: { errors: [{errorMessage: "Cannot check username availability"}]}})
    await checkUsernameAvailability(req, res)
    expect(res.status).toHaveBeenCalledWith(500);
})

test('it should check for email availability', async () => {
    let req = mockRequest();
    req.body = {data:{email:'test@test.com'},
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

    tex.checkEmailAvailability = jest.fn()
    tex.checkEmailAvailability.mockResolvedValue({ body: { isAvailable: true }})
    await checkEmailAvailability(req, res)
    expect(res.json).toHaveBeenCalledWith(
        { 
            responseCode: 200, 
            body: { isAvailable: { body: { isAvailable: true } } }
        }
    )
    expect(res.status).toHaveBeenCalledWith(200);
})

test('it should fail to check email availability', async () => {
    let req = mockRequest();
    req.body.email = null
    let res = mockResponse();

    tex.checkEmailAvailability = jest.fn()
    tex.checkEmailAvailability.mockRejectedValue({ body: { errors: [{errorMessage: "Cannot check email availability"}]}})
    await checkEmailAvailability(req, res)
    expect(res.status).toHaveBeenCalledWith(500);
})

test('it should fail to get User Data ', async () => {
    let req = mockRequest();
    let res = mockResponse();

    tex.fetchUserDetails = jest.fn()
    tex.fetchUserDetails.mockRejectedValue({ body: { errors: [{errorMessage: "Cannot get User Data"}]}})
    await getUserData (req, res)
    expect(res.status).toHaveBeenCalledWith(500);
})

test('it should fail to soft Delete User', async () => {
    let req = mockRequest();
    req.body.username = null
    let res = mockResponse();

    tex.getRoleType = jest.fn()
    tex.getRoleType.mockRejectedValue({ body: { errors: [{errorMessage: "Cannot get role type"}]}})
    tex.softDeleteUser = jest.fn()
    tex.softDeleteUser.mockRejectedValue({ body: { errors: [{errorMessage: "Cannot soft Delete User"}]}})
    await softDeleteUser (req, res)
    expect(res.status).toHaveBeenCalledWith(500);
})

test('it should fail to download User List', async () => {
    let req = mockRequest();
    req.query = null
    let res = mockResponse();

    tex.userLists = jest.fn()
    tex.userLists.mockRejectedValue({ body: { errors: [{errorMessage: "Cannot download User List"}]}})
    await downloadUserList (req, res)
    expect(res.status).toHaveBeenCalledWith(500);
})

test('it should fail to download User List', async () => {
    let req = mockRequest();
    req.body.username = null
    let res = mockResponse();

    tex.userLists = jest.fn()
    tex.userLists.mockRejectedValue({ body: { errors: [{errorMessage: "Cannot download User List"}]}})
    await usernameList (req, res)
    expect(res.status).toHaveBeenCalledWith(500);
})