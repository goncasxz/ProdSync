import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "ProdSync API",
    version: "1.0.0",
    description: "Documentação da API do ProdSync",
  },
  servers: [
    {
      url: "http://localhost:8080",
    },
    {
      url: "https://prodsync.onrender.com",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    "./src/controllers/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
export default swaggerUi;
