########## Makefile for the Rust API crate ##########
# Usage examples:
#  make dev               # hot-reload server (requires cargo-watch)
#  make run               # run default command (apis)
#  make run CMD=cli       # run with a specific subcommand
#  make test              # run tests
#  make fmt               # format code
#  make clippy            # lint with clippy (deny warnings)

SHELL := /bin/sh

# Binary/crate name from Cargo.toml
BIN ?= execute_academy

# Default subcommand for `cargo run -- <CMD>`
CMD ?= apis

.PHONY: help dev run build build-release test fmt fmt-check clippy check clean

help:
	@echo "Available targets:"
	@echo "  dev             - Hot-reload run (cargo-watch)"
	@echo "  run [CMD=...]   - Run the binary with a subcommand (default: apis)"
	@echo "  build           - Build in debug mode"
	@echo "  build-release   - Build in release mode"
	@echo "  test            - Run tests"
	@echo "  fmt             - Format code with rustfmt"
	@echo "  fmt-check       - Check formatting (no changes)"
	@echo "  clippy          - Run clippy with warnings as errors"
	@echo "  check           - Type-check without building artifacts"
	@echo "  clean           - Clean target directory"

# Hot-reload dev server (requires cargo-watch: cargo install cargo-watch)
dev:
	cargo watch -q -c -w src -x 'run -- $(CMD)'

# Run the binary with a subcommand (default CMD=apis)
run:
	cargo run -- $(CMD)

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