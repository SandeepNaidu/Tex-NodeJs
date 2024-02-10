
const { getAuditLogs } = require('./audit-logs.service');
const {
  auditLog,
  addAuditLog
} = require('./auditLog.service');

const {
  getComponents,
  createComponent,
  editComponent,
  updateComponentStatus,
  getComponentsById
} = require('./components.service');

const {
  getRoles,
  getAdminRoles,
  getSubRoles,
  createRoles,
  updateRoleStatus,
  editRoles,
  fetchSubRoles,
  fetchRoles,
  createRole,
  updateRoles,
  fetchParentRoles
} = require('./roles.service');

const {
  getGroups,
  getAdminGroups,
  getGroupsAndPolicies,
  createGroup,
  updateGroupStatus,
  editGroup,
  getGroupsFromRole
} = require('./groups.service');

const {
  getPolicies,
  getGroupPolicies,
  getPoliciesAndComponents,
  createPolicy,
  editPolicy,
  updatePolicyStatus,
  getPoliciesFromGroup
} = require('./policies.service');

const {
  getUser,
  getUserGroupIds,
  getUserPolicyIds,
  fetchUserDetails,
  updateUser,
  deleteUser,
  dcaDisableGroupUser,
  checkUsernameAvailability,
  checkEmailAvailability,
  getParentUserId,
  softDeleteUser,
  softDeletedDcaUser,
  login,
  getUserList,
  forgetPassword,
  confirmForgotPassword,
  getDcaList,
  getDcaAdminList,
  getRoleType,
  userLists,
  collectPassword,
  createUser,
  editUser,
  fetchUser,
  getAllUsers,
  getUserById,
  updateProfile,
  fetchParentUsersDetails,
  setUserStatus,
  listUsers,
  isAuthorizedUser,
  changePassword,
  adminResetPassword,
  signOut,
  markUserisFresher,
  editUserById,
  uploadImage,
  registerUser,
  editEndUser,
  isAuthorizedEndUser,
  profileShare,
  profileLike,
  profileSave,
  profileView,
  profileCount
} = require('./user.service');

const {
  getAlerts,
  createAlert,
  editAlert,
  deleteAlert,
  getActiveAlerts
} = require('./alerts.service');

const { getPolicyListByGroup,
  getUserPolicies,
  checkUserHaveDataMaskingPolicy,
  getUserComponents,
  isComponentPresent
} = require('./data-masking.service');

const { fetchUserTypes } = require('./userTypes.service');

const {
  createTag,
  getTagsById,
  getTagsByName,
  getAllTags,
  deleteTagsById,
  editTagsById
} = require('./tags.service');

const {
  createAvid,
  getAvidsById,
  getAvidsByArtistId,
  getAllAvids,
  avidShare,
  avidLike,
  avidSave,
  editAvidById
} = require('./avids.service');

const {
  createPost,
  postSave,
  postLike,
  postShare,
  postReport,
  postVote,
  getPostsByArtistId,
  getAllPosts
} = require('./posts.service');

const {
  createPostImage
} = require('./postImages.service');

const {
  createPostVideo
} = require('./postVideos.service');

const {
  createPostDocument
} = require('./postDocuments.service');

const {
  createPostAudio
} = require('./postAudios.service');

const {
  createPostEvent
} = require('./postEvents.service');

const {
  createPostPoll
} = require('./postPolls.service');

const {
  createPostV2,
  getAllPostsV2,
  getAllByArtistId,
  getAllPostsDefault,
  getAllOptions,
  voteOption,
  getAllVotingResults,
  likeAPost,
  shareAPost,
  saveAPost,
  reportAPost,
  getPostById,
  unlikeAPost,
  unshareAPost,
  unsaveAPost,
  unreportAPost,
  postReaction
} = require('./postsv2.service');

const {
  createPortfolio,
  getPortfoliosByUserId,
  deletePortfoliosById,
  getPortfoliosByUserImagesId,
  editPortfoliosById
} = require('./portfolio.service');

const {
createPortfolioExperiences,
getPortfolioExperiencesByUserId,
deletePortfolioExperiencesById,
editPortfolioExperiencesById
} = require('./portfolioExperiences.service');

module.exports = {
  likeAPost,
  shareAPost,
  saveAPost,
  reportAPost,
  unlikeAPost,
  unshareAPost,
  unsaveAPost,
  getPostById,
  unreportAPost,
  getAllByArtistId,
  markUserisFresher,
  editUserById,
  getAllUsers,
  getUserById,
  uploadImage,
  createPortfolio,
  getPortfoliosByUserId,
  deletePortfoliosById,
  getPortfoliosByUserImagesId,
  editPortfoliosById,
  collectPassword,
  login,
  softDeletedDcaUser,
  softDeleteUser,
  getAllVotingResults,
  getRoles,
  voteOption,
  getAllOptions,
  createComponent,
  getComponents,
  createPolicy,
  getPolicies,
  createGroup,
  getGroups,
  createRoles,
  getGroupsFromRole,
  getPoliciesFromGroup,
  fetchUserDetails,
  getGroupPolicies,
  getAdminRoles,
  getSubRoles,
  getAdminGroups,
  updateRoleStatus,
  updateGroupStatus,
  editRoles,
  editGroup,
  editPolicy,
  getPoliciesAndComponents,
  getGroupsAndPolicies,
  updatePolicyStatus,
  getUser,
  getUserGroupIds,
  getUserPolicyIds,
  updateUser,
  deleteUser,
  checkUsernameAvailability,
  checkEmailAvailability,
  auditLog,
  getAuditLogs,
  getAlerts,
  createAlert,
  editAlert,
  deleteAlert,
  getActiveAlerts,
  getPolicyListByGroup,
  getUserPolicies,
  checkUserHaveDataMaskingPolicy,
  getUserComponents,
  isComponentPresent,
  getParentUserId,
  userLists,
  getUserList,
  forgetPassword,
  confirmForgotPassword,
  getDcaList,
  getDcaAdminList,
  addAuditLog,
  getRoleType,
  dcaDisableGroupUser,
  fetchSubRoles,
  fetchRoles,
  fetchUserTypes,
  updateProfile,
  createUser,
  createRole,
  editUser,
  fetchUser,
  fetchParentRoles,
  fetchParentUsersDetails,
  updateRoles,
  setUserStatus,
  listUsers,
  isAuthorizedUser,
  changePassword,
  adminResetPassword,
  signOut,
  registerUser,
  editEndUser,
  isAuthorizedEndUser,
  createTag,
  getTagsById,
  getTagsByName,
  getAllTags,
  deleteTagsById,
  editTagsById,
  createAvid,
  getAvidsById,
  getAvidsByArtistId,
  getAllAvids,
  avidShare,
  avidLike,
  avidSave,
  editAvidById,
  createPost,
  createPostImage,
  createPostVideo,
  createPostDocument,
  createPostAudio,
  createPostEvent,
  createPostPoll,
  postSave,
  postLike,
  postShare,
  postReport,
  postVote,
  getPostsByArtistId,
  getAllPosts,
  getAllPostsV2,
  createPostV2,
  getAllPostsDefault,
  createPortfolioExperiences,
  getPortfolioExperiencesByUserId,
  deletePortfolioExperiencesById,
  editPortfolioExperiencesById,
  profileShare,
  profileLike,
  profileSave,
  profileView,
  profileCount,
  postReaction
};
