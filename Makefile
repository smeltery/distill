BINARY := distill
GO_PACKAGES := . ./cmd/... ./internal/...
VERSION ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo dev)
LDFLAGS := -s -w -X main.version=$(VERSION)

.PHONY: build install setup test vet lint check-go check-content check-web check website clean cover
.DEFAULT_GOAL := build

build:
	go build -ldflags "$(LDFLAGS)" -o $(BINARY) .

install:
	go install -ldflags "$(LDFLAGS)" .

setup:
	bun install --frozen-lockfile
	bunx playwright install chromium
	pre-commit install

check-go:
	@test -z "$$(gofmt -l cmd internal main.go)" || (gofmt -l cmd internal main.go; exit 1)
	go vet $(GO_PACKAGES)
	golangci-lint run $(GO_PACKAGES)
	$(MAKE) test build

test:
	go test -race -coverprofile=coverage.out $(GO_PACKAGES)
	@go tool cover -func=coverage.out | awk '/^total:/ { print; if ($$3 + 0 < 80) exit 1 }'

vet:
	go vet $(GO_PACKAGES)

lint:
	golangci-lint run $(GO_PACKAGES)

check-content:
	bun run format:check
	bun run lint:md
	bun run check:budgets
	bun run check:docs

audit:
	govulncheck $(GO_PACKAGES)
	goreleaser check

audit-workflows:
	actionlint
	bun test scripts/auto-release.test.ts

check-web:
	bun run check:web
	bun run build:web
	bun run test:web

check: check-go check-content audit audit-workflows check-web

website:
	bun run docs:generate
	bun run --cwd website dev

clean:
	rm -f $(BINARY) coverage.out

cover: test
	go tool cover -html=coverage.out
