import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NomNom API",
      version: "1.0.0",
      description: "NomNom Backend API Documentation",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: {
              type: "string",
              description: "User's username",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            password: {
              type: "string",
              format: "password",
              description: "User's password (min 6 characters)",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
            },
            password: {
              type: "string",
              format: "password",
            },
          },
        },
        HealthResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "ok",
            },
            uptime: {
              type: "number",
              description: "Server uptime in seconds",
            },
            timestamp: {
              type: "string",
              format: "date-time",
            },
            db: {
              type: "string",
              enum: ["connected", "disconnected", "connecting", "disconnecting"],
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);
