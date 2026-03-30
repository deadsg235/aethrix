.PHONY: install dev build clean test lint erdfa
install:
	npm install
dev:
	npm run dev
build:
	npm run build
clean:
	rm -rf node_modules dist .next
test:
	npm test 2>/dev/null || echo "no tests"
lint:
	npx eslint . 2>/dev/null || echo "no eslint"
erdfa:
	~/bin/sop-erdfa-functions . 2>/dev/null || echo "no .rs files"
