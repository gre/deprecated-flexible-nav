LESSC=lessc
LESSOPT=-x

JSMINC=yuicompressor
JSMINOPT=

JSDOCC=docco
JSDOCOPT=

all: lib/flexible-nav.min.css lib/flexible-nav.min.js lib/bookmarklet.min.js docs/flexible-nav.html demo/flexible-nav.js demo/flexible-nav.min.css

lib/flexible-nav.min.css: flexible-nav.less
lib/flexible-nav.min.js: flexible-nav.js
lib/bookmarklet.min.js: bookmarklet.js

docs/flexible-nav.html: flexible-nav.js

demo/flexible-nav.js: flexible-nav.js
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


clean: 
	rm -rf docs/* lib/* demo/flexible-nav.js demo/flexible-nav.min.css
