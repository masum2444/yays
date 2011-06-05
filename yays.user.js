// ==UserScript==
// @name        Yays! (Yet Another Youtube Script)
// @description Control autoplaying and playback quality on YouTube.
// @version     1.5.2
// @author      eugenox_gmail_com
// @license     (CC) BY-SA-3.0 http://creativecommons.org/licenses/by-sa/3.0/
// @namespace   youtube
// @include     http://*.youtube.*/*
// @include     https://*.youtube.*/*
// @include     http://youtube.*/*
// @include     https://youtube.*/*
// ==/UserScript==

function YAYS(unsafeWindow) {

/*
 * Meta data
 */
var Meta = {
	title:       'Yays! (Yet Another Youtube Script)',
	version:     '1.5.2',
	releasedate: 'Apr 16, 2011',
	site:        'http://eugenox.appspot.com/script/yays',
	namespace:   'yays'
};

/*
 * Script namespace.
 */
unsafeWindow[Meta.namespace] = {};

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
	var args = Array.prototype.constructor.apply([], arguments), callback = args.shift() || createCallback(Array.prototype.constructor, []), buffer = [];

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

function copyProperties(src, target) {
	for (var key in src) target[key] = src[key];
	return target;
}

function createCallback(func, scope) {
	return function() { return func.apply(scope, arguments); };
}

var emptyFunction = function() { return; };

function extendFunction(func, extension) {
	return function() {
		try { func.apply(this, arguments); } catch (ex) { }
		extension.apply(this, arguments);
	};
}

/*
 * i18n
 */
function _(text) {
	return _.dictionary[text] || text;
}

_.dictionary = (function() {
	var vocabulary = [
		'Auto play', 'ON', 'OFF', 'AUTO', 'Toggle video autoplay',
		'Quality', 'AUTO', 'LOW', 'MEDIUM', 'HIGH', 'HIGHEST', 'Set default video quality',
		'Settings', 'Player settings'
	];

	switch ((document.documentElement.lang || 'en').substr(0, 2)) {
		// hungarian - magyar
		case 'hu':
			return combine(vocabulary, [
				'Automatikus lej\xE1tsz\xE1s', 'BE', 'KI', 'AUTO \u03B2', 'Automatikus lej\xE1tsz\xE1s ki-, bekapcsol\xE1sa',
				'Min\u0151s\xE9g', 'AUTO', 'ALACSONY', 'K\xD6ZEPES', 'MAGAS', 'LEGMAGASABB', 'Vide\xF3k alap\xE9rtelmezett felbont\xE1sa',
				'Be\xE1ll\xEDt\xE1sok', 'Lej\xE1tsz\xF3 be\xE1ll\xEDt\xE1sai'
			]);

		// dutch - nederlands (Mike-RaWare @userscripts.org)
		case 'nl':
			return combine(vocabulary, [
				'Auto spelen', 'AAN', 'UIT', 'AUTOMATISCH \u03B2', 'Stel automatisch afspelen in',
				'Kwaliteit', 'AUTOMATISCH', 'LAAG', 'GEMIDDELD', 'HOOG', undefined, 'Stel standaard videokwaliteit in',
				undefined, undefined
			]);

		// spanish - español (yonane @userscripts.org)
		case 'es':
			return combine(vocabulary, [
				'Reproducci\xF3n Autom\xE1tica', undefined, undefined, 'AUTO \u03B2', 'Modificar Reproducci\xF3n Autom\xE1tica',
				'Calidad', 'AUTO', 'BAJA', 'MEDIA', 'ALTA', undefined, 'Usar calidad por defecto',
				undefined, undefined
			]);

		// german - deutsch (xemino @userscripts.org)
		case 'de':
			return combine(vocabulary, [
				'Automatische Wiedergabe', 'AN', 'AUS', 'AUTO \u03B2', 'Automatische Wiedergabe umschalten',
				'Qualit\xE4t', 'AUTO', 'NIEDRIG', 'MITTEL', 'HOCH', undefined, 'Standard Video Qualit\xE4t setzen',
				undefined, undefined
			]);

		// brazilian portuguese - português brasileiro (Pitukinha @userscripts.org)
		case 'pt':
			return combine(vocabulary, [
				'Reprodu\xE7\xE3o Autom\xE1tica', 'LIGADO', 'DESLIGADO', 'AUTOM\xC1TICO \u03B2', 'Modificar Reprodu\xE7\xE3o Autom\xE1tica',
				'Qualidade', 'AUTOM\xC1TICO', 'BAIXA', 'M\xC9DIO', 'BOA', undefined, 'Defini\xE7\xE3o padr\xE3o de v\xEDdeo',
				'Configura\xE7\xF5es', 'Configura\xE7\xE3o do usu\xE1rio'
			]);

		// greek - Έλληνες (TastyTeo @userscripts.org)
		case 'el':
			return combine(vocabulary, [
				'\u0391\u03C5\u03C4\u03CC\u03BC\u03B1\u03C4\u03B7 \u03B1\u03BD\u03B1\u03C0\u03B1\u03C1\u03B1\u03B3\u03C9\u03B3\u03AE', '\u0395\u039D\u0395\u03A1\u0393\u039F', '\u0391\u039D\u0395\u039D\u0395\u03A1\u0393\u039F', '\u0391\u03A5\u03A4\u039F\u039C\u0391\u03A4\u0397 \u03B2', '\u0395\u03BD\u03B1\u03BB\u03BB\u03B1\u03B3\u03AE \u03B1\u03C5\u03C4\u03CC\u03BC\u03B1\u03C4\u03B7\u03C2 \u03B1\u03BD\u03B1\u03C0\u03B1\u03C1\u03B1\u03B3\u03C9\u03B3\u03AE\u03C2',
				'\u03A0\u03BF\u03B9\u03CC\u03C4\u03B7\u03C4\u03B1', '\u0391\u03A5\u03A4\u039F\u039C\u0391\u03A4\u0397', '\u03A7\u0391\u039C\u0397\u039B\u0397', '\u039A\u0391\u039D\u039F\u039D\u0399\u039A\u0397', '\u03A5\u03A8\u0397\u039B\u0397', '\u03A0\u039F\u039B\u03A5 \u03A5\u03A8\u0397\u039B\u0397', '\u039F\u03C1\u03B9\u03C3\u03BC\u03CC\u03C2 \u03C0\u03C1\u03BF\u03B5\u03C0\u03B9\u03BB\u03B5\u03B3\u03BC\u03AD\u03BD\u03B7\u03C2 \u03C0\u03BF\u03B9\u03CC\u03C4\u03B7\u03C4\u03B1\u03C2 \u03B2\u03AF\u03BD\u03C4\u03B5\u03BF',
				'\u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AD\u03C2', '\u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AD\u03C2 Player'
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
				def = copyProperties(def, {tag: 'div', style: null, attributes: null, listeners: null, children: null});

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

	getById: createCallback(unsafeWindow.document.getElementById, unsafeWindow.document),
	createElement: createCallback(unsafeWindow.document.createElement, unsafeWindow.document),
	createTextNode: createCallback(unsafeWindow.document.createTextNode, unsafeWindow.document),

	style: function(node, style) {
		copyProperties(style, node.style);
	},

	append: function(node, children) {
		each(function(i, child) { node.appendChild(this.build(child)); }, [].concat(children), this);
	},

	appendAfter: function(node, children) {
		var parent = node.parentNode, sibling = node.nextSibling;
		if (sibling) {
			each(function(i, child) { parent.insertBefore(this.build(child), sibling); }, [].concat(children), this);
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

	var prefix = namespace ? namespace + '.' : '';

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
			return (document.cookie.match(new RegExp('(?:^|; *)' + prefix + key + '=(\\w+)(?:$|;)')) || [, null])[1];
		},

		set: function(key, value) {
			key = prefix + key;

			if (new RegExp('(?:^|; *)' + key + '=\\w+(?:$|;)').test(document.cookie)) {
				document.cookie = key + '=' + value;
			}
			else {
				document.cookie = key + '=' + value + '; path=/; expires=' + new Date(new Date().valueOf() + 365 * 24 * 3600 * 1000).toUTCString();
			}
		}
	};
})(Meta.namespace);

/*
 * JSONRequest class.
 */
var JSONRequest = (function(namespace) {
	function buildURL(base, parameters) {
		var queryParams = [];
		each(function(key, value) { queryParams.push(key + '=' + encodeURIComponent(value)); }, parameters);

		return base + '?' + queryParams.join('&');
	}

	var RequestClass;

	// Greasemonkey XHR
	if (typeof GM_xmlhttpRequest == 'function') {
		RequestClass = function(url, parameters, callback) {
			this._callback = callback;

			GM_xmlhttpRequest({
				method: 'GET',
				url: buildURL(url, parameters),
				onload: createCallback(this._onLoad, this)
			});
		};

		RequestClass.prototype = {
			_onLoad: function(response) {
				this._callback(eval('(' + response.responseText + ')'));
			}
		};
	}
	// Script tag
	else {
		unsafeWindow[namespace].JSONRequest = [];

		RequestClass = function(url, parameters, callback) {
			this._callback = callback;
			this._id = unsafeWindow[namespace].JSONRequest.push(createCallback(this._onLoad, this)) - 1;

			parameters.callback = namespace + '.JSONRequest[' + this._id + ']';

			this._scriptTag = document.body.appendChild(DH.build({
				tag: 'script',
				attributes: {
					type: 'text/javascript',
					src: buildURL(url, parameters)
				}
			}));
		};

		RequestClass.prototype = {
			_onLoad: function(response) {
				this._callback(response);

				document.body.removeChild(this._scriptTag);
				delete unsafeWindow[namespace].JSONRequest[this._id];
			}
		};
	}

	return RequestClass;
})(Meta.namespace);

/*
 * Check for update.
 */
(function () {

	if (new Date().valueOf() - new Number(Config.get('update_checked_at')).valueOf() < 24 * 3600 * 1000) return;

	var popup = null;

	new JSONRequest(Meta.site + '/changelog', {version: Meta.version}, function (changelog) {
		Config.set('update_checked_at', new String(new Date().valueOf()).valueOf());

		if (changelog && changelog.length) popup = renderPopup(changelog);
	});

	function renderPopup(changelog) {
		return document.body.appendChild(DH.build({
			style: {
				position: 'fixed', top: '20px', right: '20px', zIndex: 1000, padding: '5px', background: '#f5f5f5', border: '1px solid #c3c3c3',
				color: '#202020', fontSize: '11px', fontFamily: 'Arial,Nimbus Sans L,sans-serif', lineHeight: '11px'
			},
			children: [{
				style: {margin: '2px 0', textAlign: 'center', fontWeight: 'bold'},
				children: Meta.title
			}, {
				style: {marginBottom: '6px', textAlign: 'center'},
				children: 'UserScript update notification.'
			}, {
				children: ['You are using version ', {tag: 'b', children: Meta.version}, {tag: 'i', children: [' (', Meta.releasedate, ')']}, '. Consider updating to the newest version.']
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
						style: {border: '1px solid #cccccc', padding: '3px 10px', margin: '0 5px', cursor: 'pointer', backgroundColor: '#e5e5e5'},
						children: text,
						listeners: {click: handler}
					});

					return node;
				}, ['Update', 'Later'], [openSite, removePopup])
			}]
		}));
	}

	function removePopup() {
		document.body.removeChild(popup);
	}

	function openSite() {
		removePopup();
		unsafeWindow.open(Meta.site);
	}

})();

/*
 * Button class.
 */
function Button(labelText, tooltipText) {
	var
		node = DH.build(this._dom.node),
		label = DH.build(this._dom.label),
		indicator = DH.build(this._dom.indicator);

	DH.attributes(node, { title: tooltipText });
	DH.append(label, labelText);
	DH.append(node, [label, indicator]);

	DH.on(node, 'click', createCallback(this._onClick, this));

	this._node = node;

	this.indicator = indicator.firstChild;
}

Button.prototype = {
	indicator: null,

	_node: null,

	_dom: {
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
			children: ''
		}
	},

	_onClick: function(event) {
		this.handler();
		this.refresh();
	},

	render: function() {
		this.refresh();
		return this._node;
	},

	handler: emptyFunction,
	refresh: emptyFunction
};

/*
 * PLAYERFUNCTION class.
 */
function PlayerFunction(configKey, overrides) {
	copyProperties(overrides, this);

	this._configKey = configKey;

	PlayerFunction.functions.push(this);
}

PlayerFunction.prototype = {
	_player: null,

	get: function() {
		return Number(Config.get(this._configKey));
	},

	set: function(value) {
		Config.set(this._configKey, value);
	},

	init: emptyFunction,
	apply: emptyFunction
};

PlayerFunction.functions = [];

PlayerFunction.init = function(player) {
	this.prototype._player = player;
	each(function(i, func) { func.init(); }, this.functions);
};

/*
 * AUTOPLAY
 */
var AutoPlay = new PlayerFunction('auto_play', {
	_applied: false,

	_step: function() {
		this.set((this.get() + 1) % 3);
	},

	_onFocus: function() {
		if (this._applied) {
			setTimeout(createCallback(function() { this._player.playVideo(); }, this), 500);
		}

		this._applied = true;
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
					var onFocus = createCallback(function () {
						this._onFocus();

						DH.un(unsafeWindow, 'focus', onFocus);
					}, this);

					DH.on(unsafeWindow, 'focus', onFocus);

					this._applied = false;
				}
				break;
		}
	},

	apply: function() {
		if (! this._applied && this._player.getPlayerState() == 1) {
			this._player.seekTo(0, true);
			this._player.pauseVideo();

			this._applied = true;
		}
	},

	createButton: function() {
		var button = new Button(_('Auto play'), _('Toggle video autoplay'));

		button.handler = createCallback(this._step, this);

		button.refresh = function() {
			this.indicator.data = _(['ON', 'OFF', 'AUTO \u03B2'][AutoPlay.get()]);
		};

		return button;
	}
});

/*
 * VIDEO QUALITY
 */
var VideoQuality = new PlayerFunction('video_quality', {
	_step: function() {
		this.set((this.get() + 1) % 5);
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

		setTimeout(createCallback(function() {

			this._player.setPlaybackQuality(quality);

		}, this), 1);
	},

	createButton: function() {
		var button = new Button(_('Quality'), _('Set default video quality'));

		button.handler = createCallback(this._step, this);

		button.refresh = function() {
			this.indicator.data = _(['AUTO', 'LOW', 'MEDIUM', 'HIGH', 'HIGHEST'][VideoQuality.get()]);
		};

		return button;
	}
});

/*
 * PLAYER STATE CHANGE callback
 */
unsafeWindow[Meta.namespace].onPlayerStateChange = function() {

	AutoPlay.apply();

};

/*
 * PLAYER READY callback
 */
function onPlayerReady() {
	var player = DH.getById('movie_player');

	if (player && typeof player.getPlayerState == 'function') {

		PlayerFunction.init(player);

		VideoQuality.apply();
		AutoPlay.apply();

		player.addEventListener('onStateChange', Meta.namespace + '.onPlayerStateChange()');

		return true;
	}

	return false;
}

/*
 * PER-SITE
 */
// WATCH page
if (DH.getById('watch-actions') !== null) {

	DH.appendAfter(DH.getById('watch-flag'), {
		tag: 'button',
		style: {marginLeft: '3px', padding: '0 4px'},
		attributes: {id: 'yays_settings-button', type: 'button', 'class': 'yt-uix-button yt-uix-tooltip yt-uix-tooltip-reverse', title: _('Player settings')},
		children: {
				tag: 'img',
				attributes: {src: 'data:image/png;base64,\
iVBORw0KGgoAAAANSUhEUgAAABAAAAARCAQAAAB+puRPAAAAAXNSR0IArs4c6QAAAYxJREFUKM+N\
0T9I1HEABfDPzzuMLvFPQ38QOYj+YCClo7T0l/7SEji1VkSu/bGhsRouyS6IlnDpcIksggYnA6Os\
5EoIrMBQKIIo9O707vzdt0FBx97y4L03vMeLrMHgoXA1Ft86N7KqJdcGPOteT65balWqg1x/LgwW\
qYQFZc2BbDEbBgYgIne+9cF20z6hA+/Qqd2Yid4b2SQLiUlJJXusU8EBiyqmvFSpI8Hw+JmF1OGS\
ed+8MqtBpKpkri+TIXqUr7aFlg5zfno6Ue5plh463pnQ5LlKoToTPQzHTPutwWufdz7+QmZH21Ra\
UaOtrkjGSpaQsElhZVoQi1UUzIl687/a0i0nlTQam4h6gtrQvs6KWNbfwuJMBHcu775dk1LvO9Ji\
RfOe9OVukiBzsda/V2yDRi02SiHS6u3B9j+Tb5JU412ajPuq3gmxuyJHbbbFaG2l1IV7PeFUmevl\
fHgfTpfZX+4K7ffXvHQ2gmtLo+FFOLIEXdGyk1imj2Dbh+H0yEz10uwUP/wn/gGkFpjRuL8SbgAA\
AABJRU5ErkJggg=='}
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
		style: {position: 'relative', padding: '5px 0'},
		children: [{
			tag: 'img',
			style: {position: 'absolute', top: '0', right: '20px', cursor: 'pointer'},
			attributes: {src: 'data:image/png;base64,\
iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAQRJREFUOMud\
k7+twjAQh7+ziBsEFB7lUVNmAdjBDQtkAjJAmuxgJoBXUWSTQOMIid5+BSJSXghKOMmSz77fd39k\
C8DxeIzee6aYMYbtdivinIsiwmazYbVajRJ777lcLiilmDVNQ5qmKKV4PB6jAFprftZrfs9nZgDz\
+ZwQwqQWlosFwBOglOoFZFnW8Q+Hw1uQAhCRznqJ8zwnz/MW+D+urUBrPdjrJ38QUBRFu9/v972z\
HiBJkreX1loAyrIcHObs06Q/CTtDHDJrbVvFV4Ax9nULr4enAO73++TMt9vtCTDGcDqduF6vo4Qh\
BOq6pqoqjDEIgHMueu8REWKMo7/zbreTP/cyU+OquYT5AAAAAElFTkSuQmCC', title: 'About'},
			listeners: {click: function() { unsafeWindow.open(Meta.site); }}
		}, {
			style: {textAlign: 'center'},
			children: [
				VideoQuality.createButton().render(),
				AutoPlay.createButton().render()
			]
		}]
	}]);

	unsafeWindow.onYouTubePlayerReady = extendFunction(unsafeWindow.onYouTubePlayerReady, onPlayerReady);
	onPlayerReady();

}
// CHANNEL page
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
iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAEdJREFUGNON\
kFEOADAEQ9udyf1P0DvZl0RsRL+kHqJAkSSX5NU/GfgNRc0OyjIzctoYEACwAtGo/sFS+9PbZ54o\
co7jgi7wC1N5OUtzk3BUAAAAAElFTkSuQmCC)'}
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
	unsafeWindow.playnav.selectPanel = extendFunction(unsafeWindow.playnav.selectPanel, function () {
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

	unsafeWindow.onChannelPlayerReady = extendFunction(unsafeWindow.onChannelPlayerReady, onPlayerReady);
	onPlayerReady();

}

} // YAYS

/*
 * DETECT browser, and run YAYS() accordingly.
 */

// Firefox
if (new RegExp('Firefox/\\d', 'i').test(navigator.userAgent)) {
	YAYS(unsafeWindow);
}
// Chrome, Opera, Safari
else {
	var scriptNode = document.createElement('script');
	scriptNode.setAttribute('type', 'text/javascript');
	scriptNode.text = '(' + YAYS.toString() + ')(window);';

	document.body.appendChild(scriptNode);
}

