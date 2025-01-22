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
  
