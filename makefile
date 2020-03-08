# Paths
tsconfig_build_path := typescript/tsconfig.build.json

# NPX functions
tsc := node_modules/.bin/tsc
docz := node_modules/.bin/docz
mocha := node_modules/.bin/mocha
ts_node := node_modules/.bin/ts-node

.IGNORE: clean-linux

main: run

run: 
	@echo "[INFO] Starting docz environment"
	@NODE_ENV=development $(docz) dev

build:
	@echo "[INFO] Building for release"
	@NODE_ENV=production $(tsc) --p $(tsconfig_build_path)

docz:
	@echo "[INFO] Building docz"
	@NODE_ENV=development $(docz) build

tests:
	@echo "[INFO] Testing with Mocha"
	@NODE_ENV=test $(mocha)

cov:
	@echo "[INFO] Testing with Nyc and Mocha"
	@NODE_ENV=test \
	nyc $(mocha)

install:
	@echo "[INFO] Installing dev Dependencies"
	@yarn install --production=false

license: clean
	@echo "[INFO] Sign files"
	@NODE_ENV=development $(ts_node) script/license.ts

clean: clean-linux
	@echo "[INFO] Cleaning release files"
	@NODE_ENV=development $(ts_node) script/clean-app.ts

clean-linux:
	@echo "[INFO] Cleaning dist files"
	@rm -rf dist
	@rm -rf build
	@rm -rf .nyc_output
	@rm -rf coverage
	@rm -rf storybook-static

publish: install tests license build
	@echo "[INFO] Publishing package"
	@cd app && npm publish --access=public
