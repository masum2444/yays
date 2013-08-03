/**
 * @class Player
 */
function Player(element) {
	this._element = element;
	this._listeners = {};

	this._boot();
}

merge(Player, {
	UNSTARTED: -1,
	ENDED: 0,
	PLAYING: 1,
	PAUSED: 2,
	BUFFERING: 3,
	CUED: 5,

	instance: {
		_element: null
	},

	initialize: function(element) {
		if (! element instanceof HTMLElement) {
			throw 'Invalid player element';
		}

		if (this.instance._element === element) {
			throw 'Player already initialized';
		}

		return this.instance = new this(element);
	}
});

Player.prototype = {
	_element: null,
	_listeners: null,
	_ready: false,
	_muted: 0,

	_boot: function() {
		if (typeof this._element.getApiInterface == 'function') {
			this._exportApiInterface();
			this._onReady();
		}
		else {
			setTimeout(bind(this._boot, this), 10);
		}
	},

	_exportApiInterface: function() {
		each(this._element.getApiInterface(), function(i, method) {
			if (! Player.prototype.hasOwnProperty(method)) {
				this[method] = bind(this._element[method], this._element);
			}
		}, this);
	},

	_dispatchEvent: function(name /* ... */) {
		if (name in this._listeners) {
			this._listeners[name].apply(null, [this].concat(Array.prototype.slice.call(arguments, 1)));
		}
	},

	_onReady: function() {
		Console.debug('Player ready');

		this._ready = true;
		this._muted = Number(this.isMuted());

		// The player sometimes reports inconsistent state.
		if (this.isAutoPlaying()) {
			this.resetState();
		}

		Context.onPlayerStateChange = asyncProxy(bind(this._onStateChange, this));
		this.addEventListener('onStateChange', Context.ns + '.onPlayerStateChange');

		this._dispatchEvent('ready');
	},

	_onStateChange: function(state) {
		Console.debug('State changed to', ['unstarted', 'ended', 'playing', 'paused', 'buffering', undefined, 'cued'][state + 1]);

		this._dispatchEvent('statechange', state);
	},

	onReady: function(listener) {
		this._listeners['ready'] = listener;

		if (this._ready) {
			this._dispatchEvent('ready');
		}
	},

	onStateChange: function(listener) {
		this._listeners['statechange'] = listener;
	},

	getArgument: function(name) {
		if (this._element.hasAttribute('flashvars')) {
			var match = this._element.getAttribute('flashvars').match(new RegExp('(?:^|&)'.concat(name, '=(.+?)(?:&|$)')));
			if (match) {
				return decodeURIComponent(match[1]);
			}
		}
		else {
			try {
				return unsafeWindow.ytplayer.config.args[name];
			}
			catch (e) {}
		}

		return;
	},

	isAutoPlaying: function() {
		return (this.getArgument('autoplay') || '1') == 1;
	},

	isHTML5: function() {
		try {
			return unsafeWindow.ytplayer.config.html5 === true;
		}
		catch (e) {
			return this._element.tagName == 'DIV';
		}
	},

	getVideoId: function() {
		try {
			return this.getVideoData().video_id;
		}
		catch (e) {
			return (this.getVideoUrl().match(/\bv=([\w-]+)/) || [, undefined])[1];
		}
	},

	setPlaybackQuality: function() {
		this._element.setPlaybackQuality.apply(this._element, arguments);

		if (this.isHTML5() && [Player.PLAYING, Player.BUFFERING].indexOf(this.getPlayerState()) > -1) {
			this.playVideo();
		}
	},

	seekTo: function() {
		try {
			this._element.seekTo.apply(this._element, arguments);
		}
		catch (e) {}
	},

	seekToStart: function(ahead) {
		var
			code = (location.hash + location.search).match(/\bt=(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/) || new Array(4),
			seconds = (Number(code[1]) || 0) * 3600 + (Number(code[2]) || 0) * 60 + (Number(code[3]) || 0);

		this.seekTo(seconds, ahead);
	},

	resetState: function() {
		this.seekTo(this.getCurrentTime(), true);
	},

	mute: function() {
		if (! this._muted++) {
			this._element.mute();
		}
	},

	unMute: function() {
		if (! --this._muted) {
			this._element.unMute();
		}
	}
};
