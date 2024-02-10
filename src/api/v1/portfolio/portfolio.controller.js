const httpStatus = require('http-status');
// const { successCode } = require('../../../config/vars');
const { Response, ErrorResponse } = require('../../../utils/response');
const { logger } = require('../../../utils/logger');
const tex = require('../../../services/tex');
const { errorMessage } = require('../../../utils/common');

exports.createExperiences = async (req, res) => {
  try {
    logger.info('Create portfolioExperiences Controller Request:', req.body.data);
    const experience = await tex.createPortfolioExperiences(req.body.data);
    const jsonResponse = Response(httpStatus.OK, { experience });
    logger.info('Create portfolioExperiences Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed portfolioExperiences: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.getExperiencesByUserId = async (req, res) => {
  try {
    logger.info('Get portfolioExperiences ByuserId Controller Request:', req.params.id);
    const experiences = await tex.getPortfolioExperiencesByUserId(req.params.id);
    const jsonResponse = Response(httpStatus.OK, {
      experiences: experiences.body.data
    });
    logger.info('Get portfolioExperiences Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed portfolioExperiences: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.deleteExperiencesById = async (req, res) => {
  try {
    logger.info('Delete portfolioExperiences ById Controller Request:', req.params.id);
    const experiences = await tex.deletePortfolioExperiencesById(req.params.id);
    const jsonResponse = Response(httpStatus.OK, {
      experiences: experiences.body.data
    });
    logger.info('Delete portfolioExperiences Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed portfolioExperiences: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.editExperiencesById = async (req, res) => {
  try {
    logger.info(
      'Edit editExperiencesById Controller Request:',
      req.params.id,
      req.body.data
    );
    const experiences = await tex.editPortfolioExperiencesById(req.params.id, req.body.data);
    const jsonResponse = Response(httpStatus.OK, { experiences });
    logger.info('Edit editExperiencesById Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed editExperiencesById: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.createPortfolio = async (req, res) => {
  try {
    logger.info('Create createPortfolio Controller Request:', req.body);
    const experience = await tex.createPortfolio(req.body);
    const jsonResponse = Response(httpStatus.OK, { experience });
    logger.info('Create createPortfolio Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    console.log(exception)
    logger.error('Failed createPortfolio: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.getPortfoliosByUserId = async (req, res) => {
  try {
    logger.info('Get getPortfoliosByUserId ByuserId Controller Request:', req.params.id);
    const experiences = await tex.getPortfoliosByUserId(req.params.id);
    const jsonResponse = Response(httpStatus.OK, {
      portfolios: experiences.body
    });
    logger.info('Get getPortfoliosByUserId Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed getPortfoliosByUserId: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};
exports.getPortfoliosByUserImagesId = async (req,res) =>{
  try {
    logger.info('Get getPortfoliosByUserImagesId ByuserId Controller Request:', req.params.id);
    const experiences = await tex.getPortfoliosByUserImagesId(req.params.id);
    const jsonResponse = Response(httpStatus.OK, {
      portfolios: experiences.body
    });
    logger.info('Get getPortfoliosByUserImagesId Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed getPortfoliosByUserImagesId: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
}

exports.deletePortfoliosById = async (req, res) => {
  try {
    logger.info('Delete deletePortfoliosById ById Controller Request:', req.params.id);
    const experiences = await tex.deletePortfoliosById(req.params.id);
    const jsonResponse = Response(httpStatus.OK, {
      portfolios: experiences.body
    });
    logger.info('Delete deletePortfoliosById Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed deletePortfoliosById: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.editPortfoliosById = async (req, res) => {
  try {
    logger.info(
      'Edit editPortfoliosById Controller Request:',
      req.params.id,
      req.body
    );
    const experiences = await tex.editPortfoliosById(req.params.id, req.body);
    const jsonResponse = Response(httpStatus.OK, { experiences });
    logger.info('Edit editPortfoliosById Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed editPortfoliosById: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};
