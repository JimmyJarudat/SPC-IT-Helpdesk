import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../../../../lib/swaggerConfig";

export async function GET(req) {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Swagger API Documentation</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui.css">
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui-bundle.js"></script>
          <script>
            window.onload = () => {
              SwaggerUIBundle({
                spec: ${JSON.stringify(swaggerSpec)},
                dom_id: "#swagger-ui",
              });
            };
          </script>
        </body>
      </html>
    `;
    return new Response(html, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
}
