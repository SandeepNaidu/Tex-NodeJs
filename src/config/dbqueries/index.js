const { accountInfoQuery, accountInfoDCAQuery, accountDetailsDCAQuery, accountInfoWinleadQuery, accountDetailsWinleadQuery, winleadAccountSearchSummaryQuery, lastPaymentDetailsQuery, AccountBillStatusCollectionStateQuery } = require('./accountQuery');
const { interactionInfoQuery, interactionInfoWinleadQuery, interactionInfoDcaQuery } = require('./interactionQuery');
const { disconnectReconnectHistoryQuery } = require('./disconnectReconnectHistory');
const { paymentInfoDCAQuery, paymentInfoQuery } = require('./paymentQuery');
const { financialInfoQuery, dcaFinancialInfoQuery } = require('./financialInfoQuery');
const { billingInfoDCAQuery, billingInfoWinleadQuery, billingDetailsWinleadQuery } = require('./billingInfoQuery');
const { collectionInfoDCAQuery, collectionInfoWinleadQuery } = require('./collectionInfoQuery');
const { subDemoDCAQuery, subDemoQuery, primarySubscriptionQuery, subscriptionBouquetQuery, provideDateSubscriptionQuery, rgDateSubscriptionQuery, getApIdBySmcNumberQuery, winleadSubscriptionInfoQuery, DCASubscriptionDetailsQuery, winleadSubscriptionDetailsQuery, DCAArpuBTAtQueryActive, DCAArpuBTAtQueryNotActive, winleadArpuBTAtQueryActive, winleadArpuBTAtQueryNotActive, DCABroadBandDetails, winleadBroadBandDetails, DCADmtDetails, winleadDmtDetails } = require('./subscriptionQueries');
const { fetchChildRolesQuery, getfetchRolesQuery, getSuperAdminRole, fetchParentRolesQuery, getUserInfoQuery } = require('./rolesQuery');
module.exports = {
  accountInfoQuery,
  accountInfoDCAQuery,
  accountDetailsDCAQuery,
  accountInfoWinleadQuery,
  accountDetailsWinleadQuery,
  interactionInfoQuery,
  interactionInfoWinleadQuery,
  interactionInfoDcaQuery,
  disconnectReconnectHistoryQuery,
  paymentInfoDCAQuery,
  paymentInfoQuery,
  financialInfoQuery,
  dcaFinancialInfoQuery,
  billingInfoDCAQuery,
  billingInfoWinleadQuery,
  collectionInfoDCAQuery,
  collectionInfoWinleadQuery,
  billingDetailsWinleadQuery,
  winleadAccountSearchSummaryQuery,
  lastPaymentDetailsQuery,
  subDemoDCAQuery,
  subDemoQuery,
  primarySubscriptionQuery,
  subscriptionBouquetQuery,
  provideDateSubscriptionQuery,
  rgDateSubscriptionQuery,
  getApIdBySmcNumberQuery,
  winleadSubscriptionInfoQuery,
  DCASubscriptionDetailsQuery,
  winleadSubscriptionDetailsQuery,
  DCAArpuBTAtQueryActive,
  DCAArpuBTAtQueryNotActive,
  winleadArpuBTAtQueryActive,
  winleadArpuBTAtQueryNotActive,
  DCABroadBandDetails,
  winleadBroadBandDetails,
  DCADmtDetails,
  winleadDmtDetails,
  AccountBillStatusCollectionStateQuery,
  fetchChildRolesQuery,
  getfetchRolesQuery,
  getSuperAdminRole,
  fetchParentRolesQuery,
  getUserInfoQuery
};
