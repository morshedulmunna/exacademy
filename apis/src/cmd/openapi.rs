use std::fs;
use utoipa::OpenApi;

/// Generate OpenAPI YAML documentation file.
///
/// Creates a swagger.yml file in the project root with the complete API specification.
pub fn openapi_command() -> Result<(), Box<dyn std::error::Error>> {
    // Import the OpenAPI document
    let openapi = crate::interfaces::http::swagger::ApiDoc::openapi();

    // Convert to YAML
    let yaml = serde_yaml::to_string(&openapi)?;

    // Write to file
    let output_path = "openapi.yml";
    fs::write(output_path, yaml)?;

    println!("✅ OpenAPI documentation generated successfully!");
    println!("📄 File: {}", output_path);
    println!("🌐 You can also view the interactive docs at: http://localhost:9098/docs");

    Ok(())
}
