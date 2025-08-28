openapi-generator-cli generate \
  -i ./public/openapi.yml \
  -g typescript-fetch \
  -o src/open-api-generate \
  --additional-properties=supportsES6=true,typescriptThreePlus=true,modelPropertyNaming=original,parameterNaming=original