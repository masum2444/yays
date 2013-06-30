/*
 * Player singleton.
 */

var Player = (function() {
	function Player(element) {
		this._element = element;
		this._listeners = {};

		this._boot();
	}

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

			if ('ready' in this._listeners) {
				this._listeners['ready'](this);
			}
		},

		_onStateChange: function(state) {
			Console.debug('State changed to', ['unstarted', 'ended', 'playing', 'paused', 'buffering', undefined, 'cued'][state + 1]);

			if ('statechange' in this._listeners) {
				this._listeners['statechange'](state);
			}
		},

		onReady: function(listener) {
			if (this._ready) {
				listener(this);
			}
			else {
				this._listeners['ready'] = listener;
			}
		},

		onStateChange: function(listener) {
			this._listeners['statechange'] = listener;
		},

		getArgument: function(name) {
			// Flash
			if (this._element.hasAttribute('flashvars')) {
				var match = this._element.getAttribute('flashvars').match(new RegExp('(?:^|&)'.concat(name, '=(.+?)(?:&|$)')));
				if (match) {
					return decodeURIComponent(match[1]);
				}
			}
			// HTML5
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

	var instance = {
		_element: null
	};

	return {
		UNSTARTED: -1,
		ENDED: 0,
		PLAYING: 1,
		PAUSED: 2,
		BUFFERING: 3,
		CUED: 5,

		instance: function() {
			return instance;
		},

		initialize: function(element) {
			if (instance._element === element) {
				throw 'Player already initialized';
			}

			return instance = new Player(element);
		}
	};
})();

