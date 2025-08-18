MAIN:=./
TARGET:=main
SERVER_CMD:=./${TARGET} serve-rest
MIGRATE_CMD:=./${TARGET} migrate
GEN_JWT:=./${TARGET} gen-jwt
PROTOC_DEST:=./
PROTOC_FLAGS:=--go_out=${PROTOC_DEST} --go_opt=paths=source_relative --go-grpc_out=${PROTOC_DEST} --go-grpc_opt=paths=source_relative
PROTO_FILES:=$(shell find ./proto -name "*.proto" -type f)

# example migration create command -
# migrate create -ext sql -seq -dir migrations create-some-table

build-proto:
	@echo "Generating protobuf files..."
	protoc ${PROTOC_FLAGS} ${PROTO_FILES}
	@echo "Protobuf generation completed!"

clean-proto:
	@echo "Cleaning generated protobuf files..."
	find ./proto -name "*.pb.go" -type f -delete
	@echo "Clean completed!"

proto: clean-proto build-proto

migrate: build
	KAFKA_ENABLE=false ${MIGRATE_CMD}

migrate-down: build
	KAFKA_ENABLE=false ./${TARGET} migrate-down

run-server: build
	${SERVER_CMD}

tidy:
	go mod tidy
	

install-proto-deps:
	go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
	go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

install-dev-deps:
	go install github.com/air-verse/air@latest

install-deps:
	go mod download

install-mockgen:
	go install go.uber.org/mock/mockgen@latest

install-test-deps:
	go install github.com/air-verse/air@latest

prepare: install-proto-deps install-dev-deps install-deps install-test-deps tidy proto

dev:
	air serve-rest

jwt: prepare
	air gen-jwt

test:
	go test ./... -v

test-watch:
	@echo "Starting test watch mode..."
	@echo "Watching for changes in .go files..."
	@echo "Press Ctrl+C to stop"
	@if command -v fswatch >/dev/null 2>&1; then \
		while true; do \
			clear; \
			echo "Running tests..."; \
			go test ./... -v; \
			echo "Waiting for changes..."; \
			fswatch -1 -r -e ".*\.go$$" . >/dev/null 2>&1; \
		done; \
	elif command -v inotifywait >/dev/null 2>&1; then \
		while true; do \
			clear; \
			echo "Running tests..."; \
			go test ./... -v; \
			echo "Waiting for changes..."; \
			inotifywait -r -e modify,create,delete --include='.*\.go$$' . || true; \
		done; \
	else \
		echo "Error: Neither fswatch (macOS) nor inotifywait (Linux) found."; \
		echo "Install fswatch: brew install fswatch"; \
		echo "Install inotifywait: sudo apt-get install inotify-tools"; \
		exit 1; \
	fi

test-unit:
	go test ./tests/unit/... -v

test-integration:
	go test ./tests/integration/... -v

test-coverage:
	go test ./... -v -coverprofile=coverage.out
	go tool cover -html=coverage.out -o coverage.html
	@echo "Coverage report generated: coverage.html"


build: install-deps
	go build -o ${TARGET} ${MAIN}

clean:
	@echo "Cleaning build artifacts..."
	rm -f ${TARGET}
	rm -f coverage.out coverage.html
	@echo "Clean completed!"

start: build run-server

list-proto:
	@echo "Found proto files:"
	@find ./proto -name "*.proto" -type f | sort

messaging-example:
	@echo "Running messaging example..."
	go run scripts/messaging_example.go

infra-up:
	@echo "Starting infrastructure services..."
	cd ../../infra && docker-compose up -d

infra-down:
	@echo "Stopping infrastructure services..."
	cd ../../infra && docker-compose down

infra-logs:
	@echo "Showing infrastructure logs..."
	cd ../../infra && docker-compose logs -f

help:
	@echo "Available commands:"
	@echo "  build-proto    - Generate protobuf files from .proto definitions"
	@echo "  clean-proto    - Remove generated protobuf files"
	@echo "  proto          - Clean and rebuild protobuf files"
	@echo "  list-proto     - List all proto files found"
	@echo "  migrate        - Run database migrations"
	@echo "  migrate-down   - Rollback database migrations"
	@echo "  install-deps   - Install Go dependencies"
	@echo "  install-proto-deps - Install protobuf compiler and plugins"
	@echo "  install-test-deps - Install test dependencies"
	@echo "  prepare        - Install all dependencies and generate proto files"
	@echo "  dev            - Start development server with hot reload"
	@echo "  build          - Build the application"
	@echo "  run-server     - Run the server"
	@echo "  start          - Build and run the server"
	@echo "  clean          - Clean build artifacts"
	@echo "  tidy           - Run go mod tidy"
	@echo "  test           - Run all tests"
	@echo "  test-watch     - Run tests in watch mode (requires inotify-tools)"
	@echo "  test-unit      - Run unit tests only"
	@echo "  test-integration - Run integration tests only"
	@echo "  test-coverage  - Run tests with coverage report"
	@echo "  messaging-example - Run the messaging integration example"
	@echo "  infra-up       - Start Kafka, NATS, and other infrastructure services"
	@echo "  infra-down     - Stop infrastructure services"
	@echo "  infra-logs     - Show infrastructure service logs"
	@echo "  help           - Show this help message"