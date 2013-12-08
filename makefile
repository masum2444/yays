RELEASE := 0
RELEASE_DATE := $(shell LC_TIME=C date "+%b %d, %Y")
RELEASE_VERSION := $(shell git describe HEAD | sed -r 's/^.//;s/-([0-9]+).+/.\1/')

RELEASE_FLAGS = -DRELEASE=$(RELEASE) -DRELEASE_DATE="$(RELEASE_DATE)" -DRELEASE_VERSION=$(RELEASE_VERSION)

build: build/yays.user.js build/yays.meta.js

release: RELEASE = 1
release: clean build

include utility/utility.mk

clean:
	$(RM) build/*

build/yays.%.js: %.js
	gcc -E -P -CC -nostdinc -traditional $(RELEASE_FLAGS) -x c $< | $(POSTPROCESS) > $@

user.js: $(filter-out user.js, $(wildcard *.js))

i18n.js: $(wildcard i18n/*.js)

%.js:
	@touch $@

.PHONY: build
