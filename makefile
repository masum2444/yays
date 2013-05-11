BUILD_DIR := ../build

RELEASE ?= 0

build: $(BUILD_DIR)/yays.user.js $(BUILD_DIR)/yays.meta.js

release: RELEASE = 1
release: build

$(BUILD_DIR)/yays.%.js: %.jst
	gcc -E -P -CC -traditional -DRELEASE=$(RELEASE) -o $@ -x c $<
	sed -ne $$'0,/==UserScript==/{h; d}; x; G; p; :1 n; s:??/047:\047:g; p; b1' -i $@

user.jst: $(addsuffix t, $(wildcard *.js))

%.jst: %.js
	sed -r 's://\s*(#\w+):\1:' $< > $@

clean:
	$(RM) *.jst

.PHONY: build release clean
