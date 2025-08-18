package swagger

import (
	_ "embed"
	"net/http"

	"execute_academy/internal/interfaces/http/middleware"
)

//go:embed spec/openapi.json
var openapiSpec []byte

// ServeOpenAPI serves the embedded OpenAPI JSON specification
func ServeOpenAPI(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(openapiSpec)
}

// ServeSwaggerUI serves a minimal Swagger UI page that loads the OpenAPI spec from /api/openapi.json
func ServeSwaggerUI(w http.ResponseWriter, r *http.Request) {
	const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style> body { margin: 0; padding: 0; } #swagger-ui { box-sizing: border-box; } </style>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" href="data:,">
  </head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js" crossorigin="anonymous"></script>
  <script>
    window.onload = () => {
      try {
        window.ui = SwaggerUIBundle({
          url: '/api/openapi.json',
          dom_id: '#swagger-ui',
          deepLinking: true,
          docExpansion: 'list',
          tagsSorter: 'alpha',
          operationsSorter: 'alpha',
          filter: true,
          presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
          layout: 'StandaloneLayout'
        });
      } catch (e) {
        document.getElementById('swagger-ui').innerText = 'Failed to load Swagger UI: ' + e;
      }
    };
  </script>
</body>
</html>`

	// Override strict CSP from global middleware to allow loading Swagger UI from unpkg
	w.Header().Set("Content-Security-Policy", "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://unpkg.com; script-src 'self' 'unsafe-inline' https://unpkg.com")
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(html))
}

// Register mounts the swagger UI and openapi endpoints using the global middleware manager
func Register(mux *http.ServeMux, manager *middleware.Manager) {
	mux.Handle("GET /api/docs", http.HandlerFunc(ServeSwaggerUI))
	mux.Handle("GET /api/openapi.json", http.HandlerFunc(ServeOpenAPI))
}
