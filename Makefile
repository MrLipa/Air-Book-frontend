SHELL := /bin/bash
.DEFAULT_GOAL := help

GREEN := \033[0;32m
YELLOW := \033[1;33m
RESET := \033[0m

BACKEND_DIR := .
LOGS_DIR := logs
DOCKER_IMAGE := my-node-app

file ?= ../docker-compose.dev.yml
project ?= air_book
profile ?= dev
services ?= all
nc ?= false

help:
	@echo -e "$(YELLOW)Available commands:$(RESET)"
	@echo -e "  $(GREEN)make install$(RESET)              - Install backend dependencies"
	@echo -e "  $(GREEN)make audit-fix$(RESET)            - Force fix vulnerabilities (npm audit fix --force)"
	@echo -e "  $(GREEN)make start$(RESET)                - Start backend (production mode)"
	@echo -e "  $(GREEN)make dev$(RESET)                  - Start backend (development mode)"
	@echo -e "  $(GREEN)make test-unit$(RESET)            - Run unit tests"
	@echo -e "  $(GREEN)make test-integra$(RESET)         - Run integration tests (mocha)"
	@echo -e "  $(GREEN)make test-performance$(RESET)     - Run performance tests (k6)"
	@echo -e "  $(GREEN)make lint$(RESET)                 - Lint code"
	@echo -e "  $(GREEN)make lint-fix$(RESET)             - Lint code and auto-fix issues"
	@echo -e "  $(GREEN)make format$(RESET)               - Format code using Prettier"
	@echo -e "  $(GREEN)make docs$(RESET)                 - Generate documentation using TypeDoc"
	@echo -e "  $(GREEN)make logs$(RESET)                 - Display application logs"
	@echo -e "  $(GREEN)make clean$(RESET)                - Remove temporary files, caches and logs"
	@echo -e "  $(GREEN)make docker-clean$(RESET)         - Remove all containers, images, volumes, and networks"
	@echo -e "  $(GREEN)make docker-up$(RESET)            - Build and start Docker containers"
	@echo -e "       Example: make docker-up services=\"mysql adminer\""
	@echo -e "       Example: make docker-up services=adminer nc=true profile=dev project=air_book"
	@echo -e "  $(GREEN)make docker-down$(RESET)          - Stop and remove containers/images"
	@echo -e "       Example: make docker-down"
	@echo -e "       Example: make docker-down services=portainer profile=prod"

git-commit:
	git add --all && git commit -m"little changes" && git push

install:
	@echo -e "$(GREEN)Installing backend dependencies...$(RESET)"
	npm install

audit-fix:
	@echo -e "$(GREEN)Running npm audit fix with --force...$(RESET)"
	npm audit fix --force

start:
	@echo -e "$(GREEN)Starting backend in production mode...$(RESET)"
	npm run start

dev:
	@echo -e "$(GREEN)Starting backend in development mode...$(RESET)"
	npm run dev

test-unit:
	@echo -e "$(GREEN)Running unit tests...$(RESET)"
	npm run test:unit

test-integra:
	@echo -e "$(GREEN)Running integration tests...$(RESET)"
	npm run test:integra

test-performance:
	@echo -e "$(GREEN)Running performance tests...$(RESET)"
	npm run test:performance

lint:
	@echo -e "$(GREEN)Linting code...$(RESET)"
	npm run lint

lint-fix:
	@echo -e "$(GREEN)Linting and fixing code...$(RESET)"
	npm run lint:fix

format:
	@echo -e "$(GREEN)Formatting code with Prettier...$(RESET)"
	npm run format

docs:
	@echo -e "$(GREEN)Generating documentation with TypeDoc...$(RESET)"
	npm run docs

logs:
	@echo -e "$(GREEN)Tailing application logs...$(RESET)"
	tail -f $(LOGS_DIR)/*.log

clean:
	@echo -e "$(GREEN)Cleaning temporary files, caches, and logs...$(RESET)"
	find . -type d -name '__pycache__' -exec rm -r {} + 2>/dev/null || true
	find . -type f -name '*.log' -delete
	rm -rf $(LOGS_DIR)/* 2>/dev/null || true

docker-clean:
	@echo -e "$(GREEN)Cleaning all Docker containers, images, volumes, and networks...$(RESET)"
	-docker rm -f $$(docker ps -aq) 2>/dev/null || true
	-docker rmi -f $$(docker images -q) 2>/dev/null || true
	-docker volume prune -f
	-docker network prune -f

docker-up:
	@echo -e "$(GREEN)Starting Docker build and up...$(RESET)"
	@if [ "$(services)" = "all" ]; then \
		SVCS=""; \
	else \
		SVCS="$(services)"; \
	fi; \
	if [ "$(nc)" = "true" ]; then \
		COMPOSE_BAKE=true docker compose -f $(file) --project-name $(project) --profile $(profile) build --no-cache $$SVCS; \
	else \
		docker compose -f $(file) --project-name $(project) --profile $(profile) build $$SVCS; \
	fi; \
	docker compose -f $(file) --project-name $(project) --profile $(profile) up -d $$SVCS; \
	echo -e "$(GREEN)Docker containers are up and running.$(RESET)"

docker-down:
	@echo -e "$(GREEN)Stopping and removing Docker containers/images...$(RESET)"
	@if [ "$(services)" = "all" ]; then \
		docker compose -f $(file) --project-name $(project) --profile $(profile) down --volumes --rmi all; \
	else \
		docker compose -f $(file) --project-name $(project) --profile $(profile) stop $(services); \
		docker compose -f $(file) --project-name $(project) rm -fsv $(services); \
	fi

.PHONY: help install audit-fix start dev test-unit test-integra test-performance lint lint-fix format docs clean logs docker-clean docker-up docker-down
