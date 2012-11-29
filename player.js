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

