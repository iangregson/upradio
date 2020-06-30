all: install build deploy
.PHONY: all

clean:
	rm -rf dist/

install:
	npm --prefix ./ui install
	npm --prefix ./workers-site install

dev-build:
	npm --prefix ./ui run build:dev

dev-serve:
	wrangler dev --ip=0.0.0.0

dev-deploy:
	wrangler publish --env=staging

build:
	npm --prefix ./ui run build

deploy:
	wrangler publish

start:
	npm --prefix ./ui start