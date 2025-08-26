#!/bin/bash

# Generate OpenAPI YAML documentation for execute_academy API
# This script provides a convenient way to regenerate the swagger.yml file

set -e

echo "🔧 Generating OpenAPI documentation..."

# Run the openapi command
cargo run -- openapi

echo ""
echo "✅ Documentation generated successfully!"
echo "📄 File: swagger.yml"
echo "🌐 Interactive docs: http://localhost:9098/docs"
echo ""
echo "💡 You can also use: make openapi"
