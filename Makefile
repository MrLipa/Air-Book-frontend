SHELL := /bin/bash
.DEFAULT_GOAL := help

GREEN := \033[0;32m
YELLOW := \033[1;33m
RESET := \033[0m

BACKEND_DIR := .
LOGS_DIR := logs
DOCKER_IMAGE := my-node-app

help:
	@echo -e "$(YELLOW)Available commands:$(RESET)"
	@echo -e "  $(GREEN)make install$(RESET)            - Install backend dependencies"
	@echo -e "  $(GREEN)make audit-fix$(RESET)          - Force fix vulnerabilities (npm audit fix --force)"
	@echo -e "  $(GREEN)make start$(RESET)              - Start backend (production mode)"
	@echo -e "  $(GREEN)make dev$(RESET)                - Start backend (development mode)"
	@echo -e "  $(GREEN)make test$(RESET)               - Run backend tests"
	@echo -e "  $(GREEN)make test-integra$(RESET)       - Run integration tests (mocha)"
	@echo -e "  $(GREEN)make test-performance$(RESET)   - Run performance tests (k6)"
	@echo -e "  $(GREEN)make lint$(RESET)               - Lint code"
	@echo -e "  $(GREEN)make lint-fix$(RESET)           - Lint code and auto-fix issues"
	@echo -e "  $(GREEN)make format$(RESET)             - Format code using Prettier"
	@echo -e "  $(GREEN)make docs$(RESET)               - Generate documentation using TypeDoc"
	@echo -e "  $(GREEN)make clean$(RESET)              - Remove temporary files, caches and logs"
	@echo -e "  $(GREEN)make logs$(RESET)               - Display application logs"
	@echo -e "  $(GREEN)make docker-build$(RESET)       - Build Docker image"
	@echo -e "  $(GREEN)make docker-run$(RESET)         - Run Docker container with .env"
	@echo -e "  $(GREEN)make portainer-run$(RESET)      - Run Portainer container (no volume)"
	@echo -e "  $(GREEN)make docker-clean$(RESET)        - Remove all containers, images, volumes, and networks"

clean:
	find . -type d -name '__pycache__' -exec rm -r {} + 2>/dev/null || true
	find . -type f -name '*.log' -delete
	rm -rf $(LOGS_DIR)/* 2>/dev/null || true

install:
	npm install

audit-fix:
	npm audit fix --force

start:
	NODE_ENV=production npm start &

dev:
	npm run dev &

test-integra:
	npm run test:integra

test-performance:
	npm run test:performance

lint:
	npm run lint

lint-fix:
	npm run lint:fix

format:
	npm run format

docs:
	npm run docs

docker-clean:
	-docker rm -f $(docker ps -aq)
	-docker rmi -f $(docker images -q)
	-docker volume prune -f
	-docker network prune -f

docker-dev:
	docker compose --project-name air_book --profile dev down --volumes --remove-orphans
	docker system prune -f
	docker compose --project-name air_book --profile dev build
	docker compose --project-name air_book --profile dev up -d

docker-prod:
	docker compose --project-name air_book --profile prod down --volumes --remove-orphans
	docker system prune -f
	docker compose --project-name air_book --profile prod build
	docker compose --project-name air_book --profile prod up -d

.PHONY: help install audit-fix start dev test test-integra test-performance lint lint-fix format docs clean logs docker-build docker-run
