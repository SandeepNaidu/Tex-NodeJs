const { GetSyncDBConnection, GetSyncDBDisconnection } = require('../db');
const { successCode, errorCode } = require('../../config/vars');
const { logger } = require('../../utils/logger');

exports.createPortfolioExperiences = (body) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    const {userId, companyName, jobTitle, startDate, endDate, description} = body;
    dbconnection
      .insert({userId, companyName, jobTitle, startDate, endDate, description})
      .into('portfolio_experiences')
      .then((success) => {
        logger.info('Create Portfolio Experiences Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            message: 'Portfolio Experiences has been successfully created'
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Create Portfolio Experiences  Service: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.getPortfolioExperiencesByUserId = (id) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection('portfolio_experiences')
      .select('*')
      .where({ userId: id })
      .then((success) => {
        logger.info('Get PortfolioExperiencesByUserId Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            data: success
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed PortfolioExperiencesByUserId Service: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.deletePortfolioExperiencesById = (id) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
      console.log("Removing PortfolioExperiences");
      dbconnection('portfolio_experiences').del()
      .where({ id: id })
      .then((success) => {
          const response = {
            resultcode: successCode,
            body: {
              message: 'PortfolioExperiences removed!!'
            }
          };
          resolve(response);
        })
        .catch((error) => {
          logger.error('Failed PortfolioExperiences Service: ', error);
          const response = {
            resultcode: errorCode,
            body: {
              data: error
            }
          };
          reject(response);
        })
        .finally(() => {
          GetSyncDBDisconnection(dbconnection);
        });
  });
};


exports.editPortfolioExperiencesById = (id, body) => {
  return new Promise((resolve, reject) => {
    const { companyName, jobTitle, startDate, endDate, description } = body;
    const dbconnection = GetSyncDBConnection();
    dbconnection('portfolio_experiences')
      .update({companyName, jobTitle, startDate, endDate, description})
      .where({ id: id })
      .then((success) => {
        logger.info('Update PortfolioExperiences Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            message: 'PortfolioExperiences has been successfully updated'
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed update PortfolioExperiences Service: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};
