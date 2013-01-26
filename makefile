BUILD_DIR := ../build

all: yays.user.js yays.meta.js

yays.%.js: %.jst
	gcc -E -P -CC -traditional -o $(BUILD_DIR)/$@ -x c $<
	sed -e $$'s:??/047:\047:g' -i $(BUILD_DIR)/$@

user.jst: $(addsuffix t, $(wildcard *.js))

%.jst: %.js
	sed -r 's://\s*(#\w+):\1:' $< > $@

clean:
	$(RM) *.jst

.PHONY: all clean
