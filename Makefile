SHELL := /bin/bash
.DEFAULT_GOAL := help

GREEN := \033[0;32m
YELLOW := \033[1;33m
RESET := \033[0m

BACKEND_DIR := .
LOGS_DIR := logs

help:
	@echo -e "$(YELLOW)Available commands:$(RESET)"
	@echo -e "  $(GREEN)make install$(RESET)      - Install backend dependencies"
	@echo -e "  $(GREEN)make audit-fix$(RESET)    - Force fix vulnerabilities (npm audit fix --force)"
	@echo -e "  $(GREEN)make start$(RESET)        - Start backend (production mode)"
	@echo -e "  $(GREEN)make dev$(RESET)          - Start backend (development mode)"
	@echo -e "  $(GREEN)make test$(RESET)         - Run backend tests"
	@echo -e "  $(GREEN)make clean$(RESET)        - Remove temporary files, caches and logs"
	@echo -e "  $(GREEN)make logs$(RESET)         - Display application logs"

install:
	npm install

audit-fix:
	npm audit fix --force

start:
	NODE_ENV=production npm start &

dev:
	npm run dev &

test:
	npm test

clean:
	find . -type d -name '__pycache__' -exec rm -r {} + 2>/dev/null || true
	find . -type f -name '*.log' -delete
	rm -rf $(LOGS_DIR)/* 2>/dev/null || true

logs:
	@echo -e "$(YELLOW)Last logs:$(RESET)"
	@tail -n 20 $(LOGS_DIR)/*.log 2>/dev/null || echo "No logs found."

.PHONY: help install audit-fix start dev test lint clean logs stop
