/**
 * @class PlayerOption
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

/**
 * @class SilentPlayerOption
 */
function SilentPlayerOption(player, key) {
	PlayerOption.call(this, player, key);
}

SilentPlayerOption.prototype = extend(PlayerOption, {
	_muted: false,

	mute: function(state) {
		if (this._muted != state) {
			this._player[state ? 'mute' : 'unMute']();
			this._muted = state;

			Console.debug('Player', state ? 'muted' : 'unmuted');
		}
	}
});

#include "autoplay.js"

#include "videoquality.js"

#include "playersize.js"
