all: clean build deploy
.PHONY: all

clean:
	rm -rf dist/

build:
	npm --prefix ./ui run build

deploy:
	wrangler deploy