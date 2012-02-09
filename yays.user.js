// ==UserScript==
// @name        Yays! (Yet Another Youtube Script)
// @description Control autoplaying and playback quality on YouTube.
// @version     1.5.4
// @author      eugenox_gmail_com
// @license     (CC) BY-SA-3.0 http://creativecommons.org/licenses/by-sa/3.0/
// @namespace   youtube
// @include     http*://*.youtube.com/*
// @include     http*://youtube.com/*
// @run-at      document-end
// ==/UserScript==

function YAYS(unsafeWindow) {

/*
 * Meta data.
 */
var Meta = {
	title:       'Yays! (Yet Another Youtube Script)',
	version:     '1.5.4',
	releasedate: 'Dec 24, 2011',
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
function each(callback, iterable, scope) {
	if (iterable.length) {
		for (var i = 0; i < iterable.length; i++)
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

		for (; i < len; i++)
			buffer.push(callback.apply(null, map(getter, args)));
	}
	else {
		for (var i = 0, arg = args[0], len = arg.length; i < len; i++)
			buffer.push(callback(arg[i]));
	}

	return buffer;
}

function combine(keys, values) {
	var object = {};
	map(function(key, value) { object[key] = value; }, keys, values);

	return object;
}

function bind(func, scope) {
	return function() { return func.apply(scope, arguments); };
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
		try {
			func.apply(this, arguments);
		}
		catch (ex) {}

		extension.apply(this, arguments);
	};
}

function emptyFn() { return; };

function buildURL(path, parameters) {
	var query = [];
	each(function(key, value) { query.push(key.concat('=', encodeURIComponent(value))); }, parameters);

	return path.concat('?', query.join('&'));
}

function parseJSON(data) {
	if (typeof JSON != 'undefined')
		return JSON.parse(data);

	return eval('('.concat(data, ')'));
}

function debug() {
	unsafeWindow.console.debug.apply(unsafeWindow.console, arguments);
}

/*
 * i18n
 */
var _ = (function() {
	var
	vocabulary = [
		'Auto play', 'ON', 'OFF', 'AUTO \u03B2', 'Toggle video autoplay',
		'Quality', 'AUTO', 'LOW', 'MEDIUM', 'HIGH', 'HIGHEST', 'Set default video quality',
		'Size', 'WIDE', 'FIT', 'Set default player size',
		'Settings', 'Player settings', 'Help'
	],
	dictionary = combine(vocabulary, (function() {
		switch ((document.documentElement.lang || 'en').substr(0, 2)) {
			// hungarian - magyar
			case 'hu':
				return [
					'Automatikus lej\xE1tsz\xE1s', 'BE', 'KI', 'AUTO \u03B2', 'Automatikus lej\xE1tsz\xE1s ki-, bekapcsol\xE1sa',
					'Min\u0151s\xE9g', 'AUTO', 'ALACSONY', 'K\xD6ZEPES', 'MAGAS', 'LEGMAGASABB', 'Vide\xF3k alap\xE9rtelmezett felbont\xE1sa',
					'M\xE9ret', 'SZ\xC9LES', 'SZ\xC9LESEBB', 'Lej\xE1tsz\xF3 alap\xE9rtelmezett m\xE9rete',
					'Be\xE1ll\xEDt\xE1sok', 'Lej\xE1tsz\xF3 be\xE1ll\xEDt\xE1sai', 'S\xFAg\xF3'
				];

			// dutch - nederlands (Mike-RaWare @userscripts.org)
			case 'nl':
				return [
					'Auto spelen', 'AAN', 'UIT', 'AUTOMATISCH \u03B2', 'Stel automatisch afspelen in',
					'Kwaliteit', 'AUTOMATISCH', 'LAAG', 'GEMIDDELD', 'HOOG', undefined, 'Stel standaard videokwaliteit in',
					undefined, undefined, undefined, undefined,
					undefined, undefined, undefined
				];

			// spanish - español (yonane @userscripts.org)
			case 'es':
				return [
					'Reproducci\xF3n Autom\xE1tica', undefined, undefined, 'AUTO \u03B2', 'Modificar Reproducci\xF3n Autom\xE1tica',
					'Calidad', 'AUTO', 'BAJA', 'MEDIA', 'ALTA', undefined, 'Usar calidad por defecto',
					undefined, undefined, undefined, undefined,
					undefined, undefined, undefined
				];

			// german - deutsch (xemino @userscripts.org)
			case 'de':
				return [
					'Automatische Wiedergabe', 'AN', 'AUS', 'AUTO \u03B2', 'Automatische Wiedergabe umschalten',
					'Qualit\xE4t', 'AUTO', 'NIEDRIG', 'MITTEL', 'HOCH', undefined, 'Standard Video Qualit\xE4t setzen',
					undefined, undefined, undefined, undefined,
					undefined, undefined, undefined
				];

			// brazilian portuguese - português brasileiro (Pitukinha @userscripts.org)
			case 'pt':
				return [
					'Reprodu\xE7\xE3o Autom\xE1tica', 'LIGADO', 'DESLIGADO', 'AUTOM\xC1TICO \u03B2', 'Modificar Reprodu\xE7\xE3o Autom\xE1tica',
					'Qualidade', 'AUTOM\xC1TICO', 'BAIXA', 'M\xC9DIO', 'BOA', undefined, 'Defini\xE7\xE3o padr\xE3o de v\xEDdeo',
					undefined, undefined, undefined, undefined,
					'Configura\xE7\xF5es', 'Configura\xE7\xE3o do usu\xE1rio', undefined
				];

			// greek - Έλληνες (TastyTeo @userscripts.org)
			case 'el':
				return [
					'\u0391\u03C5\u03C4\u03CC\u03BC\u03B1\u03C4\u03B7 \u03B1\u03BD\u03B1\u03C0\u03B1\u03C1\u03B1\u03B3\u03C9\u03B3\u03AE', '\u0395\u039D\u0395\u03A1\u0393\u039F', '\u0391\u039D\u0395\u039D\u0395\u03A1\u0393\u039F', '\u0391\u03A5\u03A4\u039F\u039C\u0391\u03A4\u0397 \u03B2', '\u0395\u03BD\u03B1\u03BB\u03BB\u03B1\u03B3\u03AE \u03B1\u03C5\u03C4\u03CC\u03BC\u03B1\u03C4\u03B7\u03C2 \u03B1\u03BD\u03B1\u03C0\u03B1\u03C1\u03B1\u03B3\u03C9\u03B3\u03AE\u03C2',
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

				var node = this.element(def.tag);

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
				return this.textNode(def);

			default:
				return def;
		}
	},

	id: bind(unsafeWindow.document.getElementById, unsafeWindow.document),
	element: bind(unsafeWindow.document.createElement, unsafeWindow.document),
	textNode: bind(unsafeWindow.document.createTextNode, unsafeWindow.document),

	style: function(node, style) {
		copy(style, node.style);
	},

	append: function(node, children) {
		each(function(i, child) { node.appendChild(this.build(child)); }, [].concat(children), this);
		node.normalize();
	},

	insertAfter: function(node, children) {
		var parent = node.parentNode, sibling = node.nextSibling;
		if (sibling) {
			each(function(i, child) { parent.insertBefore(this.build(child), sibling); }, [].concat(children), this);
			parent.normalize();
		}
		else {
			this.append(parent, children);
		}
	},

	prepend: function(node, children) {
		if (node.hasChildNodes()) {
			var firstChild = node.firstChild;
			each(function(i, child) { node.insertBefore(this.build(child), firstChild); }, [].concat(children), this);
		}
		else {
			this.append(node, children);
		}
	},

	content: function(node, children) {
		if (node.hasChildNodes()) {
			var child;
			while (child = node.firstChild) node.removeChild(child);
		}

		this.append(node, children);
	},

	attributes: function(node, attributes) {
		each(node.setAttribute, attributes, node);
	},

	hasClass: function(node, clss) {
		return node.hasAttribute('class') && node.getAttribute('class').indexOf(clss) != -1;
	},

	addClass: function(node, clss) {
		if (! this.hasClass(node, clss)) {
			node.setAttribute('class', (node.getAttribute('class') || '').concat(' ', clss));
		}
	},

	delClass: function(node, clss) {
		if (this.hasClass(node, clss)) {
			node.setAttribute('class', node.getAttribute('class').replace(new RegExp('\\s*'.concat(clss, '\\s*'), 'g'), ' '));
		}
	},

	listeners: function(node, listeners) {
		each(function(type, listener) { this.on(node, type, listener); }, listeners, this);
	},

	on: function(node, type, listener) {
		node.addEventListener(type, listener, false);
	},

	un: function(node, type, listener) {
		node.removeEventListener(type, listener, false);
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
	var Impl;

	// Greasemonkey XHR
	if (typeof GM_xmlhttpRequest == 'function') {
		Impl = function() {};

		Impl.prototype = {
			_doRequest: function(url, parameters, callback) {
				this._callback = callback;

				GM_xmlhttpRequest({
					method: 'GET',
					url: buildURL(url, parameters),
					onload: bind(this._onLoad, this)
				});
			},

			_onLoad: function(response) {
				this._callback(parseJSON(response.responseText));
			}
		};
	}
	// Script tag
	else {
		Impl = (function() {
			var requests = [], requestsNs = 'jsonp', Impl = function() {};

			Impl.prototype = {
				_callback: null,
				_id: null,
				_scriptNode: null,

				_doRequest: function(url, parameters, callback) {
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
				},

				_onLoad: function(response) {
					this._callback(response);

					document.body.removeChild(this._scriptNode);
					delete requests[this._id];
				}
			};

			unsafeWindow[namespace][requestsNs] = requests;

			return Impl;
		})();
	}

	function Request(url, parameters, callback) {
		this._doRequest(url, parameters, callback);
	}

	Request.prototype = new Impl();

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
				style: {color: '#a0a0a0', marginBottom: '5px', textAlign: 'center'},
				children: 'UserScript update notification.'
			}, {
				style: {marginBottom: '5px'},
				children: ['You are using version ', {tag: 'strong', children: Meta.version}, ', released on ', {tag: 'em', children: Meta.releasedate}, '.', {tag: 'br'}, 'Please update to the newest version.']
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
 * Button class.
 */
var Button = (function() {
	var def = {
		node: {
			tag: 'button',
			style: {margin: '0 0 0 5px'},
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
		each(function(i, instance) { instance.init(); }, instances);
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
	_timer: null,

	_states: ['ON', 'OFF', 'AUTO \u03B2'],

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
	},

	apply: function() {
		if (! this._applied && this._player.getPlayerState() == 1) {
			this._player.pauseVideo();

			try {
				this._player.seekTo(0, false);
			}
			catch (ex) {}

			this._applied = true;
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
		if (! this._applied && this._player.getPlayerState() == 2) {
			var qualities = this._player.getAvailableQualityLevels(), quality = null;

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
					return;
			}

			setTimeout(bind(function() {
				this._player.setPlaybackQuality(quality);
			}, this), 1);
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
						'#watch-video.medium #watch-player {',
							'width: 970px !important;',
							'height: 575px !important;',
						'}'
					]
				});
				// no break;

			case 1: // WIDE
				DH.addClass(DH.id('watch-video'), 'medium');
				DH.addClass(DH.id('page'), 'watch-wide');
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
	var player = DH.id('movie_player') || DH.id('movie_player-flash') || DH.id('video-player');

	if (player) {
		// Unwrap the player object
		if (typeof XPCNativeWrapper != 'undefined' && typeof XPCNativeWrapper.unwrap == 'function') {
			player = XPCNativeWrapper.unwrap(player);
		}

		if (typeof player.getPlayerState == 'function') {
			PlayerOption.init(player);

			AutoPlay.apply();
			VideoQuality.apply();

			player.addEventListener('onStateChange', Meta.ns + '.onPlayerStateChange');
		}
	}
}

unsafeWindow.onYouTubePlayerReady = extendFn(unsafeWindow.onYouTubePlayerReady, onPlayerReady);
unsafeWindow.onChannelPlayerReady = extendFn(unsafeWindow.onChannelPlayerReady, onPlayerReady);
onPlayerReady();

/*
 * Per-site
 *
 * Watch page.
 */
if (DH.id('watch-actions') !== null) {
	DH.insertAfter(DH.id('watch-flag'), {
		tag: 'button',
		style: {marginLeft: '3px', padding: '0 4px'},
		attributes: {id: 'yays_settings-button', type: 'button', 'class': 'yt-uix-button yt-uix-button-default yt-uix-tooltip yt-uix-tooltip-reverse', title: _('Player settings')},
		children: {
				tag: 'img',
				attributes: {src: 'data:image/png;base64,\
iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAASRJREFUOMul\
kj1KBEEQhb+ZHVlQEw8gxp0IpqbqBTrZIwjqipHIXkANZAMH0SNs8kIjLyCCoknDGq65iauw4k9S\
OwzNjDj6oqp+r191VVdCDbz368CBpUeSrqp0GfW4BGYsXgVmfzTw3veBPeBV0hzwXjL4Ms3YjE4l\
7QIkRmwC5zRDV1KeWtKiOdLiYgjhxjn3Bmz88nJP0glA4r2/BxaBhUh0B3QsHgArEf8CjDJguaZK\
R9KjzagDDCN+HnAp/0QGPNS0MLDK0xZijIGnpLQH+8BxgyEeFr/gvd8C+g1evuacew4hXE9n8PGH\
9j+LZZB0AeRGTCQlwKQkjs/OJOWFgZl0gVRSu2I7W6Zpm2abqhUOIRSxc+4WWAJGwE4IYRhrAL4B\
csFg0+JttI0AAAAASUVORK5CYII='}
		},
		listeners: {
			click: function() {
				var
					container = DH.id('watch-actions-area-container'),
					panel = DH.id('yays_settings-panel');

				function isHidden(node) {
					return node.nodeType != 1 || DH.hasClass(node, 'hid');
				}

				if (isHidden(panel) || isHidden(container)) {
					DH.delClass(container, 'hid');
					container.style.display = 'block';

					each(function(i, node) {
						! isHidden(node) && DH.hasClass(node, 'watch-actions-panel') && DH.addClass(node, 'hid');
					}, DH.id('watch-actions-area').childNodes);

					DH.delClass(panel, 'hid');
					panel.style.display = 'block';
				}
				else {
					DH.addClass(container, 'hid');
					container.style.display = 'none';

					DH.addClass(panel, 'hid');
					panel.style.display = 'none';
				}
			}
		}
	});

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
/*
 * Legacy channel page.
 */
else if (DH.id('playnav-video-details') !== null) {
	// Create and append tab
	DH.append(DH.id('playnav-bottom-links-clip').getElementsByTagName('tr')[0], {
		tag: 'td',
		attributes: {id: 'playnav-panel-tab-yays_settings'},
		children: {
			tag: 'table',
			attributes: {'class': 'panel-tabs'},
			children: [{
				tag: 'tr',
				children: {
					tag: 'td',
					attributes: {'class': 'panel-tab-title-cell'},
					children: [{
						attributes: {'class': 'playnav-panel-tab-icon'},
						style: {marginTop: '2px', height: '10px', backgroundImage: 'url(data:image/png;base64,\
iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKAQMAAAC3/F3+AAAAAXNSR0IArs4c6QAAAAZQTFRFAAAA\
zMzMyE/AMgAAAAF0Uk5TAEDm2GYAAAAgSURBVAjXY+BhYMhtYKhvYLBnYPh8AISADCAXKMjDAAB1\
9AfV9jsohwAAAABJRU5ErkJggg=='}
					}, {
						attributes: {'class': 'playnav-bottom-link'},
						children: {
							tag: 'a',
							attributes: {href: 'javascript:;', title: _('Player settings')},
							children: _('Settings'),
							listeners: {
								mousedown: function() {
									each(function(i, node) {
										var panelName = (new RegExp('^playnav-panel-tab-(\\w+)').exec(node.getAttribute('id') || '') || [, null])[1];
										if (panelName) {
											DH.delClass(node, 'panel-tab-selected');
											DH.id('playnav-panel-' + panelName).style.display = 'none';
										}
									}, DH.id('playnav-bottom-links-clip').getElementsByTagName('td'));

									DH.addClass(DH.id('playnav-panel-tab-yays_settings'), 'panel-tab-selected');
									DH.id('playnav-panel-yays_settings').style.display = 'block';
								}
							}
						}
					}, {
						attributes: {'class': 'spacer'}
					}]
				}
			}, {
				tag: 'tr',
				children: {
					tag: 'td',
					attributes: {'class': 'panel-tab-indicator-cell inner-box-opacity'},
					children: {
						attributes: {'class': 'panel-tab-indicator-arrow'}
					}
				}
			}]
		}
	});

	// Hide when other tab clicked.
	unsafeWindow.playnav.selectPanel = extendFn(unsafeWindow.playnav.selectPanel, function() {
		DH.id('playnav-panel-tab-yays_settings').setAttribute('class', '');
		DH.id('playnav-panel-yays_settings').style.display = 'none';
	});

	// Create and append panel.
	DH.append(DH.id('playnav-video-panel-inner'), {
		attributes: {id: 'playnav-panel-yays_settings', 'class': 'hid'},
		children: {
			children: [{
				tag: 'strong',
				children: _('Player settings')
			}, {
				style: {textAlign: 'center', marginTop: '5px'},
				children: [
					VideoQuality.createButton().render(),
					AutoPlay.createButton().render()
				]
			}]
		}
	});
}

} // YAYS

// Firefox
if (new RegExp('Firefox/\\d', 'i').test(navigator.userAgent)) {
	YAYS(unsafeWindow);
}
// Chrome, Opera, Safari
else {
	var node = document.createElement('script');
	node.setAttribute('type', 'text/javascript');
	node.text = '('.concat(YAYS.toString(), ')(window);');

	document.body.appendChild(node);
	document.body.removeChild(node);
}
