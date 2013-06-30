/*
 * PlayerOption class.
 */

function PlayerOption(player, key) {
	this._player = player;
	this._key = key;
}

PlayerOption.prototype = {
	_player: null,
	_key: null,

	get: function() {
		return Number(Config.get(this._key) || '0');
	},

	set: function(value) {
		Config.set(this._key, Number(value));
	},

	apply: emptyFn
};

PlayerOption.Button = function(option) {
	this._option = option;

	Button.call(this, this.label, this.tooltip, {
		handler: bind(this._step, this),
		display: bind(this._indicator, this)
	});
};

PlayerOption.Button.prototype = extend(Button, {
	_option: null,

	label: null,
	tooltip: null,
	states: null,

	_step: function() {
		this._option.set((this._option.get() + 1) % this.states.length);
	},

	_indicator: function() {
		return this.states[this._option.get()];
	}
});

/*
 * Prevent autoplaying.
 */

function AutoPlay(player) {
	PlayerOption.call(this, player, 'auto_play');

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
	else {
		this._applied = true;
	}
}

AutoPlay.prototype = extend(PlayerOption, {
	_applied: false,
	_focused: false,
	_muted: false,
	_player: null,
	_timer: null,

	_onFocus: function() {
		if (this._focused) {
			return;
		}

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
			if (this._player.getPlayerState() == Player.PLAYING) {
				this._focused = true;
			}
		}
	}
});

AutoPlay.Button = function(option) {
	PlayerOption.Button.call(this, option);
};

AutoPlay.Button.prototype = extend(PlayerOption.Button, {
	label: _('Auto play'),
	tooltip: _('Toggle video autoplay'),
	states: [_('ON'), _('OFF'), _('AUTO')]
});

/*
 * Set video quality.
 */

function VideoQuality(player) {
	PlayerOption.call(this, player, 'video_quality');

	this._applied = ! this.get();
}

VideoQuality.prototype = extend(PlayerOption, {
	_applied: false,
	_muted: false,
	_buffered: false,
	_player: null,

	_qualities: [, 'small', 'medium', 'large', 'hd720', 'hd1080', 'highres'],

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

VideoQuality.Button = function(option) {
	PlayerOption.Button.call(this, option);
};

VideoQuality.Button.prototype = extend(PlayerOption.Button, {
	label: _('Quality'),
	tooltip: _('Set default video quality'),
	states: [_('AUTO'), '240p', '360p', '480p', '720p', '1080p', _('ORIGINAL')]
});

/*
 * Set player size.
 */

function PlayerSize(player) {
	PlayerOption.call(this, player, 'player_size');
}

PlayerSize.prototype = extend(PlayerOption, {
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

PlayerSize.Button = function(option) {
	PlayerOption.Button.call(this, option);
};

PlayerSize.Button.prototype = extend(PlayerOption.Button, {
	label: _('Size'),
	tooltip: _('Set default player size'),
	states: [_('AUTO'), _('WIDE'), _('FIT')]
});

