const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('./index');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FilmZ API',
      version: '1.0.0',
      description: 'API documentation for the FilmZ movie booking backend',
    },
    servers: [
      {
        url: `http://localhost:${config.server.port}`,
        description: config.env === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // This tells swagger-jsdoc to scan your route files for JSDoc comments
  apis: ['./routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
