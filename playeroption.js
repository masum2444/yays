/*
 * PlayerOption class.
 */

function PlayerOption(player) {
	this._player = player;

	PlayerOption.instances[this.key] = this;
}

PlayerOption.instances = {};

PlayerOption.instance = function(object) {
	return PlayerOption.instances[this.prototype.key];
};

PlayerOption.prototype = {
	_player: null,

	key: null,
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
		return Number(Config.get(this.key) || 0);
	},

	set: function(value) {
		Config.set(this.key, Number(value));
	},

	button: function(type) {
		return new type(_(this.label), _(this.tooltip), {
			handler: bind(this._step, this),
			display: bind(this._indicator, this)
		});
	},

	apply: emptyFn
};

/*
 * Prevent autoplaying.
 */

function AutoPlay(player) {
	PlayerOption.call(this, player);

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
}

AutoPlay.instance = PlayerOption.instance;

AutoPlay.prototype = extend(PlayerOption, {
	_applied: false,
	_focused: false,
	_muted: false,
	_player: null,
	_timer: null,

	key: 'auto_play',
	label: 'Auto play',
	tooltip: 'Toggle video autoplay',
	states: ['ON', 'OFF', 'AUTO'],

	_onFocus: function() {
		if (this._focused)
			return;

		this._timer = setTimeout(bind(function() {
			if (this._applied) {
				this._player.resetState();
				this._player.playVideo();

				Console.debug('Playback autostarted');
			}
			else {
				this._applied = true;

				Console.debug('Player become visible, playback not affected');

				this._mute(false);
			}

			this._focused = true;
			this._timer = null;
		}, this), 500);
	},

	_onBlur: function() {
		if (this._timer !== null) {
			clearTimeout(this._timer);

			this._timer = null;
		}
	},

	_mute: function(state) {
		if (this._muted != state) {
			this._player[state ? 'mute' : 'unMute']();
			this._muted = state;
		}
	},

	// @see http://www.w3.org/TR/page-visibility/
	_isVisible: function() {
		var doc = unsafeWindow.document;
		return doc.hidden === false || doc.mozHidden === false || doc.webkitHidden === false;
	},

	apply: function() {
		if (! this._applied) {
			this._mute(true);

			if (this._player.getPlayerState() == Player.PLAYING) {
				this._applied = true;

				this._player.seekToStart(true);
				this._player.pauseVideo();

				Console.debug('Playback paused');

				this._mute(false);
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

function VideoQuality(player) {
	PlayerOption.call(this, player);

	this._applied = ! this.get();
}

VideoQuality.instance = PlayerOption.instance;

VideoQuality.prototype = extend(PlayerOption, {
	_applied: false,
	_muted: false,
	_buffered: false,
	_player: null,

	_qualities: [, 'small', 'medium', 'large', 'hd720', 'hd1080', 'highres'],

	key: 'video_quality',
	label: 'Quality',
	tooltip: 'Set default video quality',
	states: ['AUTO', '240p', '360p', '480p', '720p', '1080p', 'ORIGINAL'],

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

						Console.debug('Quality changed to', quality);

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

function PlayerSize(player) {
	PlayerOption.call(this, player);
}

PlayerSize.instance = PlayerOption.instance;

PlayerSize.prototype = extend(PlayerOption, {
	key: 'player_size',
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
						'.watch-medium .watch7-playlist-bar-left {',
							'width: 670px;',
						'}',
						'.watch-medium #watch7-playlist-tray-container {',
							'height: 560px;',
						'}',
						'.watch-medium #player-api {',
							'width: 945px;',
							'height: 560px;',
						'}'
					]
				});
				// no break;

			case 1: // WIDE
				DH.addClass(DH.id('watch7-container'), 'watch-wide');
				DH.addClass(DH.id('player'), 'watch-medium watch-playlist-collapsed');
				break;

			default:
				return;
		}

		Console.debug('Size set to', ['wide', 'fit'][mode - 1]);
	}
});
