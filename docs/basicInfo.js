module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Api details for tex', // Title of the documentation
    version: '1.0.0', // Version of the app
    description: 'This is the documentation for the TEX APIS' // short description of the app
  },
  servers: [
    {
      url: 'http://tex-dev-api-alb-1067595978.ap-southeast-1.elb.amazonaws.com/tex/v1',
      description: 'Development server'
    }
  ],
  tags: [
    {
      name: 'All apis list' // name of a tag
    }
  ],
  apis: ['../src/api/v1/recoRecommendations/*.js', '../src/api/v1/auth/*.js'],
  security: [{ Bearer: [] }]
};
