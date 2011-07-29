LESSC=lessc
LESSOPT=-x

JSMINC=yuicompressor
JSMINOPT=

JSDOCC=./docco/bin/docco
JSDOCOPT=

VERSION=1.0
ZNAME=flexible-nav-${VERSION}


all: dist/${ZNAME}.zip lib/flexible-nav.min.css demo/index.html lib/flexible-nav.min.js lib/bookmarklet.min.js docs/flexible-nav.html demo/flexible-nav.min.js demo/flexible-nav.min.css

lib/flexible-nav.min.css: flexible-nav.less
lib/flexible-nav.min.js: flexible-nav.js
lib/bookmarklet.min.js: bookmarklet.js

demo/index.html: docs/flexible-nav.html
	cp $< $@

docs/flexible-nav.html: flexible-nav.js

demo/flexible-nav.min.js: lib/flexible-nav.min.js
	cp $< $@

demo/flexible-nav.min.css: lib/flexible-nav.min.css
	cp $< $@

docs/%.html: %.js
	${JSDOCC} ${JSDOCOPT} $<

lib/%.min.css: %.less
	${LESSC} ${LESSOPT} $< -o $@

%.min.css: %.less
	${LESSC} ${LESSOPT} $< -o $@

lib/%.min.js: %.js
	${JSMINC} ${JSMINOPT} $< -o $@

dist/${ZNAME}.zip: lib/flexible-nav.min.js lib/flexible-nav.min.css
	rm -rf ${ZNAME}/ ${ZNAME}.zip
	mkdir ${ZNAME}/
	cp lib/flexible-nav.min.js ${ZNAME}/
	cp lib/flexible-nav.min.css ${ZNAME}/
	zip -r dist/${ZNAME}.zip ${ZNAME}
	rm -rf ${ZNAME}

clean: 
	rm -rf dist/${ZNAME}.zip docs/* lib/* demo/index.html demo/flexible-nav.min.js demo/flexible-nav.min.css
