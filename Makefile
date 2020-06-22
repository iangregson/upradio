all: build deploy
.PHONY: all

clean:
	rm -rf dist/

build:
	npm --prefix ./ui run build

dev-build:
	npm --prefix ./ui run build:dev

dev-serve:
	wrangler dev --ip=0.0.0.0

deploy:
	wrangler publish

start:
	npm --prefix ./ui start