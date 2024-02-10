const { GetSyncDBConnection, GetSyncDBDisconnection } = require('../db');
const { successCode, errorCode } = require('../../config/vars');
const { logger } = require('../../utils/logger');

// `id` INT NOT NULL AUTO_INCREMENT,
//   `title` VARCHAR(255) NULL,
//   `userId` INT NULL,
//   `artistId` INT NULL,
//   `description` VARCHAR(255) NULL,
//   `imageUrl` VARCHAR(255) NULL,
//   `thumbUrl` VARCHAR(255) NULL,
//   `videoUrl` VARCHAR(255) NULL,
//   `portfolioType` VARCHAR(255) NULL,

exports.createPortfolio = (body) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .insert(body)
      .into('portfolio')
      .then((success) => {
        logger.info('Create Portfolio Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            message: 'Portfolio has been successfully created'
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Create Portfolio  Service: ', error);
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

exports.getPortfoliosByUserImagesId = (id) =>{
    return new Promise((resolve, reject) => {
        const dbconnection = GetSyncDBConnection();
        dbconnection('portfolio')
          .select('imageUrl')
          .where({ userId: id })
          .then((success) => {
            logger.info('Get getPortfoliosByUserImagesId Service Response:', success);
            const response = {
              resultcode: successCode,
              body: {
                data: success
              }
            };
            resolve(response);
          })
          .catch((error) => {
            logger.error('Failed getPortfoliosByUserImagesId Service: ', error);
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
}

exports.getPortfoliosByUserId = (id) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection('portfolio')
      .select('*')
      .where({ userId: id })
      .then((success) => {
        logger.info('Get PortfolioByUserId Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            data: success
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed PortfolioByUserId Service: ', error);
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

exports.deletePortfoliosById = (id) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
      dbconnection('portfolio').del()
      .where({ id: id })
      .then((success) => {
          const response = {
            resultcode: successCode,
            body: {
              message: 'Portfolio removed!!'
            }
          };
          resolve(response);
        })
        .catch((error) => {
          logger.error('Failed Portfolio Service: ', error);
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


exports.editPortfoliosById = (id, body) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection('portfolio')
      .update(body)
      .where({ id: id })
      .then((success) => {
        logger.info('Update Portfolio Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            message: 'Portfolio has been successfully updated'
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed update Portfolio Service: ', error);
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
