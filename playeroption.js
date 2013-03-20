/*
 * PlayerOption class.
 */

function PlayerOption(key, overrides) {
	merge(this, overrides);

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

	button: function(type) {
		return new type(_(this.label), _(this.tooltip), {
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
		var mode = this.get();

		switch (mode) {
			case 2: // FIT
				DH.append(document.body, {
					tag: 'style',
					attributes: {
						'type': 'text/css'
					},
					children: [
						'.watch-medium .watch7-playlist-bar {',
							'width: 945px;',
						'}',
						'.watch-medium #watch7-playlist-tray-container {',
							'height: 533px;',
						'}',
						'.watch-medium.watch-playlist-collapsed #watch7-playlist-tray-container {',
							'height: 0;',
						'}',
						'.watch-medium #player-api {',
							'width: 945px;',
							'height: 560px;',
						'}'
					]
				});
				// no break;

			case 1: // WIDE
				DH.addClass(DH.id('watch7-container'), 'watch-wide watch-medium watch-playlist-collapsed');
				break;

			default:
				return;
		}

		debug('Size set to', ['wide', 'fit'][mode - 1]);
	}
});

