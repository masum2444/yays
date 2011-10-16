// ==UserScript==
// @name        Yays! (Yet Another Youtube Script)
// @description Control autoplaying and playback quality on YouTube.
// @version     1.5.3
// @author      eugenox_gmail_com
// @license     (CC) BY-SA-3.0 http://creativecommons.org/licenses/by-sa/3.0/
// @namespace   youtube
// @include     http://*.youtube.*/*
// @include     https://*.youtube.*/*
// @include     http://youtube.*/*
// @include     https://youtube.*/*
// @run-at      document-end
// ==/UserScript==

function YAYS(unsafeWindow) {

/*
 * Meta data
 */
var Meta = {
	title:       'Yays! (Yet Another Youtube Script)',
	version:     '1.5.3',
	releasedate: 'Oct 16, 2011',
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
	var args = Array.prototype.constructor.apply([], arguments), callback = args.shift() || bind(Array.prototype.constructor, []), buffer = [];

	if (args.length > 1) {
		var len = Math.max.apply(Math, map(function(arg) { return arg.length; }, args)), getter = function(arg) { return arg[i]; };

		for (var i = 0; i < len; i++)
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
	for (var key in src) target[key] = src[key];
	return target;
}

function extendFn(func, extension) {
	if (! func) return extension;

	return function() {
		try {
			func.apply(this, arguments);
		}
		catch (ex) { }

		extension.apply(this, arguments);
	};
}

function emptyFn() { return; };

function buildURL(base, parameters) {
	var queryParams = [];
	each(function(key, value) { queryParams.push(key.concat('=', encodeURIComponent(value))); }, parameters);

	return base.concat('?', queryParams.join('&'));
}

function debug() {
	unsafeWindow.console.debug.apply(unsafeWindow.console, arguments);
}

/*
 * i18n
 */
function _(text) {
	return _.dictionary[text] || text;
}

_.dictionary = (function() {
	var vocabulary = [
		'Auto play', 'ON', 'OFF', 'AUTO \u03B2', 'Toggle video autoplay',
		'Quality', 'AUTO', 'LOW', 'MEDIUM', 'HIGH', 'HIGHEST', 'Set default video quality',
		'Settings', 'Player settings', 'Help'
	];

	switch ((document.documentElement.lang || 'en').substr(0, 2)) {
		// hungarian - magyar
		case 'hu':
			return combine(vocabulary, [
				'Automatikus lej\xE1tsz\xE1s', 'BE', 'KI', 'AUTO \u03B2', 'Automatikus lej\xE1tsz\xE1s ki-, bekapcsol\xE1sa',
				'Min\u0151s\xE9g', 'AUTO', 'ALACSONY', 'K\xD6ZEPES', 'MAGAS', 'LEGMAGASABB', 'Vide\xF3k alap\xE9rtelmezett felbont\xE1sa',
				'Be\xE1ll\xEDt\xE1sok', 'Lej\xE1tsz\xF3 be\xE1ll\xEDt\xE1sai', 'S\xFAg\xF3'
			]);

		// dutch - nederlands (Mike-RaWare @userscripts.org)
		case 'nl':
			return combine(vocabulary, [
				'Auto spelen', 'AAN', 'UIT', 'AUTOMATISCH \u03B2', 'Stel automatisch afspelen in',
				'Kwaliteit', 'AUTOMATISCH', 'LAAG', 'GEMIDDELD', 'HOOG', undefined, 'Stel standaard videokwaliteit in',
				undefined, undefined, undefined
			]);

		// spanish - español (yonane @userscripts.org)
		case 'es':
			return combine(vocabulary, [
				'Reproducci\xF3n Autom\xE1tica', undefined, undefined, 'AUTO \u03B2', 'Modificar Reproducci\xF3n Autom\xE1tica',
				'Calidad', 'AUTO', 'BAJA', 'MEDIA', 'ALTA', undefined, 'Usar calidad por defecto',
				undefined, undefined, undefined
			]);

		// german - deutsch (xemino @userscripts.org)
		case 'de':
			return combine(vocabulary, [
				'Automatische Wiedergabe', 'AN', 'AUS', 'AUTO \u03B2', 'Automatische Wiedergabe umschalten',
				'Qualit\xE4t', 'AUTO', 'NIEDRIG', 'MITTEL', 'HOCH', undefined, 'Standard Video Qualit\xE4t setzen',
				undefined, undefined, undefined
			]);

		// brazilian portuguese - português brasileiro (Pitukinha @userscripts.org)
		case 'pt':
			return combine(vocabulary, [
				'Reprodu\xE7\xE3o Autom\xE1tica', 'LIGADO', 'DESLIGADO', 'AUTOM\xC1TICO \u03B2', 'Modificar Reprodu\xE7\xE3o Autom\xE1tica',
				'Qualidade', 'AUTOM\xC1TICO', 'BAIXA', 'M\xC9DIO', 'BOA', undefined, 'Defini\xE7\xE3o padr\xE3o de v\xEDdeo',
				'Configura\xE7\xF5es', 'Configura\xE7\xE3o do usu\xE1rio', undefined
			]);

		// greek - Έλληνες (TastyTeo @userscripts.org)
		case 'el':
			return combine(vocabulary, [
				'\u0391\u03C5\u03C4\u03CC\u03BC\u03B1\u03C4\u03B7 \u03B1\u03BD\u03B1\u03C0\u03B1\u03C1\u03B1\u03B3\u03C9\u03B3\u03AE', '\u0395\u039D\u0395\u03A1\u0393\u039F', '\u0391\u039D\u0395\u039D\u0395\u03A1\u0393\u039F', '\u0391\u03A5\u03A4\u039F\u039C\u0391\u03A4\u0397 \u03B2', '\u0395\u03BD\u03B1\u03BB\u03BB\u03B1\u03B3\u03AE \u03B1\u03C5\u03C4\u03CC\u03BC\u03B1\u03C4\u03B7\u03C2 \u03B1\u03BD\u03B1\u03C0\u03B1\u03C1\u03B1\u03B3\u03C9\u03B3\u03AE\u03C2',
				'\u03A0\u03BF\u03B9\u03CC\u03C4\u03B7\u03C4\u03B1', '\u0391\u03A5\u03A4\u039F\u039C\u0391\u03A4\u0397', '\u03A7\u0391\u039C\u0397\u039B\u0397', '\u039A\u0391\u039D\u039F\u039D\u0399\u039A\u0397', '\u03A5\u03A8\u0397\u039B\u0397', '\u03A0\u039F\u039B\u03A5 \u03A5\u03A8\u0397\u039B\u0397', '\u039F\u03C1\u03B9\u03C3\u03BC\u03CC\u03C2 \u03C0\u03C1\u03BF\u03B5\u03C0\u03B9\u03BB\u03B5\u03B3\u03BC\u03AD\u03BD\u03B7\u03C2 \u03C0\u03BF\u03B9\u03CC\u03C4\u03B7\u03C4\u03B1\u03C2 \u03B2\u03AF\u03BD\u03C4\u03B5\u03BF',
				'\u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AD\u03C2', '\u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AD\u03C2 Player', undefined
			]);

		// french - français (eXa @userscripts.org)
		case 'fr':
			return combine(vocabulary, [
				'Lecture Auto', undefined, undefined, undefined, 'Lecture auto ON/OFF',
				'Qualit\xE9', undefined, 'BASSE', 'MOYENNE', 'HAUTE', 'LA PLUS HAUTE', 'Qualit\xE9 par d\xE9faut',
				'Options', 'Option du lecteur', undefined
			]);
	}

	return {};
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

	getById: bind(unsafeWindow.document.getElementById, unsafeWindow.document),
	createElement: bind(unsafeWindow.document.createElement, unsafeWindow.document),
	createTextNode: bind(unsafeWindow.document.createTextNode, unsafeWindow.document),

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

	addClass: function(node, clss) {
		var classAttribute = node.getAttribute('class') || '';
		if (classAttribute.indexOf(clss) == -1) {
			node.setAttribute('class', classAttribute.concat(' ', clss));
		}
	},

	delClass: function(node, clss) {
		if (node.hasAttribute('class')) {
			node.setAttribute('class', node.getAttribute('class').replace(new RegExp('\\s*'.concat(clss, '\\s*'), 'g'), ' '));
		}
	},

	hasClass: function(node, clss) {
		return node.hasAttribute('class') && node.getAttribute('class').indexOf(clss) != -1;
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
			}
		};
	}

	var prefix = namespace + '.';

	// HTML5
	if (typeof unsafeWindow.localStorage == 'object') {
		return {
			get: function(key) { return unsafeWindow.localStorage.getItem(prefix + key); },
			set: function(key, value) { return unsafeWindow.localStorage.setItem(prefix + key, value); }
		};
	}

	// Cookie
	return {
		get: function(key) {
			return (document.cookie.match(new RegExp('(?:^|; *)'.concat(prefix, key, '=(\\w+)(?:$|;)'))) || [, null])[1];
		},

		set: function(key, value) {
			key = prefix + key;

			if (new RegExp('(?:^|; *)'.concat(key, '=\\w+(?:$|;)')).test(document.cookie)) {
				document.cookie = key.concat('=', value);
			}
			else {
				document.cookie = key.concat('=', value, '; path=/; expires=', new Date(new Date().valueOf() + 365 * 24 * 3600 * 1000).toUTCString());
			}
		}
	};
})(Meta.ns);

/*
 * Create JSON or JSONp requests.
 */
var JSONRequest = (function(namespace) {
	var Impl;

	// Greasemonkey XHR
	if (typeof GM_xmlhttpRequest == 'function') {
		Impl = emptyFn;

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
				this._callback(eval('('.concat(response.responseText, ')')));
			}
		};
	}
	// Script tag
	else {
		Impl = (function() {
			var Impl = emptyFn;

			var requests = [];

			Impl.prototype = {
				_callback: null,
				_id: null,

				_doRequest: function(url, parameters, callback) {
					this._callback = callback;
					this._id = requests.push(bind(this._onLoad, this)) - 1;

					parameters.callback = namespace.concat('.JSONRequests[', this._id, ']');

					this._scriptTag = document.body.appendChild(DH.build({
						tag: 'script',
						attributes: {
							type: 'text/javascript',
							src: buildURL(url, parameters)
						}
					}));
				},

				_onLoad: function(response) {
					this._callback(response);

					document.body.removeChild(this._scriptTag);
					delete requests[this._id];
				}
			};

			unsafeWindow[namespace].JSONRequests = requests;

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
	if (new Date().valueOf() - new Number(Config.get('update_checked_at')).valueOf() < 24 * 3600 * 1000) return;

	var popup = null;

	new JSONRequest(Meta.site + '/changelog', {version: Meta.version}, function (changelog) {
		Config.set('update_checked_at', new String(new Date().valueOf()).valueOf());

		if (changelog && changelog.length) {
			popup = renderPopup(changelog);
		}
	});

	function renderPopup(changelog) {
		return document.body.appendChild(DH.build({
			style: {
				position: 'fixed', top: '15px', right: '15px', zIndex: 1000, padding: '4px 8px', backgroundColor: '#ffffff', border: '1px solid #cccccc',
				color: '#202020', fontSize: '11px', fontFamily: 'Arial,Nimbus Sans L,sans-serif', lineHeight: '11px',
				MozBoxShadow: '2px 2px 4px rgb(71, 71, 71)'
			},
			children: [{
				style: {textAlign: 'center', fontWeight: 'bold'},
				children: Meta.title
			}, {
				style: {marginBottom: '6px', textAlign: 'center'},
				children: 'UserScript update notification.'
			}, {
				children: ['You are using version ', {tag: 'b', children: Meta.version}, ', released on ', {tag: 'i', children: Meta.releasedate}, '.', {tag: 'br'}, 'Please update to the newest version.']
			}, {
				style: {margin: '5px'},
				children: map(function(entry) {
					return {
						children: [
							{tag: 'b', style: {fontSize: '11px'}, children: entry.version},
							{tag: 'i', style: {marginLeft: '5px'}, children: entry.date},
							{style: {padding: '0 0 2px 10px', whiteSpace: 'pre'}, children: [].concat(entry.note).join('\n')}
						]
					};
				}, [].concat(changelog))
			}, {
				style: {textAlign: 'center', padding: '10px'},
				children: map(function(text, handler) {
					var node = DH.build({
						tag: 'span',
						attributes: {'class': 'yt-uix-button'},
						style: {margin: '0 5px', padding: '3px 10px'},
						children: text,
						listeners: {click: handler}
					});

					return node;
				}, ['Update', 'Later'], [openDownloadSite, removePopup])
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
			attributes: {type: 'button', 'class': 'yt-uix-button yt-uix-tooltip'}
		},

		label: {
			tag: 'span',
			attributes: {'class': 'yt-uix-button-content'}
		},

		indicator: {
			tag: 'span',
			style: {fontWeight: 'bold', marginLeft: '5px'},
			attributes: {'class': 'yt-uix-button-content'},
			children: '-'
		}
	};

	function Button(labelText, tooltipText, callbacks) {
		var
			node = DH.build(def.node),
			label = DH.build(def.label),
			indicator = DH.build(def.indicator);

		DH.attributes(node, { title: tooltipText });
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
function PlayerOption(configKey, overrides) {
	copy(overrides, this);

	this._configKey = configKey;

	PlayerOption.functions.push(this);
}

PlayerOption.prototype = {
	_player: null,

	get: function() {
		return Number(Config.get(this._configKey));
	},

	set: function(value) {
		Config.set(this._configKey, value);
	},

	init: emptyFn,
	apply: emptyFn
};

PlayerOption.functions = [];

PlayerOption.init = function(player) {
	this.prototype._player = player;
	each(function(i, func) { func.init(); }, this.functions);
};

/*
 * Prevent autoplaying.
 */
var AutoPlay = new PlayerOption('auto_play', {
	_applied: false,
	_focused: false,
	_timer: null,

	_step: function() {
		this.set((this.get() + 1) % 3);
	},

	_indicator: function() {
		return _(['ON', 'OFF', 'AUTO \u03B2'][this.get()]);
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
				if (unsafeWindow.history.length > 1) {
					this._applied = true;
				}
				// Video opened in new window/tab.
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
			try {
				this._player.seekTo(0, true);
			}
			catch (ex) { }

			this._player.pauseVideo();

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
	_step: function() {
		this.set((this.get() + 1) % 5);
	},

	_indicator: function() {
		return _(['AUTO', 'LOW', 'MEDIUM', 'HIGH', 'HIGHEST'][this.get()]);
	},

	_qualities: {highres: 5, hd1080: 4, hd720: 3, large: 2, medium: 1, small: 0},

	apply: function() {
		var qualities = this._player.getAvailableQualityLevels(), quality = null;

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
	},

	createButton: function() {
		return new Button(_('Quality'), _('Set default video quality'), {
			handler: bind(this._step, this),
			refresh: bind(this._indicator, this)
		});
	}
});

/*
 * Player state change callback
 */
unsafeWindow[Meta.ns].onPlayerStateChange = function() {
	AutoPlay.apply();
};

/*
 * Player ready callback
 */
function onPlayerReady() {
	var player = DH.getById('movie_player');

	if (player) {
		// Unwrap the player object
		if (typeof XPCNativeWrapper == 'function' && typeof XPCNativeWrapper.unwrap == 'function') {
			player = XPCNativeWrapper.unwrap(player);
		}

		if (typeof player.getPlayerState == 'function') {
			PlayerOption.init(player);

			VideoQuality.apply();
			AutoPlay.apply();

			player.addEventListener('onStateChange', Meta.ns + '.onPlayerStateChange()');

			return true;
		}
	}

	return false;
}

/*
 * Per-site
 *
 * Watch page
 */
if (DH.getById('watch-actions') !== null) {
	DH.insertAfter(DH.getById('watch-flag'), {
		tag: 'button',
		style: {marginLeft: '3px', padding: '0 4px'},
		attributes: {id: 'yays_settings-button', type: 'button', 'class': 'yt-uix-button yt-uix-tooltip yt-uix-tooltip-reverse', title: _('Player settings')},
		children: {
				tag: 'img',
				attributes: {src: 'data:image/png;base64,\
iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAYBJREFUOMuN\
k71qG0EUhb9ZSxjHbu4DuNkuTcBtapeppUcYSLAJCJKLH8BeVYFEmMwjeEuTMpV6EawygWk2/W3i\
FAuOXXi0jMxu8OnucM49928cA6jr+tjMNIWV9/57H2/EMK7LstwDiDG+Bl78N0Fd15+A98DfyWSy\
b2b3Ge8eIIRwmxJ98d6fArgk9sBXEcHMMDMARARgK844J977xSgRdvKyNsK+eGNgZgVAAeC9vwQ+\
5qKM2Nf6map+BnAhhBvg8NFIcvEPYJoquBKRozw58AdoRsCrsiz7nKaq+isNbwr8zFsSkYP1ev2y\
GNrh0zkMwYUQbszsUB6Rz6BrAdhqoWkagFvn3G+3eQwhfBCR+XNcY4xnqnrRbSGE8BZ4ljjhvKqq\
0y4BcPfkSLaG2jTNpuzumIB/+R2EGONitVphZq333gFt5tjOZjMXY2yXyyUxxktVXeQVoKonQKGq\
u+mpu87xeLyTOLtt2xbz+fxdt4WhJquqegN031lVv/XxHgDCcLpFjm2HsgAAAABJRU5ErkJggg=='}
		},
		listeners: {
			click: function() {
				var
					container = DH.getById('watch-actions-area-container'),
					panel = DH.getById('yays_settings-panel');

				function isHidden(node) { return node.nodeType != 1 || DH.hasClass(node, 'hid'); }

				if (isHidden(panel) || isHidden(container)) {
					DH.delClass(container, 'hid');
					container.style.display = 'block';

					each(function(i, node) {
						! isHidden(node) && DH.hasClass(node, 'watch-actions-panel') && DH.addClass(node, ' hid');
					}, DH.getById('watch-actions-area').childNodes);

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

	DH.prepend(DH.getById('watch-actions-area'), [{
		attributes: {id: 'yays_settings-panel', 'class': 'watch-actions-panel'},
		style: {position: 'relative'},
		children: [{
			tag: 'img',
			style: {position: 'absolute', top: '0', right: '15px', marginTop: '-5px', cursor: 'pointer'},
			attributes: {src: 'data:image/png;base64,\
iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAQRJREFUOMud\
k7+twjAQh7+ziBsEFB7lUVNmAdjBDQtkAjJAmuxgJoBXUWSTQOMIid5+BSJSXghKOMmSz77fd39k\
C8DxeIzee6aYMYbtdivinIsiwmazYbVajRJ777lcLiilmDVNQ5qmKKV4PB6jAFprftZrfs9nZgDz\
+ZwQwqQWlosFwBOglOoFZFnW8Q+Hw1uQAhCRznqJ8zwnz/MW+D+urUBrPdjrJ38QUBRFu9/v972z\
HiBJkreX1loAyrIcHObs06Q/CTtDHDJrbVvFV4Ax9nULr4enAO73++TMt9vtCTDGcDqduF6vo4Qh\
BOq6pqoqjDEIgHMueu8REWKMo7/zbreTP/cyU+OquYT5AAAAAElFTkSuQmCC', title: _('Help')},
			listeners: {click: function() { unsafeWindow.open(Meta.site); }}
		}, {
			style: {textAlign: 'center'},
			children: [
				VideoQuality.createButton().render(),
				AutoPlay.createButton().render()
			]
		}]
	}]);

	unsafeWindow.onYouTubePlayerReady = extendFn(unsafeWindow.onYouTubePlayerReady, onPlayerReady);
	onPlayerReady();
}
/*
 * Channel page
 */
else if (DH.getById('playnav-video-details') !== null) {
	// Create and append tab
	DH.append(DH.getById('playnav-bottom-links-clip').getElementsByTagName('tr')[0], {
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
iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAGRJREFUGNON\
kMENwDAIA49s0a4Rduwc3cddIxmj/RCpQjxyUj52wAAkFGS9hXlJGqH1eEgaki4AWwJwUDPd/bRf\
5Fv9cncDsJinZyMVPo1NtqPbb5mS5a3oO7az1GmGV3YoD/4BWtI5q0QK+u4AAAAASUVORK5CYII='}
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
											DH.getById('playnav-panel-' + panelName).style.display = 'none';
										}
									}, DH.getById('playnav-bottom-links-clip').getElementsByTagName('td'));

									DH.addClass(DH.getById('playnav-panel-tab-yays_settings'), 'panel-tab-selected');
									DH.getById('playnav-panel-yays_settings').style.display = 'block';
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

	// Other tab clicked
	unsafeWindow.playnav.selectPanel = extendFn(unsafeWindow.playnav.selectPanel, function () {
		DH.getById('playnav-panel-tab-yays_settings').setAttribute('class', '');
		DH.getById('playnav-panel-yays_settings').style.display = 'none';
	});

	// Create and append panel
	DH.append(DH.getById('playnav-video-panel-inner'), {
		attributes: {id: 'playnav-panel-yays_settings', 'class': 'hid'},
		children: {
			children: [{
				tag: 'b',
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

	unsafeWindow.onChannelPlayerReady = extendFn(unsafeWindow.onChannelPlayerReady, onPlayerReady);
	onPlayerReady();
}

} // YAYS

/*
 * Run YAYS if the page has a player embedded.
 */
if (document.getElementById('movie_player')) {
	// Firefox
	if (new RegExp('Firefox/\\d', 'i').test(navigator.userAgent)) {
		YAYS(unsafeWindow);
	}
	// Chrome, Opera, Safari
	else {
		var scriptNode = document.createElement('script');
		scriptNode.setAttribute('type', 'text/javascript');
		scriptNode.text = '('.concat(YAYS.toString(), ')(window);');

		document.body.appendChild(scriptNode);
		document.body.removeChild(scriptNode);
	}
}
