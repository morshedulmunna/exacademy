########## Makefile for the Rust API crate ##########
# Usage examples:
#  make dev               # hot-reload server (requires cargo-watch)
#  make run               # run default command (apis)
#  make run CMD=cli       # run with a specific subcommand
#  make graphql           # run GraphQL server on port 9098
#  make dev-graphql       # hot-reload GraphQL server
#  make test              # run tests
#  make fmt               # format code
#  make clippy            # lint with clippy (deny warnings)

SHELL := /bin/sh

# Binary/crate name from Cargo.toml
BIN ?= execute_academy

# Default subcommand for `cargo run -- <CMD>`
CMD ?= execute_academy-apis

.PHONY: help dev dev-graphql run graphql build build-release test fmt fmt-check clippy check clean migrate migrate-down sqlx-install seed openapi graphql-docs

help:
	@echo "Available targets:"
	@echo "  dev             - Hot-reload run (cargo-watch)"
	@echo "  dev-graphql     - Hot-reload GraphQL server (cargo-watch)"
	@echo "  run [CMD=...]   - Run the binary with a subcommand (default: execute_academy-apis)"
	@echo "  graphql         - Run GraphQL server on port 9098"
	@echo "  build           - Build in debug mode"
	@echo "  build-release   - Build in release mode"
	@echo "  test            - Run tests"
	@echo "  fmt             - Format code with rustfmt"
	@echo "  fmt-check       - Check formatting (no changes)"
	@echo "  clippy          - Run clippy with warnings as errors"
	@echo "  check           - Type-check without building artifacts"
	@echo "  clean           - Clean target directory"
	@echo "  migrate         - Run SQLx database migrations (requires DATABASE_URL)"
	@echo "  migrate-down    - Revert the last migration (requires sqlx-cli)"
	@echo "  sqlx-install    - Install sqlx-cli (rustls, postgres)"
	@echo "  docs            - Build rustdoc and open in browser"
	@echo "  graphql-docs    - Generate GraphQL API documentation"
	@echo "  seed            - Seed default admin user (idempotent)"
	@echo "  openapi         - Generate OpenAPI YAML documentation"

# Hot-reload dev server (requires cargo-watch: cargo install cargo-watch)
dev:
	cargo watch -q -c -w src -x 'run -- $(CMD)'

# Hot-reload GraphQL server (requires cargo-watch: cargo install cargo-watch)
dev-graphql:
	cargo watch -q -c -w src -x 'run -- graphql'

# Run the binary with a subcommand (default CMD=apis)
run:
	cargo run -- $(CMD)

# Run GraphQL server on port 9098
graphql:
	API_PORT=9099 cargo run -- graphql

# Run SQLx migrations using the built-in command
migrate:
	cargo run -- migrate

# Revert the last applied migration using sqlx-cli
migrate-down:
	sqlx migrate revert

# Helper to install sqlx-cli if you don't have it
sqlx-install:
	cargo install sqlx-cli --no-default-features --features rustls,postgres

# Seed default admin user (idempotent; reads env or uses defaults)
seed:
	cargo run -- seed

# Generate OpenAPI YAML documentation
openapi:
	cargo run -- openapi

build:
	cargo build

build-release:
	cargo build --release

test:
	cargo test --all --all-features

fmt:
	cargo fmt --all

fmt-check:
	cargo fmt --all -- --check

clippy:
	cargo clippy --all-targets --all-features -- -D warnings

check:
	cargo check --all-targets --all-features

clean:
	cargo clean

.PHONY: docs
docs:
	cargo doc --no-deps --open

# Generate GraphQL API documentation
graphql-docs:
	@echo "🚀 Generating GraphQL documentation..."
	@./scripts/generate-graphql-docs.sh
	@echo "✅ GraphQL documentation generated successfully!"
	@echo "📁 Check the docs/graphql/ directory for generated files"
	@echo "📖 Main documentation: GRAPHQL_API_DOCS.md"