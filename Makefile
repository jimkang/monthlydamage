BROWSERIFY = node_modules/.bin/browserify
UGLIFY = node_modules/.bin/uglifyjs

test:
	node tests/basictests.js

run:
	wzrd index.js -- \
		-d

build:
	$(BROWSERIFY) index.js | $(UGLIFY) -c -m -o monthlydamage.js

pushall:
	git push origin master && git push origin gh-pages
