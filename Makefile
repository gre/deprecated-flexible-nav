LESSC=lessc
LESSOPT=-x

JSMINC=yuicompressor
JSMINOPT=

flexible-nav.min.css: flexible-nav.less

%.min.css: %.less
	${LESSC} ${LESSOPT} $< -o $@

clean: 
	rm -rf *.min.css 
