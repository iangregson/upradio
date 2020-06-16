all: build deploy
.PHONY: all

clean:
	rm -rf dist/

build:
	npm --prefix ./ui run build

deploy:
	wrangler publish

start:
	npm --prefix ./ui start