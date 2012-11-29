BUILD_DIR := ../build

all: yays.user.js yays.meta.js

yays.%.js: %.jsp
	gcc -E -P -CC -traditional -o $(BUILD_DIR)/$@ -x c $<
	sed -e $$'s:??/047:\047:g' -i $(BUILD_DIR)/$@

user.jsp: $(addsuffix p, $(wildcard *.js))

%.jsp: %.js
	sed -r 's://\s*(#\w+):\1:' $< > $@

clean:
	$(RM) *.jsp

.PHONY: all clean
