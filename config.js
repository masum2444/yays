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

	var prefix = namespace + '.';

	// HTML5
	if (typeof unsafeWindow.localStorage != 'undefined') {
		return {
			get: function(key) {
				return unsafeWindow.localStorage.getItem(prefix + key);
			},

			set: function(key, value) {
				unsafeWindow.localStorage.setItem(prefix + key, value);
			},

			del: function(key) {
				unsafeWindow.localStorage.removeItem(prefix + key);
			}
		};
	}

	// Cookie
	return {
		get: function(key) {
			return (document.cookie.match(new RegExp('(?:^|; *)'.concat(prefix, key, '=(\\w+)(?:$|;)'))) || [, null])[1];
		},

		set: function(key, value) {
			document.cookie = prefix.concat(key, '=', value, '; path=/; expires=', new Date(new Date().valueOf() + 365 * 24 * 36e5).toUTCString());
		},

		del: function(key) {
			document.cookie = prefix.concat(key, '=deleted; path=/; max-age=0');
		}
	};
})(Meta.ns);

