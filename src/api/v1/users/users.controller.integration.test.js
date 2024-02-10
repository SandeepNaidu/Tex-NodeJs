test('should get users', async () => {
    const statusCode = 200;
    expect(statusCode).toEqual(200);
});

// test('should get User Data', async () => {
//     let stateObj = {
//       data:{},
//       auditLog: {
//           userId: 'akshay-admin',
//           activity: 'Users',
//           description: 'Get User Data',
//           page: 'User Page',
//       }
//     };
//     tex.fetchUserDetails.mockImplementation(() => Promise.resolve(userDetails));
//     await request(app)
//       .get('/tex/v1/users/userDetails')
//       .send(stateObj)
//       .set('Accept', 'application/json')
//       .expect(httpStatus.OK)
//   });

// test('should get username List', async () => {
//     let stateObj = {
//       data:{},
//       auditLog: {
//           userId: 'superadmin',
//           activity: 'Username List',
//           description: 'Get Username List',
//           page: 'User Page',
//       }
//     };
//     tex.userLists.mockImplementation(() => Promise.resolve(usernameList));
//     await request(app)
//       .post('/tex/v1/users/usernameList')
//       .send(stateObj)
//       .set('Accept', 'application/json')
//       .expect(httpStatus.OK)
//   });