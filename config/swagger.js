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
            role: {
              type: "string",
              enum: ["customer", "seller"],
              description: "User role",
              default: "customer",
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
        Store: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            userId: {
              type: "string",
            },
            name: {
              type: "string",
            },
            address: {
              type: "string",
            },
            latitude: {
              type: "number",
            },
            longitude: {
              type: "number",
            },
            openHours: {
              type: "string",
            },
          },
        },
        Category: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            name: {
              type: "string",
            },
          },
        },
        DietFilter: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            name: {
              type: "string",
            },
          },
        },
        Food: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            storeId: {
              type: "string",
            },
            categoryId: {
              type: "string",
            },
            name: {
              type: "string",
            },
            description: {
              type: "string",
            },
            price: {
              type: "number",
            },
            isAvailable: {
              type: "boolean",
            },
            images: {
              type: "array",
              items: {
                type: "string",
              },
            },
            filters: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
        },
        Coupon: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            code: {
              type: "string",
            },
            discountPercentage: {
              type: "number",
            },
            maxDiscountAmount: {
              type: "number",
            },
            expiresAt: {
              type: "string",
              format: "date-time",
            },
            usageLimit: {
              type: "number",
            },
            usedCount: {
              type: "number",
            },
            minimumOrder: {
              type: "number",
            },
          },
        },
        Order: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            customerId: {
              type: "string",
            },
            storeId: {
              type: "string",
            },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  foodId: {
                    type: "string",
                  },
                  quantity: {
                    type: "number",
                  },
                  priceEach: {
                    type: "number",
                  },
                  subtotal: {
                    type: "number",
                  },
                },
              },
            },
            totalPrice: {
              type: "number",
            },
            couponId: {
              type: "string",
            },
            finalPrice: {
              type: "number",
            },
            status: {
              type: "string",
              enum: ["pending", "paid", "cancelled", "completed"],
            },
          },
        },
        Review: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            orderId: {
              type: "string",
            },
            foodId: {
              type: "string",
            },
            customerId: {
              type: "string",
            },
            rating: {
              type: "number",
              minimum: 1,
              maximum: 5,
            },
            comment: {
              type: "string",
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
            message: {
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
