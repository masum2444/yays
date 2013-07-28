/**
 * @class VideoPlayback
 */
function VideoPlayback(player) {
	SilentPlayerOption.call(this, player, 'video_playback');

	if (player.isAutoPlaying()) {
		switch (this.get()) {
			case 0: // PLAYING
				this._applied = true;
				break;

			case 1: // PAUSED
			case 2: // STOPPED
				break;

			case 3: // AUTO PAUSED
			case 4: // AUTO STOPPED
				// Video is visible or opened in the same window.
				if (this._isVisible() || unsafeWindow.history.length > 1) {
					this._applied = true;
				}
				// Video is opened in a background tab.
				else {
					this._handler = bind(this._handler, this);

					DH.on(unsafeWindow, 'focus', this._handler);
					DH.on(unsafeWindow, 'blur', this._handler);
				}
				break;
		}
	}
	else {
		this._applied = true;
	}
}

VideoPlayback.prototype = extend(SilentPlayerOption, {
	_applied: false,
	_timer: null,

	_handlers: {
		'focus': function() {
			if (this._timer !== null) {
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

					this.mute(false);
				}

				DH.un(unsafeWindow, 'focus', this._handler);
				DH.un(unsafeWindow, 'blur', this._handler);

				this._timer = null;
			}, this), 500);
		},

		'blur': function() {
			if (this._timer !== null) {
				clearTimeout(this._timer);

				this._timer = null;
			}
		}
	},

	_handler: function(e) {
		this._handlers[e.type].call(this, e);
	},

	// @see http://www.w3.org/TR/page-visibility/
	_isVisible: function() {
		var doc = unsafeWindow.document;
		return doc.hidden === false || doc.mozHidden === false || doc.webkitHidden === false;
	},

	apply: function() {
		if (! this._applied) {
			this.mute(true);

			if (this._player.getPlayerState() == Player.PLAYING) {
				this._applied = true;

				this._player.seekToStart(true);

				if (this.get() % 2) {
					this._player.pauseVideo();

					Console.debug('Playback paused');
				}
				else {
					this._player.stopVideo();

					Console.debug('Playback stopped');
				}

				this.mute(false);
			}
		}
	}
});

/**
 * @class VideoPlayback.Button
 */
VideoPlayback.Button = function(option) {
	PlayerOption.Button.call(this, option);
};

VideoPlayback.Button.prototype = extend(PlayerOption.Button, {
	label: _('Playback'),
	tooltip: _('Set default playback state'),
	states: [_('PLAYING'), _('PAUSED'), _('STOPPED'), _('AUTO PAUSED'), _('AUTO STOPPED')]
});
