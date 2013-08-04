BUILD_DIR := ../build

RELEASE := 0
RELEASE_DATE := $(shell LC_TIME=C date "+%b %d, %Y")
RELEASE_VERSION := $(shell git describe --tags HEAD | cut -c2- | cut -d- -f1-2)

build: $(BUILD_DIR)/yays.user.js $(BUILD_DIR)/yays.meta.js

release: RELEASE = 1
release: build

translation:
	python utility/translation.py i18n

vocabulary:
	@python utility/vocabulary.py

$(BUILD_DIR)/yays.%.js: %.js
	gcc -E -P -CC -traditional -DRELEASE=$(RELEASE) -DRELEASE_DATE="$(RELEASE_DATE)" -DRELEASE_VERSION=$(RELEASE_VERSION) -o $@ -x c $<
	sed -e $$'0,/<<</d; s:??/047:\047:g' -i $@

user.js: $(filter-out user.js, $(wildcard *.js))

i18n.js: $(wildcard i18n/*.js)

%.js:
	@touch $@

.PHONY: build release vocabulary translation
