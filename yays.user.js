// ==UserScript==
// @name        Yays! (Yet Another Youtube Script)
// @namespace   youtube
// @description Control autoplaying and playback quality on YouTube.
// @version     1.5.8
// @author      eugenox_gmail_com
// @license     (CC) BY-SA-3.0 http://creativecommons.org/licenses/by-sa/3.0/
// @include     http*://*.youtube.com/*
// @include     http*://youtube.com/*
// @run-at      document-end
// @noframes
// @grant       GM_deleteValue
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @homepageURL http://eugenox.appspot.com/script/yays
// @updateURL   https://eugenox.appspot.com/blob/yays/yays.meta.js
// @downloadURL https://eugenox.appspot.com/blob/yays/yays.user.js
// ==/UserScript==

function YAYS(unsafeWindow) {

/*
 * Meta.
 */
var Meta = {
	title:       'Yays! (Yet Another Youtube Script)',
	version:     '1.5.8',
	releasedate: 'Sep 02, 2012',
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

function timeoutProxy(func) {
	return function() {
		setTimeout(bind(func, this, arguments), 0);
	};
}

function debug() {
	unsafeWindow.console.debug.apply(unsafeWindow.console, Array.prototype.concat.apply(['['.concat(Meta.ns, ']')], arguments));
}

/*
 * i18n
 */
var _ = (function() {
	var
	vocabulary = [
		'Auto play', 'ON', 'OFF', 'AUTO', 'Toggle video autoplay',
		'Quality', 'AUTO', 'ORIGINAL', 'Set default video quality',
		'Size', 'AUTO', 'WIDE', 'FIT', 'Set default player size',
		'Player settings', 'Help'
	],
	dictionary = combine(vocabulary, (function() {
		switch ((document.documentElement.lang || 'en').substr(0, 2)) {
			// hungarian - magyar
			case 'hu':
				return [
					'Automatikus lej\xE1tsz\xE1s', 'BE', 'KI', 'AUTO', 'Automatikus lej\xE1tsz\xE1s ki-be kapcsol\xE1sa',
					'Min\u0151s\xE9g', undefined, 'EREDETI', 'Vide\xF3k alap\xE9rtelmezett felbont\xE1sa',
					'M\xE9ret', undefined, 'SZ\xC9LES', 'ILLESZTETT', 'Lej\xE1tsz\xF3 alap\xE9rtelmezett m\xE9rete',
					'Lej\xE1tsz\xF3 be\xE1ll\xEDt\xE1sai', 'S\xFAg\xF3'
				];

			// dutch - nederlands (Mike-RaWare @userscripts.org)
			case 'nl':
				return [
					'Auto spelen', 'AAN', 'UIT', 'AUTOMATISCH', 'Stel automatisch afspelen in',
					'Kwaliteit', 'AUTOMATISCH', undefined, 'Stel standaard videokwaliteit in',
					undefined, undefined, undefined, undefined, undefined,
					undefined, undefined
				];

			// spanish - español (yonane @userscripts.org)
			case 'es':
				return [
					'Reproducci\xF3n Autom\xE1tica', undefined, undefined, 'AUTO', 'Modificar Reproducci\xF3n Autom\xE1tica',
					'Calidad', 'AUTO', undefined, 'Usar calidad por defecto',
					undefined, undefined, undefined, undefined, undefined,
					undefined, undefined
				];

			// german - deutsch (xemino @userscripts.org)
			case 'de':
				return [
					'Automatische Wiedergabe', 'AN', 'AUS', 'AUTO', 'Automatische Wiedergabe umschalten',
					'Qualit\xE4t', 'AUTO', undefined, 'Standard Video Qualit\xE4t setzen',
					undefined, undefined, undefined, undefined, undefined,
					undefined, undefined
				];

			// brazilian portuguese - português brasileiro (Pitukinha @userscripts.org)
			case 'pt':
				return [
					'Reprodu\xE7\xE3o Autom\xE1tica', 'LIGADO', 'DESLIGADO', 'AUTOM\xC1TICO', 'Modificar Reprodu\xE7\xE3o Autom\xE1tica',
					'Qualidade', 'AUTOM\xC1TICO', undefined, 'Defini\xE7\xE3o padr\xE3o de v\xEDdeo',
					undefined, undefined, undefined, undefined, undefined,
					'Configura\xE7\xE3o do usu\xE1rio', undefined
				];

			// greek - Έλληνες (TastyTeo @userscripts.org)
			case 'el':
				return [
					'\u0391\u03C5\u03C4\u03CC\u03BC\u03B1\u03C4\u03B7 \u03B1\u03BD\u03B1\u03C0\u03B1\u03C1\u03B1\u03B3\u03C9\u03B3\u03AE', '\u0395\u039D\u0395\u03A1\u0393\u039F', '\u0391\u039D\u0395\u039D\u0395\u03A1\u0393\u039F', '\u0391\u03A5\u03A4\u039F\u039C\u0391\u03A4\u0397', '\u0395\u03BD\u03B1\u03BB\u03BB\u03B1\u03B3\u03AE \u03B1\u03C5\u03C4\u03CC\u03BC\u03B1\u03C4\u03B7\u03C2 \u03B1\u03BD\u03B1\u03C0\u03B1\u03C1\u03B1\u03B3\u03C9\u03B3\u03AE\u03C2',
					'\u03A0\u03BF\u03B9\u03CC\u03C4\u03B7\u03C4\u03B1', '\u0391\u03A5\u03A4\u039F\u039C\u0391\u03A4\u0397', undefined, '\u039F\u03C1\u03B9\u03C3\u03BC\u03CC\u03C2 \u03C0\u03C1\u03BF\u03B5\u03C0\u03B9\u03BB\u03B5\u03B3\u03BC\u03AD\u03BD\u03B7\u03C2 \u03C0\u03BF\u03B9\u03CC\u03C4\u03B7\u03C4\u03B1\u03C2 \u03B2\u03AF\u03BD\u03C4\u03B5\u03BF',
					undefined, undefined, undefined, undefined, undefined,
					'\u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AD\u03C2 Player', undefined
				];

			// french - français (eXa @userscripts.org)
			case 'fr':
				return [
					'Lecture Auto', undefined, undefined, undefined, 'Lecture auto ON/OFF',
					'Qualit\xE9', undefined, undefined, 'Qualit\xE9 par d\xE9faut',
					undefined, undefined, undefined, undefined, undefined,
					'Option du lecteur', undefined
				];

			// slovenian - slovenščina (Paranoia.Com @userscripts.org)
			case 'sl':
				return [
					'Samodejno predvajanje', 'Vklju\u010Di', 'Izklju\u010Di', 'Samodejno', 'Vklop/izklop samodejnega predvajanja',
					'Kakovost', 'Samodejno', undefined, 'Nastavi privzeto kakovost videa',
					undefined, undefined, undefined, undefined, undefined,
					'Nastavitve predvajalnika', 'Pomo\u010D'
				];

			// russian - русский (an1k3y @userscripts.org)
			case 'ru':
				return [
					'\u0410\u0432\u0442\u043E \u0432\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435', '\u0412\u041A\u041B', '\u0412\u042B\u041A\u041B', '\u0410\u0412\u0422\u041E', '\u0410\u0432\u0442\u043E\u0437\u0430\u043F\u0443\u0441\u043A \u0432\u0438\u0434\u0435\u043E',
					'\u041A\u0430\u0447\u0435\u0441\u0442\u0432\u043E', '\u0410\u0412\u0422\u041E', undefined, '\u041A\u0430\u0447\u0435\u0441\u0442\u0432\u043E \u0432\u0438\u0434\u0435\u043E \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E',
					'\u0420\u0410\u0417\u041C\u0415\u0420', undefined, '\u0420\u0410\u0417\u0412\u0415\u0420\u041D\u0423\u0422\u042C', '\u0420\u0410\u0421\u0422\u042F\u041D\u0423\u0422\u042C', '\u0420\u0430\u0437\u043C\u0435\u0440 \u0432\u0438\u0434\u0435\u043E \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E',
					'\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043F\u043B\u0435\u0435\u0440\u0430', '\u041F\u043E\u043C\u043E\u0449\u044C'
				];

			// hebrew - עברית (baryoni @userscripts.org)
			case 'iw':
				return [
					'\u05D4\u05E4\u05E2\u05DC\u05D4 \u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9\u05EA', '\u05E4\u05E2\u05D9\u05DC', '\u05DB\u05D1\u05D5\u05D9', '\u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9', '\u05E9\u05E0\u05D4 \u05DE\u05E6\u05D1 \u05D4\u05E4\u05E2\u05DC\u05D4 \u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9\u05EA \u05E9\u05DC \u05D4\u05D5\u05D9\u05D3\u05D0\u05D5',
					'\u05D0\u05D9\u05DB\u05D5\u05EA', '\u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9\u05EA', undefined, '\u05D4\u05D2\u05D3\u05E8 \u05D0\u05EA \u05D0\u05D9\u05DB\u05D5\u05EA \u05D1\u05E8\u05D9\u05E8\u05EA \u05D4\u05DE\u05D7\u05D3\u05DC \u05E9\u05DC \u05D4\u05D5\u05D9\u05D3\u05D0\u05D5',
					'\u05D2\u05D5\u05D3\u05DC', undefined, '\u05E8\u05D7\u05D1', '\u05DE\u05DC\u05D0', '\u05D4\u05D2\u05D3\u05E8 \u05D0\u05EA \u05D2\u05D5\u05D3\u05DC \u05D1\u05E8\u05D9\u05E8\u05EA \u05D4\u05DE\u05D7\u05D3\u05DC \u05E9\u05DC \u05D4\u05E0\u05D2\u05DF',
					'\u05D4\u05D2\u05D3\u05E8\u05D5\u05EA \u05E0\u05D2\u05DF', '\u05E2\u05D6\u05E8\u05D4'
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
	ELEMENT_NODE: 1,

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
	},

	walk: function(node, path) {
		var steps = path.split('/'), step = null;

		while (node && (step = steps.shift())) {
			if (step == '..') {
				node = node.parentNode;
				continue;
			}

			var
				selector = /^(\w*)(?:\[(\d+)\])?$/.exec(step),
				name = selector[1],
				index = Number(selector[2]) || 0;

			for (var i = 0, j = 0, nodes = node.childNodes; node = nodes.item(i); ++i)
				if (node.nodeType == this.ELEMENT_NODE && (! name || node.tagName.toLowerCase() == name) && j++ == index)
					break;
		}

		return node;
	}
};

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
	function Player(element) {
		this._element = element;
		this._boot();
	}

	Player.prototype = {
		_element: null,
		_muted: 0,

		_onReady: emptyFn,

		_boot: function() {
			if (typeof this._element.getApiInterface == 'function') {
				this._exportApiInterface();
				this._onApiReady();
			}
			else
				setTimeout(bind(this._boot, this), 10);
		},

		_exportApiInterface: function() {
			each(this._element.getApiInterface(), function(i, method) {
				if (! Player.prototype.hasOwnProperty(method))
					this[method] = bind(this._element[method], this._element);
			}, this);
		},

		_onApiReady: function() {
			this._muted = Number(this.isMuted());

			// The player sometimes reports inconsistent state.
			if (this.isAutoPlaying())
				this.resetState();

			this._onReady(this);
			this._onReady = null;
		},

		onReady: function(callback) {
			if (this._onReady)
				this._onReady = callback;
			else
				callback(this);
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

		// Suppressing random exception.
		seekTo: function() {
			try {
				this._element.seekTo.apply(this._element, arguments);
			}
			catch (e) {}
		},

		// Seek to the beginning of the video considering deep-links.
		seekToStart: function(ahead) {
			var
				code = (location.hash + location.search).match(/\bt=(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/) || new Array(4),
				seconds = (Number(code[1]) || 0) * 3600 + (Number(code[2]) || 0) * 60 + (Number(code[3]) || 0);

			this.seekTo(seconds, ahead);
		},

		// This hack resets some aspects of the player.
		resetState: function() {
			this.seekTo(this.getCurrentTime(), true);
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

	var instance = {
		_element: null
	};

	return {
		UNSTARTED: -1,
		ENDED: 0,
		PLAYING: 1,
		PAUSED: 2,
		BUFFERING: 3,

		instance: function() {
			return instance;
		},

		initialize: function(element) {
			if (instance._element === element)
				throw 'Player already initialized';

			return instance = new Player(element);
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

		_onClick: function() {
			this.handler();
			this.refresh();
		},

		refresh: function() {
			this._indicator.data = this.display();
		},

		render: function() {
			this.refresh();
			return this._node;
		},

		handler: emptyFn,
		display: emptyFn
	};

	return Button;
})();

/*
 * PlayerOption class.
 */
function PlayerOption(key, overrides) {
	copy(overrides, this);

	this._key = key;
}

PlayerOption.prototype = {
	_player: null,
	_key: null,

	label: null,
	tooltip: null,
	states: [],

	_step: function() {
		this.set((this.get() + 1) % this.states.length);
	},

	_indicator: function() {
		return _(this.states[this.get()]);
	},

	get: function() {
		return Number(Config.get(this._key) || 0);
	},

	set: function(value) {
		Config.set(this._key, Number(value));
	},

	button: function() {
		return new Button(_(this.label), _(this.tooltip), {
			handler: bind(this._step, this),
			display: bind(this._indicator, this)
		});
	},

	init: function(player) {
		this._player = player;

		this.configure();
	},

	configure: emptyFn,
	apply: emptyFn
};

/*
 * Prevent autoplaying.
 */
var AutoPlay = new PlayerOption('auto_play', {
	_applied: false,
	_focused: false,
	_muted: false,
	_player: null,
	_timer: null,

	label: 'Auto play',
	tooltip: 'Toggle video autoplay',
	states: ['ON', 'OFF', 'AUTO'],

	_onFocus: function() {
		if (this._applied && ! this._focused) {
			this._timer = setTimeout(bind(function() {
				this._player.resetState();
				this._player.playVideo();

				debug('Playback autostarted');

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

	// @see http://www.w3.org/TR/page-visibility/
	_isVisible: function() {
		var doc = unsafeWindow.document;
		return doc.hidden === false || doc.mozHidden === false || doc.webkitHidden === false;
	},

	configure: function() {
		if (this._player.isAutoPlaying()) {
			switch (this.get()) {
				case 0: // ON
					this._applied = true;
					break;

				case 1: // OFF
					this._applied = false;
					break;

				case 2: // AUTO
					// Video is visible or opened in the same window.
					if (this._focused || this._isVisible() || unsafeWindow.history.length > 1) {
						this._applied = true;
					}
					// Video is opened in a background tab.
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

				this._player.seekToStart(true);
				this._player.pauseVideo();

				debug('Playback paused');

				this._player.unMute();
				this._muted = false;
			}
		}
		else {
			if (this._player.getPlayerState() == Player.PLAYING)
				this._focused = true;
		}
	}
});

/*
 * Set video quality.
 */
var VideoQuality = new PlayerOption('video_quality', {
	_applied: false,
	_muted: false,
	_buffered: false,
	_player: null,

	_qualities: [, 'small', 'medium', 'large', 'hd720', 'hd1080', 'highres'],

	label: 'Quality',
	tooltip: 'Set default video quality',
	states: ['AUTO', '240p', '360p', '480p', '720p', '1080p', 'ORIGINAL'],

	configure: function() {
		this._applied = ! this.get();
	},

	apply: function() {
		if (! this._applied) {
			if (! this._muted) {
				this._player.mute();
				this._muted = true;
			}

			if (this._player.getPlayerState() > Player.UNSTARTED) {
				if (this._player.getAvailableQualityLevels().length) {
					this._applied = true;

					var quality = this._qualities[this.get()];

					if (quality && quality != this._player.getPlaybackQuality()) {
						this._buffered = false;

						this._player.seekToStart(true);
						this._player.setPlaybackQuality(quality);

						debug('Quality changed to', quality);

						// Sometimes buffering event doesn't occur after the quality has changed.
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
	}
});

/*
 * Set player size.
 */
var PlayerSize = new PlayerOption('player_size', {
	label: 'Size',
	tooltip: 'Set default player size',
	states: ['AUTO', 'WIDE', 'FIT'],

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
	}
});

/*
 * Abstract UI class.
 */
var UI = copy({
	setVisible: function(node, visible) {
		DH[visible ? 'delClass' : 'addClass'](node, 'hid');
		DH.style(node, {display: visible ? 'block' : 'none'});
	}
}, function() {});

UI.prototype = {
	_def: {
		button: function(click) {
			return {
				tag: 'button',
				style: {padding: '0 4px'},
				attributes: {type: 'button', role: 'button', 'class': 'yt-uix-button yt-uix-button-default yt-uix-tooltip yt-uix-tooltip-reverse yt-uix-button-empty', title: _('Player settings')},
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
				listeners: {click: click}
			};
		},
		panel: function(buttons) {
			return [{
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
				children: map(bind(Button.prototype.render.call, Button.prototype.render), buttons)
			}];
		}
	},

	buttons: null,
	button: null,
	panel: null,

	initialize: function() {
		this.button = this._def.button(bind(this.toggle, this));
		this.panel = this._def.panel(this.buttons);
	},

	refresh: function() {
		each(this.buttons, function(i, button) { button.refresh(); });
	},

	toggle: emptyFn
};

/*
 * WatchUI class.
 */
function WatchUI() {
	this.buttons = [
		VideoQuality.button(),
		PlayerSize.button(),
		AutoPlay.button()
	];

	this.initialize();

	this.button = DH.build(this.button);

	this.panel = DH.build({
		attributes: {'class': 'watch-actions-panel'},
		style: {position: 'relative'},
		children: this.panel
	});

	DH.insertAfter(DH.id('watch-flag'), [' ', this.button]);
	DH.prepend(DH.id('watch-actions-area'), this.panel);

	PlayerSize.apply();
}

WatchUI.prototype = copy({
	toggle: function() {
		var container = DH.id('watch-actions-area-container');

		if (DH.hasClass(this.panel, 'hid') || DH.hasClass(container, 'hid')) {
			each(DH.id('watch-actions').getElementsByTagName('button'), function(i, button) {
				DH.delClass(button, 'active');
			});

			DH.addClass(this.button, 'active');

			each(DH.id('watch-actions-area').childNodes, function(i, node) {
				if (node.nodeType == DH.ELEMENT_NODE && DH.hasClass(node, 'watch-actions-panel'))
					UI.setVisible(node, false);
			});

			this.refresh();

			UI.setVisible(this.panel, true);
			UI.setVisible(container, true);
		}
		else {
			DH.delClass(this.button, 'active');

			UI.setVisible(container, false);
			UI.setVisible(this.panel, false);
		}
	}
}, new UI());


/*
 * ChannelUI class.
 */
function ChannelUI() {
	this.buttons = [
		VideoQuality.button(),
		AutoPlay.button()
	];

	this.initialize();

	this.button = DH.build(this.button);

	this.panel = DH.build({
		attributes: {'class': 'hid'},
		style: {display: 'none', marginTop: '7px'},
		children: [{
			tag: 'h3',
			children: _('Player settings')
		}, {
			style: {position: 'relative'},
			children: this.panel
		}]
	});

	DH.append(DH.walk(DH.id('flag-video-panel'), '../h3/div'), [' ', this.button]);
	DH.insertAfter(DH.id('flag-video-panel'), this.panel);
}

ChannelUI.prototype = copy({
	toggle: function() {
		if (DH.hasClass(this.panel, 'hid')) {
			each(this.panel.parentNode.childNodes, function(i, node) {
				if (node.nodeType == DH.ELEMENT_NODE && node.tagName.toLowerCase() == 'div')
					UI.setVisible(node, false);
			});

			this.refresh();

			UI.setVisible(this.panel, true);
		}
		else {
			UI.setVisible(this.panel, false);
		}
	}
}, new UI());

/*
 * Player state change callback.
 */
unsafeWindow[Meta.ns].onPlayerStateChange = timeoutProxy(function(state) {
	debug('State changed to', ['unstarted', 'ended', 'playing', 'paused', 'buffering'][state + 1]);

	AutoPlay.apply();
	VideoQuality.apply();
});

/*
 * Player ready callback.
 */
var onPlayerReady = timeoutProxy(function() {
	var element = DH.id('movie_player') || DH.id('movie_player-flash') || DH.id('movie_player-html5');

	if (element) {
		try {
			Player.initialize(DH.unwrap(element)).onReady(function(player) {
				debug('Player ready');

				each([AutoPlay, VideoQuality, PlayerSize], function(i, option) {
					option.init(player);
				});

				AutoPlay.apply();
				VideoQuality.apply();

				player.addEventListener('onStateChange', Meta.ns + '.onPlayerStateChange');
			});
		}
		catch (e) {
			debug(e);
		}
	}
});

each(['onYouTubePlayerReady', 'ytPlayerOnYouTubePlayerReady'], function(i, callback) {
	unsafeWindow[callback] = extendFn(unsafeWindow[callback], onPlayerReady);
});

onPlayerReady();

var page = DH.id('page');
if (page) {
	switch (true) {
		case DH.hasClass(page, 'watch'):
			new WatchUI();
			break;

		case DH.hasClass(page, 'channel'):
			new ChannelUI();
			break;
	}
}

} // YAYS

if (window.top === window.self) {
	if (this['unsafeWindow']) { // Greasemonkey.
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
