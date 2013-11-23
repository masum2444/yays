/*
 * Configuration handler singleton.
 */

var Config = (function(namespace) {
	// Greasemonkey compatible
	if (typeof GM_getValue == 'function') {
		return {
			get: GM_getValue,
			set: GM_setValue,
			del: GM_deleteValue
		};
	}

	// HTML5
	return {
		get: function(key) {
			return unsafeWindow.localStorage.getItem(namespace + '.' + key);
		},

		set: function(key, value) {
			unsafeWindow.localStorage.setItem(namespace + '.' + key, value);
		},

		del: function(key) {
			unsafeWindow.localStorage.removeItem(namespace + '.' + key);
		}
	};
})(Meta.ns);
