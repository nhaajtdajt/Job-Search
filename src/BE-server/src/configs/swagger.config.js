const path = require("path");
const environment = require("./environment.config");

module.exports = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Job Search API",
      version: "1.0.0",
      description: `
API documentation for Job Search application.

## Overview
This API provides endpoints for job searching, filtering, and job details retrieval.

## Base URL
- Development: \`http://localhost:${environment.PORT}/api\`

## Response Format
All responses follow this format:
\`\`\`json
{
  "success": true,
  "status": 200,
  "message": "Success message",
  "data": { ... }
}
\`\`\`

## Error Format
\`\`\`json
{
  "success": false,
  "status": 400,
  "message": "Error message",
  "error": null
}
\`\`\`
      `,
      contact: {
        name: "API Support",
        email: "support@jobsearch.com",
      },
      license: {
        name: "ISC",
        url: "https://opensource.org/licenses/ISC",
      },
    },
    servers: [
      {
        url: `http://localhost:${environment.PORT}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token",
        },
      },
    },
  },
  apis: [path.join(__dirname, "../docs/swagger.yml")],
};
