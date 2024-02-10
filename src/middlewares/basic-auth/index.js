const {
  basicAuthMiddleware,
  // validateBasicAuthMiddleware,
  humanCheck,
  adminModuleAuth,
  autoLogoutForDCA,
  agentCreateModuleAuth,
  agentViewUserListAuth,
  agencySoftDeleteMiddleware
} = require("./basic-auth.middleware");

module.exports = {
  basicAuthMiddleware,
  // validateBasicAuthMiddleware,
  humanCheck,
  adminModuleAuth,
  autoLogoutForDCA,
  agentCreateModuleAuth,
  agentViewUserListAuth,
  agencySoftDeleteMiddleware
};
