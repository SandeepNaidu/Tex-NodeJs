const express = require('express');
const { validate } = require('express-validation');
const router = express.Router();

const passport = require('passport');
const FacebookStrategy  =     require('passport-facebook').Strategy
// const InstagramStrategy  =     require('passport-instagram').Strategy

const validation = require('./users.validation');
const controller = require('./users.controller');
const { adminModuleAuth, autoLogoutForDCA, agentCreateModuleAuth, agentViewUserListAuth, agencySoftDeleteMiddleware } = require('../../../middlewares/basic-auth');

// Router to get user data based on idToken in headers
router.route('/userDetails').get(controller.getUserData);
// router.route('/').get([adminModuleAuth, autoLogoutForDCA, agentViewUserListAuth], controller.getUserList);

router.route('/').get([adminModuleAuth, autoLogoutForDCA, agentViewUserListAuth], controller.listUsers);

router.route('/getInfo').get(adminModuleAuth, controller.fetchUsers);
// Route for fetching list of users

router.route('/list').get(adminModuleAuth, controller.listUsers);
// Route to get user details based on username
router.route('/:username').get(adminModuleAuth, controller.getUserDetails);

router.route('/getById/:id').get(adminModuleAuth, controller.getUserById);

router.route('/:username/parentUsers').get(adminModuleAuth, controller.fetchParentUsersDetails);

router.route('/').post([adminModuleAuth, validate(validation.user), autoLogoutForDCA, agentCreateModuleAuth], controller.createUser);

router.route('/:username').put([adminModuleAuth, validate(validation.editUser), agentCreateModuleAuth], controller.updateUser);

// Update mobile user
router.route('/enduser/:username').put([validate(validation.editEndUser)], controller.updateEndUser);

router.route('/uploadImage/:id').put(controller.uploadImage);

router.route('/updateProfile/:id').put(controller.updateProfile);

router.route('/markUserisFresher/:id').put(controller.markUserisFresher);

// Route for deleting a user
router.route('/:username').delete(adminModuleAuth, controller.deleteUser);

router.route('/:username/:status').put(adminModuleAuth, controller.setUserStatus);

// Route for checking username availability
router.route('/checkUsernameAvailability').post(adminModuleAuth, controller.checkUsernameAvailability);

// Route for checking email availability
router.route('/checkEmailAvailability').post(adminModuleAuth, controller.checkEmailAvailability);

// User Migration API
// router.route('/userMigration').post(controller.userMigration);

// Route for updating a user
router.route('/delete').post([adminModuleAuth, validate(validation.deleteUser)], controller.softDeleteUser);

router.route('/downloadUserList').post(adminModuleAuth, controller.downloadUserList);

router.route('/delete').post([adminModuleAuth, validate(validation.deleteUser), agencySoftDeleteMiddleware], controller.softDeleteUser);

router.route('/usernameList').post(adminModuleAuth, controller.usernameList);

router.route('/:username/:mode').put(adminModuleAuth, controller.isAuthorizedUser); // to be removed later after successful testing

router.route('/register').post(controller.registerUser);

router.route('/isUsernameAvailable').post(controller.checkUsernameAvailability);

// Route for checking email availability
router.route('/isEmailAvailable').post(controller.checkEmailAvailability);


router.route('/profile/like').post(adminModuleAuth, controller.profileLike);
router.route('/profile/share').post(adminModuleAuth, controller.profileShare);
router.route('/profile/save').post(adminModuleAuth, controller.profileSave);
router.route('/profile/view').post(adminModuleAuth, controller.profileView);
router.route('/profile/count/artist/:id/by/:userId').get(adminModuleAuth, controller.profileCounts);

passport.use(new FacebookStrategy({
    clientID: '1139240000307469',
    clientSecret:'c8e3f37fc43136f38e3492e6bef9ca4f' ,
    callbackURL: 'http://localhost:4200/auth/facebook/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      // if(config.use_database) {
      //   // if sets to true
      //   pool.query("SELECT * from user_info where user_id="+profile.id, (err,rows) => {
      //     if(err) throw err;
      //     if(rows && rows.length === 0) {
      //         console.log("There is no such user, adding now");
      //       //   pool.query("INSERT into user_info(user_id,user_name) VALUES('"+profile.id+"','"+profile.username+"')");
      //     } else {
      //         console.log("User already exists in database");
      //     }
      //   });
      // }
      console.log("profile...........: "+profile)
      return done(null, profile);
    // });
  }
));


router.route('/auth/facebook').get(passport.authenticate('facebook',{scope:'email'}));


router.route('/auth/facebook/callback').get(
  passport.authenticate('facebook', { successRedirect : '/profile', failureRedirect: '/failed' })
  // ,function(req, res) {
  //   res.redirect('/');
  // }
  );


  router.get('/profile', (req, res) =>{
      res.send("You are a vaild user")
  });

  router.get('/failed', (req, res) =>{
      res.send("You are a non vaild user")
  });

//   passport.use(new InstagramStrategy({
//     clientID: "54tyhk",
//     clientSecret: "fghjkl",
//     callbackURL: "http://127.0.0.1:4200/auth/instagram/callback"
//   },
//   function(accessToken, refreshToken, profile, done) {
//     User.findOrCreate({ instagramId: profile.id }, function (err, user) {
//       return done(err, user);
//     });
//   }
// ));

// app.get('/auth/instagram',
//   passport.authenticate('instagram'));

// app.get('/auth/instagram/callback',
//   passport.authenticate('instagram', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });



module.exports = router;
