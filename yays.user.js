// ==UserScript==
// @name        Yays! (Yet Another Youtube Script)
// @description Control autoplaying and playback quality on YouTube.
// @version     1.5.6.1
// @author      eugenox_gmail_com
// @license     (CC) BY-SA-3.0 http://creativecommons.org/licenses/by-sa/3.0/
// @namespace   youtube
// @include     http*://*.youtube.com/*
// @include     http*://youtube.com/*
// @run-at      document-end
// ==/UserScript==

function YAYS(unsafeWindow) {

/*
 * Meta.
 */
var Meta = {
	title:       'Yays! (Yet Another Youtube Script)',
	version:     '1.5.6.1',
	releasedate: 'May 21, 2012',
	site:        'http://eugenox.appspot.com/script/yays',
	ns:          'yays'
};

/*
 * Script context.
 */
unsafeWindow[Meta.ns] = {};

/*
 * Utility functions.
 */
function each(iterable, callback, scope) {
	if (iterable.length) {
		for (var i = 0, len = iterable.length; i < len; ++i)
			callback.call(scope, i, iterable[i]);
	}
	else {
		for (var key in iterable)
			if (iterable.hasOwnProperty(key))
				callback.call(scope, key, iterable[key]);
	}
}

function map() {
	var
		args = Array.prototype.constructor.apply([], arguments),
		callback = args.shift() || bind(Array.prototype.constructor, []),
		buffer = [];

	if (args.length > 1) {
		var i = 0, len = Math.max.apply(Math, map(function(arg) { return arg.length; }, args));
		function getter(arg) { return arg[i]; }

		for (; i < len; ++i)
			buffer.push(callback.apply(null, map(getter, args)));
	}
	else {
		for (var i = 0, arg = args[0], len = arg.length; i < len; ++i)
			buffer.push(callback(arg[i]));
	}

	return buffer;
}

function combine(keys, values) {
	var object = {};
	map(function(key, value) { object[key] = value; }, keys, values);

	return object;
}

function bind(func, scope, args) {
	return function() {
		return func.apply(scope, typeof args == 'undefined' ? arguments : args);
	};
}

function copy(src, target) {
	for (var key in src)
		target[key] = src[key];

	return target;
}

function extendFn(func, extension) {
	if (! func)
		return extension;

	return function() {
		setTimeout(bind(func, this, arguments), 0);

		extension.apply(this, arguments);
	};
}

function emptyFn() { return; };

function buildURL(path, parameters) {
	var query = [];
	each(parameters, function(key, value) { query.push(key.concat('=', encodeURIComponent(value))); });

	return path.concat('?', query.join('&'));
}

function parseJSON(data) {
	if (typeof JSON != 'undefined')
		return JSON.parse(data);

	return eval('('.concat(data, ')'));
}

function debug() {
	unsafeWindow.console.debug.apply(unsafeWindow.console, Array.prototype.concat.apply(['[yays]'], arguments));
}

/*
 * i18n
 */
var _ = (function() {
	var
	vocabulary = [
		'Auto play', 'ON', 'OFF', 'AUTO', 'Toggle video autoplay',
		'Quality', 'AUTO', 'LOW', 'MEDIUM', 'HIGH', 'HIGHEST', 'Set default video quality',
		'Size', 'WIDE', 'FIT', 'Set default player size',
		'Settings', 'Player settings', 'Help'
	],
	dictionary = combine(vocabulary, (function() {
		switch ((document.documentElement.lang || 'en').substr(0, 2)) {
			// hungarian - magyar
			case 'hu':
				return [
					'Automatikus lej\xE1tsz\xE1s', 'BE', 'KI', 'AUTO', 'Automatikus lej\xE1tsz\xE1s ki-, bekapcsol\xE1sa',
					'Min\u0151s\xE9g', 'AUTO', 'ALACSONY', 'K\xD6ZEPES', 'MAGAS', 'LEGMAGASABB', 'Vide\xF3k alap\xE9rtelmezett felbont\xE1sa',
					'M\xE9ret', 'SZ\xC9LES', 'ILLESZTETT', 'Lej\xE1tsz\xF3 alap\xE9rtelmezett m\xE9rete',
					'Be\xE1ll\xEDt\xE1sok', 'Lej\xE1tsz\xF3 be\xE1ll\xEDt\xE1sai', 'S\xFAg\xF3'
				];

			// dutch - nederlands (Mike-RaWare @userscripts.org)
			case 'nl':
				return [
					'Auto spelen', 'AAN', 'UIT', 'AUTOMATISCH', 'Stel automatisch afspelen in',
					'Kwaliteit', 'AUTOMATISCH', 'LAAG', 'GEMIDDELD', 'HOOG', undefined, 'Stel standaard videokwaliteit in',
					undefined, undefined, undefined, undefined,
					undefined, undefined, undefined
				];

			// spanish - español (yonane @userscripts.org)
			case 'es':
				return [
					'Reproducci\xF3n Autom\xE1tica', undefined, undefined, 'AUTO', 'Modificar Reproducci\xF3n Autom\xE1tica',
					'Calidad', 'AUTO', 'BAJA', 'MEDIA', 'ALTA', undefined, 'Usar calidad por defecto',
					undefined, undefined, undefined, undefined,
					undefined, undefined, undefined
				];

			// german - deutsch (xemino @userscripts.org)
			case 'de':
				return [
					'Automatische Wiedergabe', 'AN', 'AUS', 'AUTO', 'Automatische Wiedergabe umschalten',
					'Qualit\xE4t', 'AUTO', 'NIEDRIG', 'MITTEL', 'HOCH', undefined, 'Standard Video Qualit\xE4t setzen',
					undefined, undefined, undefined, undefined,
					undefined, undefined, undefined
				];

			// brazilian portuguese - português brasileiro (Pitukinha @userscripts.org)
			case 'pt':
				return [
					'Reprodu\xE7\xE3o Autom\xE1tica', 'LIGADO', 'DESLIGADO', 'AUTOM\xC1TICO', 'Modificar Reprodu\xE7\xE3o Autom\xE1tica',
					'Qualidade', 'AUTOM\xC1TICO', 'BAIXA', 'M\xC9DIO', 'BOA', undefined, 'Defini\xE7\xE3o padr\xE3o de v\xEDdeo',
					undefined, undefined, undefined, undefined,
					'Configura\xE7\xF5es', 'Configura\xE7\xE3o do usu\xE1rio', undefined
				];

			// greek - Έλληνες (TastyTeo @userscripts.org)
			case 'el':
				return [
					'\u0391\u03C5\u03C4\u03CC\u03BC\u03B1\u03C4\u03B7 \u03B1\u03BD\u03B1\u03C0\u03B1\u03C1\u03B1\u03B3\u03C9\u03B3\u03AE', '\u0395\u039D\u0395\u03A1\u0393\u039F', '\u0391\u039D\u0395\u039D\u0395\u03A1\u0393\u039F', '\u0391\u03A5\u03A4\u039F\u039C\u0391\u03A4\u0397', '\u0395\u03BD\u03B1\u03BB\u03BB\u03B1\u03B3\u03AE \u03B1\u03C5\u03C4\u03CC\u03BC\u03B1\u03C4\u03B7\u03C2 \u03B1\u03BD\u03B1\u03C0\u03B1\u03C1\u03B1\u03B3\u03C9\u03B3\u03AE\u03C2',
					'\u03A0\u03BF\u03B9\u03CC\u03C4\u03B7\u03C4\u03B1', '\u0391\u03A5\u03A4\u039F\u039C\u0391\u03A4\u0397', '\u03A7\u0391\u039C\u0397\u039B\u0397', '\u039A\u0391\u039D\u039F\u039D\u0399\u039A\u0397', '\u03A5\u03A8\u0397\u039B\u0397', '\u03A0\u039F\u039B\u03A5 \u03A5\u03A8\u0397\u039B\u0397', '\u039F\u03C1\u03B9\u03C3\u03BC\u03CC\u03C2 \u03C0\u03C1\u03BF\u03B5\u03C0\u03B9\u03BB\u03B5\u03B3\u03BC\u03AD\u03BD\u03B7\u03C2 \u03C0\u03BF\u03B9\u03CC\u03C4\u03B7\u03C4\u03B1\u03C2 \u03B2\u03AF\u03BD\u03C4\u03B5\u03BF',
					undefined, undefined, undefined, undefined,
					'\u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AD\u03C2', '\u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AD\u03C2 Player', undefined
				];

			// french - français (eXa @userscripts.org)
			case 'fr':
				return [
					'Lecture Auto', undefined, undefined, undefined, 'Lecture auto ON/OFF',
					'Qualit\xE9', undefined, 'BASSE', 'MOYENNE', 'HAUTE', 'LA PLUS HAUTE', 'Qualit\xE9 par d\xE9faut',
					undefined, undefined, undefined, undefined,
					'Options', 'Option du lecteur', undefined
				];

			// slovenian - slovenščina (Paranoia.Com @userscripts.org)
			case 'sl':
				return [
					'Samodejno predvajanje', 'Vklju\u010Di', 'Izklju\u010Di', 'Samodejno', 'Vklop/izklop samodejnega predvajanja',
					'Kakovost', 'Samodejno', 'Nizka', 'Srednja', 'Visoka', 'Najvi\u0161ja', 'Nastavi privzeto kakovost videa',
					undefined, undefined, undefined, undefined,
					'Nastavitve', 'Nastavitve predvajalnika', 'Pomo\u010D'
				];

			// russian - русский (an1k3y @userscripts.org)
			case 'ru':
				return [
					'\u0410\u0432\u0442\u043E \u0432\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435', '\u0412\u041A\u041B', '\u0412\u042B\u041A\u041B', '\u0410\u0412\u0422\u041E', '\u0410\u0432\u0442\u043E\u0437\u0430\u043F\u0443\u0441\u043A \u0432\u0438\u0434\u0435\u043E',
					'\u041A\u0430\u0447\u0435\u0441\u0442\u0432\u043E', '\u0410\u0412\u0422\u041E', '\u041D\u0418\u0417\u041A\u041E\u0415', '\u0421\u0420\u0415\u0414\u041D\u0415\u0415', '\u0412\u042B\u0421\u041E\u041A\u041E\u0415', '\u0421\u0410\u041C\u041E\u0415 \u0412\u042B\u0421\u041E\u041A\u041E\u0415', '\u041A\u0430\u0447\u0435\u0441\u0442\u0432\u043E \u0432\u0438\u0434\u0435\u043E \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E',
					'\u0420\u0410\u0417\u041C\u0415\u0420', '\u0420\u0410\u0417\u0412\u0415\u0420\u041D\u0423\u0422\u042C', '\u0420\u0410\u0421\u0422\u042F\u041D\u0423\u0422\u042C', '\u0420\u0430\u0437\u043C\u0435\u0440 \u0432\u0438\u0434\u0435\u043E \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E',
					'\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438', '\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043F\u043B\u0435\u0435\u0440\u0430', '\u041F\u043E\u043C\u043E\u0449\u044C'
				];

			// hebrew - עברית (baryoni @userscripts.org)
			case 'iw':
				return [
					'\u05D4\u05E4\u05E2\u05DC\u05D4 \u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9\u05EA', '\u05E4\u05E2\u05D9\u05DC', '\u05DB\u05D1\u05D5\u05D9', '\u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9', '\u05E9\u05E0\u05D4 \u05DE\u05E6\u05D1 \u05D4\u05E4\u05E2\u05DC\u05D4 \u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9\u05EA \u05E9\u05DC \u05D4\u05D5\u05D9\u05D3\u05D0\u05D5',
					'\u05D0\u05D9\u05DB\u05D5\u05EA', '\u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9\u05EA', '\u05E0\u05DE\u05D5\u05DB\u05D4', '\u05D1\u05D9\u05E0\u05D5\u05E0\u05D9\u05EA', '\u05D2\u05D1\u05D5\u05D4\u05D4', '\u05D4\u05D2\u05D1\u05D5\u05D4\u05D4 \u05D1\u05D9\u05D5\u05EA\u05E8', '\u05D4\u05D2\u05D3\u05E8 \u05D0\u05EA \u05D0\u05D9\u05DB\u05D5\u05EA \u05D1\u05E8\u05D9\u05E8\u05EA \u05D4\u05DE\u05D7\u05D3\u05DC \u05E9\u05DC \u05D4\u05D5\u05D9\u05D3\u05D0\u05D5',
					'\u05D2\u05D5\u05D3\u05DC', '\u05E8\u05D7\u05D1', '\u05DE\u05DC\u05D0', '\u05D4\u05D2\u05D3\u05E8 \u05D0\u05EA \u05D2\u05D5\u05D3\u05DC \u05D1\u05E8\u05D9\u05E8\u05EA \u05D4\u05DE\u05D7\u05D3\u05DC \u05E9\u05DC \u05D4\u05E0\u05D2\u05DF',
					'\u05D4\u05D2\u05D3\u05E8\u05D5\u05EA', '\u05D4\u05D2\u05D3\u05E8\u05D5\u05EA \u05E0\u05D2\u05DF', '\u05E2\u05D6\u05E8\u05D4'
				];
		}

		return [];
	})());

	return function(text) { return dictionary[text] || text; };
})();

/*
 * DOM Helper singleton.
 */
var DH = {
	build: function(def) {
		switch (Object.prototype.toString.call(def)) {
			case '[object Object]':
				def = copy(def, {tag: 'div', style: null, attributes: null, listeners: null, children: null});

				var node = this.createElement(def.tag);

				if (def.style !== null)
					this.style(node, def.style);

				if (def.attributes !== null)
					this.attributes(node, def.attributes);

				if (def.listeners !== null)
					this.listeners(node, def.listeners);

				if (def.children !== null)
					this.append(node, def.children);

				return node;

			case '[object String]':
				return this.createTextNode(def);

			default:
				return def;
		}
	},

	id: bind(unsafeWindow.document.getElementById, unsafeWindow.document),
	createElement: bind(unsafeWindow.document.createElement, unsafeWindow.document),
	createEvent: bind(unsafeWindow.document.createEvent, unsafeWindow.document),
	createTextNode: bind(unsafeWindow.document.createTextNode, unsafeWindow.document),

	style: function(node, style) {
		copy(style, node.style);
	},

	append: function(node, children) {
		each([].concat(children), function(i, child) { node.appendChild(this.build(child)); }, this);
		node.normalize();
	},

	insertAfter: function(node, children) {
		var parent = node.parentNode, sibling = node.nextSibling;
		if (sibling) {
			each([].concat(children), function(i, child) { parent.insertBefore(this.build(child), sibling); }, this);
			parent.normalize();
		}
		else {
			this.append(parent, children);
		}
	},

	prepend: function(node, children) {
		if (node.hasChildNodes()) {
			var firstChild = node.firstChild;
			each([].concat(children), function(i, child) { node.insertBefore(this.build(child), firstChild); }, this);
		}
		else {
			this.append(node, children);
		}
	},

	content: function(node, children) {
		if (node.hasChildNodes()) {
			var child = null;
			while (child = node.firstChild) node.removeChild(child);
		}

		this.append(node, children);
	},

	attributes: function(node, attributes) {
		each(attributes, node.setAttribute, node);
	},

	hasClass: function(node, clss) {
		return node.hasAttribute('class') && node.getAttribute('class').indexOf(clss) != -1;
	},

	addClass: function(node, clss) {
		if (! this.hasClass(node, clss)) {
			node.setAttribute('class', (node.getAttribute('class') || '').concat(' ', clss).trim());
		}
	},

	delClass: function(node, clss) {
		if (this.hasClass(node, clss)) {
			node.setAttribute('class', node.getAttribute('class').replace(new RegExp('\\s*'.concat(clss, '\\s*'), 'g'), ' ').trim());
		}
	},

	listeners: function(node, listeners) {
		each(listeners, function(type, listener) { this.on(node, type, listener); }, this);
	},

	on: function(node, type, listener) {
		node.addEventListener(type, listener, false);
	},

	un: function(node, type, listener) {
		node.removeEventListener(type, listener, false);
	},

	unwrap: function(element) {
		if (typeof XPCNativeWrapper != 'undefined' && typeof XPCNativeWrapper.unwrap == 'function')
			return XPCNativeWrapper.unwrap(element);

		return element;
	}
};

/*
 * Configuration handler singleton.
 */
var Config = (function(namespace) {
	// Greasemonkey compatible
	if (typeof GM_listValues == 'function') {
		// Accessing GM_getValue from unsafeWindow is not allowed.
		var GM_values = combine(GM_listValues(), map(GM_getValue, GM_listValues()));

		return {
			get: function(key) {
				return GM_values[key] || null;
			},

			set: function(key, value) {
				GM_setValue(key, value);
				GM_values[key] = value;
			},

			del: function(key) {
				GM_deleteValue(key);
				delete GM_values[key];
			}
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

/*
 * Create XHR or JSONP requests.
 */
var JSONRequest = (function(namespace) {
	var Request = null;

	// XHR
	if (typeof GM_xmlhttpRequest == 'function') {
		Request = function(url, parameters, callback) {
			this._callback = callback;

			GM_xmlhttpRequest({
				method: 'GET',
				url: buildURL(url, parameters),
				onload: bind(this._onLoad, this)
			});
		};

		Request.prototype = {
			_onLoad: function(response) {
				this._callback(parseJSON(response.responseText));
			}
		};
	}
	// JSONP
	else {
		Request = (function() {
			var requests = [], requestsNs = 'jsonp';

			function Request(url, parameters, callback) {
				this._callback = callback;
				this._id = requests.push(bind(this._onLoad, this)) - 1;

				parameters.callback = namespace.concat('.', requestsNs, '[', this._id, ']');

				this._scriptNode = document.body.appendChild(DH.build({
					tag: 'script',
					attributes: {
						type: 'text/javascript',
						src: buildURL(url, parameters)
					}
				}));
			}

			Request.prototype = {
				_callback: null,
				_id: null,
				_scriptNode: null,

				_onLoad: function(response) {
					this._callback(response);

					document.body.removeChild(this._scriptNode);
					delete requests[this._id];
				}
			};

			unsafeWindow[namespace][requestsNs] = requests;

			return Request;
		})();
	}

	return Request;
})(Meta.ns);

/*
 * Check for update.
 */
(function() {
	if (new Date().valueOf() - Number(Config.get('update_checked_at')) < 24 * 36e5)
		return;

	var popup = null;

	new JSONRequest(Meta.site + '/changelog', {version: Meta.version}, function(changelog) {
		Config.set('update_checked_at', new Date().valueOf().toFixed());

		if (changelog && changelog.length)
			popup = renderPopup(changelog);
	});

	function renderPopup(changelog) {
		return document.body.appendChild(DH.build({
			style: {
				position: 'fixed', top: '15px', right: '15px', zIndex: 1000, padding: '10px 15px 5px', backgroundColor: '#ffffff', border: '1px solid #cccccc',
				color: '#333333', fontSize: '11px', fontFamily: 'Arial,sans-serif', lineHeight: '12px',
				boxShadow: '0 1px 2px #cccccc'
			},
			children: [{
				style: {textAlign: 'center', fontWeight: 'bold'},
				children: Meta.title
			}, {
				style: {color: '#a0a0a0', marginBottom: '10px', textAlign: 'center'},
				children: 'UserScript update notification.'
			}, {
				style: {marginBottom: '10px'},
				children: ['You are using version ', {tag: 'strong', children: Meta.version}, ', released on ', {tag: 'em', children: Meta.releasedate}, '.', {tag: 'br'}, 'Please update to the newest release.']
			}, {
				children: map(function(entry) {
					return {
						style: {marginBottom: '5px'},
						children: [
							{tag: 'strong', style: {fontSize: '11px'}, children: entry.version},
							{tag: 'em', style: {marginLeft: '5px'}, children: entry.date},
							{style: {padding: '0 0 2px 10px', whiteSpace: 'pre'}, children: [].concat(entry.note).join('\n')}
						]
					};
				}, [].concat(changelog))
			}, {
				style: {textAlign: 'center', padding: '10px 0'},
				children: map(function(text, handler) {
					return DH.build({
						tag: 'span',
						attributes: {'class': 'yt-uix-button'},
						style: {margin: '0 5px', padding: '5px 10px'},
						children: text,
						listeners: {click: handler}
					});
				}, ['Update', 'Dismiss'], [openDownloadSite, removePopup])
			}]
		}));
	}

	function removePopup() {
		document.body.removeChild(popup);
	}

	function openDownloadSite() {
		removePopup();
		unsafeWindow.open(buildURL(Meta.site + '/download', {version: Meta.version}));
	}
})();

/*
 * Player singleton.
 */
var Player = (function() {
	var instance = {
		_element: null
	};

	function Player(element) {
		this._element = element;
		this._boot();
	}

	Player.prototype = {
		_element: null,
		_muted: 0,

		_boot: function() {
			if (typeof this._element.getApiInterface == 'function') {
				this._apiInterface();

				this._onApiReady();

				var apiReady = DH.createEvent('Event');
				apiReady.initEvent('apiready', false, false);
				apiReady.player = this;

				this._element.dispatchEvent(apiReady);
			}
			else
				setTimeout(bind(this._boot, this), 10);
		},

		_apiInterface: function() {
			each(this._element.getApiInterface(), function(i, method) {
				if (! Player.prototype.hasOwnProperty(method))
					this[method] = bind(this._element[method], this._element);
			}, this);
		},

		_onApiReady: function() {
			this._muted = Number(this.isMuted());

			// FIXME: Sometimes the player reports unstarted state even if the video was
			// being started. This hack fix this problem somehow.
			if (this.isAutoPlaying())
				this.seekTo(this.getCurrentTime(), false);
		},

		getArgument: function(name) {
			// Flash
			if (this._element.hasAttribute('flashvars')) {
				var match = this._element.getAttribute('flashvars').match(new RegExp('(?:^|&)'.concat(name, '=(.+?)(?:&|$)')));
				if (match)
					return decodeURIComponent(match[1]);
			}
			// HTML5
			else {
				try {
					return unsafeWindow.yt.playerConfig.args[name];
				}
				catch (e) {}
			}

			return;
		},

		isAutoPlaying: function() {
			return (this.getArgument('autoplay') || '1') == 1;
		},

		// FIXME: Suppress random exception.
		seekTo: function() {
			try {
				this._element.seekTo.apply(this._element, arguments);
			}
			catch (e) {}
		},

		mute: function() {
			if (! this._muted++)
				this._element.mute();
		},

		unMute: function() {
			if (! --this._muted)
				this._element.unMute();
		}
	};

	return {
		UNSTARTED: -1,
		PLAYING: 1,
		PAUSED: 2,
		BUFFERING: 3,

		instance: function() {
			return instance;
		},

		create: function(element, callback) {
			if (instance._element === element)
				return;

			// The player overrides the default addEventListener method.
			DH.unwrap(HTMLElement).prototype.addEventListener.call(element, 'apiready', callback, false);

			instance = new Player(element);
		}
	};
})();

/*
 * Button class.
 */
var Button = (function() {
	var def = {
		node: {
			tag: 'button',
			style: {margin: '2px'},
			attributes: {type: 'button', 'class': 'yt-uix-button yt-uix-button-default yt-uix-tooltip'}
		},

		label: {
			tag: 'span',
			attributes: {'class': 'yt-uix-button-content'}
		},

		indicator: {
			tag: 'span',
			style: {fontSize: '14px', marginLeft: '5px'},
			attributes: {'class': 'yt-uix-button-content'},
			children: '-'
		}
	};

	function Button(labelText, tooltipText, callbacks) {
		var
			node = DH.build(def.node),
			label = DH.build(def.label),
			indicator = DH.build(def.indicator);

		DH.attributes(node, {title: tooltipText});
		DH.append(label, labelText);
		DH.append(node, [label, indicator]);

		DH.on(node, 'click', bind(this._onClick, this));

		this._node = node;
		this._indicator = indicator.firstChild;

		copy(callbacks, this);
	}

	Button.prototype = {
		_indicator: null,
		_node: null,

		_refresh: function() {
			this._indicator.data = this.refresh();
		},

		_onClick: function(event) {
			this.handler();
			this._refresh();
		},

		render: function() {
			this._refresh();
			return this._node;
		},

		handler: emptyFn,
		refresh: emptyFn
	};

	return Button;
})();

/*
 * PlayerOption class.
 */
var PlayerOption = (function() {
	var instances = [];

	function PlayerOption(configKey, overrides) {
		copy(overrides, this);

		this._configKey = configKey;

		instances.push(this);
	}

	PlayerOption.init = function(player) {
		this.prototype._player = player;
		each(instances, function(i, instance) { instance.init(); });
	};

	PlayerOption.prototype = {
		_player: null,

		get: function() {
			return Number(Config.get(this._configKey));
		},

		set: function(value) {
			Config.set(this._configKey, Number(value));
		},

		init: emptyFn,
		apply: emptyFn
	};

	return PlayerOption;
})();

/*
 * Prevent autoplaying.
 */
var AutoPlay = new PlayerOption('auto_play', {
	_applied: false,
	_focused: false,
	_muted: false,
	_timer: null,

	_states: ['ON', 'OFF', 'AUTO'],

	_step: function() {
		this.set((this.get() + 1) % 3);
	},

	_indicator: function() {
		return _(this._states[this.get()]);
	},

	_onFocus: function() {
		if (this._applied && ! this._focused) {
			this._timer = setTimeout(bind(function() {
				this._player.playVideo();

				this._focused = true;
				this._timer = null;
			}, this), 500);
		}
	},

	_onBlur: function() {
		if (this._timer !== null) {
			clearTimeout(this._timer);

			this._timer = null;
		}
	},

	init: function() {
		if (this._player.isAutoPlaying()) {
			switch (this.get()) {
				case 0: // ON
					this._applied = true;
					break;

				case 1: // OFF
					this._applied = false;
					break;

				case 2: // AUTO
					// Video opened in the same window.
					if (this._focused || unsafeWindow.history.length > 1) {
						this._applied = true;
					}
					// Video opened in a new window/tab.
					else {
						DH.on(unsafeWindow, 'focus', bind(this._onFocus, this));
						DH.on(unsafeWindow, 'blur', bind(this._onBlur, this));

						this._applied = false;
					}
					break;
			}
		}
		else
			this._applied = true;
	},

	apply: function() {
		if (! this._applied) {
			if (! this._muted) {
				this._player.mute();
				this._muted = true;
			}

			if (this._player.getPlayerState() == Player.PLAYING) {
				this._applied = true;

				this._player.seekTo(0, true);
				this._player.pauseVideo();

				this._player.unMute();
				this._muted = false;
			}
		}
	},

	createButton: function() {
		return new Button(_('Auto play'), _('Toggle video autoplay'), {
			handler: bind(this._step, this),
			refresh: bind(this._indicator, this)
		});
	}
});

/*
 * Set video quality.
 */
var VideoQuality = new PlayerOption('video_quality', {
	_applied: false,
	_muted: false,
	_buffered: false,

	_states: ['AUTO', 'LOW', 'MEDIUM', 'HIGH', 'HIGHEST'],

	_qualities: {highres: 5, hd1080: 4, hd720: 3, large: 2, medium: 1, small: 0},

	_step: function() {
		this.set((this.get() + 1) % 5);
	},

	_indicator: function() {
		return _(this._states[this.get()]);
	},

	init: function() {
		this._applied = ! this.get();
	},

	apply: function() {
		if (! this._applied) {
			if (! this._muted) {
				this._player.mute();
				this._muted = true;
			}

			if (this._player.getPlayerState() > Player.UNSTARTED) {
				var qualities = this._player.getAvailableQualityLevels(), quality;

				if (qualities.length) {
					this._applied = true;

					switch (this.get()) {
						case 1: // LOW
							quality = qualities.pop(); break;
						case 2: // MEDIUM
							while (this._qualities[quality = qualities.shift()] > this._qualities.large); break;
						case 3: // HIGH
							while (this._qualities[quality = qualities.shift()] > this._qualities.hd720); break;
						case 4: // HIGHEST
							quality = qualities.shift(); break;
						default:
							quality = null;
					}

					if (quality && quality != this._player.getPlaybackQuality()) {
						this._buffered = false;

						this._player.seekTo(0, true);
						this._player.setPlaybackQuality(quality);

						this.apply();

						return;
					}
				}
			}
			else
				return;

			this._player.unMute();
			this._muted = false;
		}
		else {
			switch (this._player.getPlayerState()) {
				case Player.BUFFERING:
					this._buffered = true;
					break;

				case Player.PLAYING:
					this._buffered = true;
					// no break;

				default:
					if (this._buffered && this._muted) {
						this._player.unMute();
						this._muted = false;
					}
			}
		}
	},

	createButton: function() {
		return new Button(_('Quality'), _('Set default video quality'), {
			handler: bind(this._step, this),
			refresh: bind(this._indicator, this)
		});
	}
});

/*
 * Set player size.
 */
var PlayerSize = new PlayerOption('player_size', {
	_states: ['AUTO', 'WIDE', 'FIT'],

	_step: function() {
		this.set((this.get() + 1) % 3);
	},

	_indicator: function() {
		return _(this._states[this.get()]);
	},

	apply: function() {
		switch (this.get()) {
			case 2: // FIT
				DH.append(document.body, {
					tag: 'style',
					attributes: {type: 'text/css'},
					children: [
						'#watch-video.medium #watch-player,',
						'#watch-video.large #watch-player {',
							'width: 970px !important;',
							'height: 575px !important;',
						'}'
					]
				});
				// no break;

			case 1: // WIDE
				// FIXME: Non API call.
				unsafeWindow.yt.net.cookies.set('wide', '1');

				DH.addClass(DH.id('page'), 'watch-wide');
				DH.addClass(DH.id('watch-video'), 'medium');
				break;

			default:
				return;
		}
	},

	createButton: function() {
		return new Button(_('Size'), _('Set default player size'), {
			handler: bind(this._step, this),
			refresh: bind(this._indicator, this)
		});
	}
});

/*
 * Player state change callback.
 */
unsafeWindow[Meta.ns].onPlayerStateChange = function() {
	AutoPlay.apply();
	VideoQuality.apply();
};

/*
 * Player ready callback.
 */
function onPlayerReady() {
	var element = DH.id('movie_player') || DH.id('movie_player-flash') || DH.id('movie_player-html5');

	if (element) {
		Player.create(DH.unwrap(element), function(e) {
			PlayerOption.init(e.player);

			AutoPlay.apply();
			VideoQuality.apply();

			e.player.addEventListener('onStateChange', Meta.ns + '.onPlayerStateChange');
		});
	}
}

each(['onYouTubePlayerReady', 'ytPlayerOnYouTubePlayerReady'], function(i, callback) {
	unsafeWindow[callback] = extendFn(unsafeWindow[callback], onPlayerReady);
});

onPlayerReady();

/*
 * Watch page.
 */
if (DH.id('watch-actions') !== null) {
	DH.insertAfter(DH.id('watch-flag'), [' ', {
		tag: 'button',
		style: {padding: '0 4px'},
		attributes: {id: 'yays_settings-button', type: 'button', role: 'button', 'class': 'yt-uix-button yt-uix-button-default yt-uix-tooltip yt-uix-tooltip-reverse yt-uix-button-empty', title: _('Player settings')},
		children: {
				tag: 'img',
				attributes: {src: 'data:image/png;base64,\
iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIklEQVQ4y6WSPUoEQRCFv5kdWVAT\
DyDGJkKnpuoZJu5IUFeMRPYCaiAbOIhGL94LGHkBEbQ1XMM1N3EVVvxJaoelmRFHX1TV7/WrrupK\
qIH3fh04sPRI0lWVLqMel8CMxavA7I8G3vsesAe8SpoD3qcMvkwzMqNTSbsAiRGbwDnN0JFUpJa0\
aI60vBhCuHHOvQEbv7zclXQCkHjv74FFYCES3QG5xX3ARfwLMMyAlZoquaRHm1EODCJ+HlhO+Scy\
4KGmhb5VnrQQYwQ8JVN7sA8cNxjiYfkL3vstoNfg5WvOuecQwvVkBh9/aP+zXAZJF0BhxFhSAoyn\
xPHZmaSiNDCTDpBKaldsZ8s0bdNsU7XCIYQyds7dAkvAENgJIQxiDcA3XBdfpD8Lv/UAAAAASUVO\
RK5CYII='}

		},
		listeners: {
			click: function() {
				var
					container = DH.id('watch-actions-area-container'),
					panel = DH.id('yays_settings-panel');

				function setVisible(node, visible) {
					DH[visible ? 'delClass' : 'addClass'](node, 'hid');
					DH.style(node, {display: visible ? 'block' : 'none'});
				}

				if (DH.hasClass(panel, 'hid') || DH.hasClass(container, 'hid')) {
					each(DH.id('watch-actions').getElementsByTagName('button'), function(i, action) {
						DH.delClass(action, 'active');
					});

					DH.addClass(DH.id('yays_settings-button'), 'active');

					each(DH.id('watch-actions-area').childNodes, function(i, node) {
						if (node.nodeType == 1 && DH.hasClass(node, 'watch-actions-panel')) {
							setVisible(node, false);
						}
					});

					setVisible(panel, true);
					setVisible(container, true);
				}
				else {
					DH.delClass(DH.id('yays_settings-button'), 'active');

					setVisible(container, false);
					setVisible(panel, false);
				}
			}
		}
	}]);

	DH.prepend(DH.id('watch-actions-area'), [{
		attributes: {id: 'yays_settings-panel', 'class': 'watch-actions-panel'},
		style: {position: 'relative'},
		children: [{
			tag: 'img',
			style: {position: 'absolute', top: '0', right: '10px', marginTop: '-3px', cursor: 'pointer'},
			attributes: {title: _('Help'), src: 'data:image/png;base64,\
iVBORw0KGgoAAAANSUhEUgAAAAcAAAAJCAYAAAD+WDajAAAAAXNSR0IArs4c6QAAAHVJREFUGNN9\
zT0OQVEUBODvPmIPotOq1OpTqEWlkYgN6MQCWITaCqjOoiQqKpr34lZvmpnMT6Zk5ggnbDDBE3cc\
hzjj4I8x9pg2mOOFJWZVaVE6lZkDXLFtrVtTNS9V8MCuDlctf7COiLc+1J/fTkdEgaZv+QMwqxX9\
qVmH8wAAAABJRU5ErkJggg=='},
			listeners: {click: function() { unsafeWindow.open(Meta.site); }}
		}, {
			style: {textAlign: 'center'},
			children: [
				VideoQuality.createButton().render(),
				PlayerSize.createButton().render(),
				AutoPlay.createButton().render()
			]
		}]
	}]);

	PlayerSize.apply();
}

} // YAYS

if (top === self) {
	if (typeof unsafeWindow != 'undefined') {
		YAYS(unsafeWindow);
	}
	else {
		var node = document.createElement('script');
		node.setAttribute('type', 'text/javascript');
		node.text = '('.concat(YAYS.toString(), ')(window);');

		document.body.appendChild(node);
		document.body.removeChild(node);
	}
}
