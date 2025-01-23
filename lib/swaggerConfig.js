<<<<<<< Updated upstream
// lib/swaggerConfig.js
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0", // ระบุ OpenAPI เวอร์ชัน
  info: {
    title: "API Documentation for Next.js", // ชื่อ API
    version: "1.0.0", // เวอร์ชันของ API
    description: "This is the API documentation for my Next.js project.", // คำอธิบาย API
  },
  servers: [
    {
      url: "http://localhost:3000", // เปลี่ยน URL ตามที่ใช้ใน Production
    },
  ],
};




const options = {
    swaggerDefinition,
    apis: ["./src/app/api/**/*.js"], // ต้องครอบคลุมโครงสร้างไฟล์ทั้งหมด
  };
  
  const swaggerSpec = swaggerJsdoc(options);
  
  module.exports = swaggerSpec;
  
=======
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation for Next.js IT-Helpdesk",
    version: "1.0.0",
    description: "This is the API documentation for my Next.js project IT-Helpdesk",
  },
  tags: [
    { name: "Auth", description: "Endpoints related to authentication" },

  ],
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
  paths: {
    "/api/auth/login": {
      post: {
        tags: ["Auth"], // API นี้อยู่ในกลุ่ม Auth
        summary: "Login user",
        description: "API for user login",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful" },
        },
      },
    },
    
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/app/api/**/*.js"], // ครอบคลุมทุก API ที่อยู่ในโฟลเดอร์ api
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
>>>>>>> Stashed changes
