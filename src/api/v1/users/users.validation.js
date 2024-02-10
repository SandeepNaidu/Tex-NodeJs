const joi = require("joi");

exports.user = {
  body: joi.object().keys({
    data:{
      username: joi.string().required(),
      firstName: joi.string().required(),
      lastName: joi.string().required(),
      email: joi.string().required().email(),
      contactNumber: joi.string().required(),
      agencyCode: joi.string().optional(),
      agencyName: joi.string().optional(),
      agencyLimit: joi.number().optional(),
      agencyPIC: joi.string().optional(),
      roleId: joi.number().required(),
      selectedGroups: joi.array().required(),
      selectedPolicies: joi.array().required(),
      parentUserId: joi.number().optional(),
      agencyId: joi.number().optional(),
      reportingManager: joi.string().optional(),
      reportingManagerEmail: joi.string().email().optional(),
      reportingLocation: joi.string(),
      resourceType: joi.string(),
      employeeId: joi.string().optional(),
      loginTime: joi.string().optional(),
      logoutTime: joi.string().optional(),
      isActive: joi.number().optional(),
      isDeleted: joi.string().optional(),
      userDeletedAt: joi.date().timestamp().optional(),
      notes: joi.string().optional(),
      gender: joi.string().optional(),
      age: joi.number().optional(),
      dob: joi.string().optional(),
      agencyInfo: {
        agencyCode: joi.string().optional(),
        agencyName: joi.string().optional(),
        agencyLimit: joi.number().optional(),
        agencyPIC: joi.string().optional(),
        loginTime: joi.string().optional(),
        logoutTime: joi.string().optional()
      }
    },
    auditLog : {
      userId: joi.string(),
      activity: joi.string(),
      description: joi.string(),
      page: joi.string(),
      ipAddress: joi.string(),
      hostName: joi.string(),
    }
  }),
};

exports.editUser = {
  body: joi.object().keys({
    data:{
      id: joi.number().optional(),
      username: joi.string().optional(),
      firstName: joi.string().optional(),
      lastName: joi.string().optional(),
      email: joi.string().optional().email(),
      contactNumber: joi.string().optional(),
      agencyCode: joi.string().optional(),
      agencyName: joi.string().optional(),
      agencyLimit: joi.number().optional(),
      agencyPIC: joi.string().optional(),
      roleId: joi.number().optional(),
      selectedGroups: joi.array().optional(),
      selectedPolicies: joi.array().optional(),
      parentUserId: joi.number().optional(),
      agencyId: joi.number().optional(),
      reportingManager: joi.string().optional(),
      reportingManagerEmail: joi.string().optional().email(),
      reportingLocation: joi.string().optional(),
      resourceType: joi.string().optional(),
      employeeId: joi.string().optional(),
      loginTime: joi.string().optional(),
      logoutTime: joi.string().optional(),
      isActive: joi.number().optional(),
      isDeleted: joi.string().optional(),
      userDeletedAt: joi.date().timestamp().optional(),
      notes: joi.string().optional(),
      gender: joi.string().optional(),
      age: joi.number().optional(),
      dob: joi.string().optional(),
      agencyInfo: {
        id: joi.number().optional(),
        agencyCode: joi.string().optional(),
        agencyName: joi.string().optional(),
        agencyLimit: joi.number().optional(),
        agencyPIC: joi.string().optional(),
        loginTime: joi.string().optional(),
        logoutTime: joi.string().optional()
      }
    },
    auditLog : {
      userId: joi.string(),
      activity: joi.string(),
      description: joi.string(),
      page: joi.string(),
      ipAddress: joi.string(),
      hostName: joi.string(),
    }
  }),
};

exports.editEndUser = {
  body: joi.object().keys({
    data:{
      id: joi.number().optional(),
      username: joi.string().optional(),
      firstName: joi.string().optional(),
      lastName: joi.string().optional(),
      email: joi.string().optional().email(),
      contactNumber: joi.string().optional(),
      agencyCode: joi.string().optional(),
      agencyName: joi.string().optional(),
      agencyLimit: joi.number().optional(),
      agencyPIC: joi.string().optional(),
      roleId: joi.number().optional(),
      selectedGroups: joi.array().optional(),
      selectedPolicies: joi.array().optional(),
      parentUserId: joi.number().optional(),
      agencyId: joi.number().optional(),
      reportingManager: joi.string().optional(),
      reportingManagerEmail: joi.string().optional().email(),
      reportingLocation: joi.string().optional(),
      resourceType: joi.string().optional(),
      employeeId: joi.string().optional(),
      loginTime: joi.string().optional(),
      logoutTime: joi.string().optional(),
      isActive: joi.number().optional(),
      isDeleted: joi.string().optional(),
      userDeletedAt: joi.date().timestamp().optional(),
      notes: joi.string().optional(),
      gender: joi.string().optional(),
      age: joi.number().optional(),
      dob: joi.string().optional(),
      agencyInfo: {
        id: joi.number().optional(),
        agencyCode: joi.string().optional(),
        agencyName: joi.string().optional(),
        agencyLimit: joi.number().optional(),
        agencyPIC: joi.string().optional(),
        loginTime: joi.string().optional(),
        logoutTime: joi.string().optional()
      }
    },
    auditLog : {
      userId: joi.string(),
      activity: joi.string(),
      description: joi.string(),
      page: joi.string(),
      ipAddress: joi.string(),
      hostName: joi.string(),
    }
  }),
};


exports.deleteUser = {
  body: joi.object().keys({
    data:{
    username: joi.string().required(),
    },
    auditLog : {
      userId: joi.string(),
      activity: joi.string(),
      description: joi.string(),
      page: joi.string(),
      ipAddress: joi.string(),
      hostName: joi.string(),
    }
  }),
};
