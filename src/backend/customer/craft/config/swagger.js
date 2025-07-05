const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Craft - Customer App API',
      version: '1.0.0',
      description: 'API documentation for the Customer App backend',
    },
    servers: [
      {
        url: 'http://localhost:4006/api',
        description: 'Local server',
      },
    ],
  },
  apis: [       
        './src/backend/customer/craft/routes/auth/*.js',
        './src/backend/customer/craft/routes/inventory/*.js',
        './src/backend/customer/craft/routes/order/*.js',
        './src/backend/customer/craft/routes/*.js',
        './src/backend/customer/craft/routes/user/*.js',
        './src/backend/customer/craft/routes/product/*.js',
      ], 
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
