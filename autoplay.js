/*
 * Prevent autoplaying.
 */

function AutoPlay(player) {
	SilentPlayerOption.call(this, player, 'auto_play');

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

AutoPlay.prototype = extend(SilentPlayerOption, {
	_applied: false,
	_focused: false,
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

				this.mute(false);
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
				this._player.pauseVideo();

				Console.debug('Playback paused');

				this.mute(false);
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

