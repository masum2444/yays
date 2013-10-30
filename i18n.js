/*
 * i18n
 */

var _ = (function() {
#include "i18n/vocabulary.js"
	var dictionary = combine(vocabulary, (function() {
		switch ((document.documentElement.lang || 'en').substr(0, 2)) {
#include "i18n/hu.js"
#include "i18n/nl.js"
#include "i18n/es.js"
#include "i18n/de.js"
#include "i18n/pt.js"
#include "i18n/el.js"
#include "i18n/fr.js"
#include "i18n/sl.js"
#include "i18n/ru.js"
#include "i18n/iw.js"
#include "i18n/zh.js"
#include "i18n/pl.js"
#include "i18n/sv.js"
#include "i18n/uk.js"
		}

		return [];
	})());

	return function(text) { return dictionary[text] || text; };
})();
