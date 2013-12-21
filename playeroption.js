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

	apply: noop,
	cease: noop
};

/**
 * @class PlayerOption.Button
 */
PlayerOption.Button = function(option) {
	Button.call(this, this.label, this.tooltip);

	this._option = option;
};

PlayerOption.Button.extend = function(attributes) {
	var superclass = this;

	function Button(option) {
		superclass.call(this, option);
	}

	Button.prototype = extend(superclass, attributes);

	return Button;
};

PlayerOption.Button.prototype = extend(Button, {
	_option: null,

	label: null,
	tooltip: null,
	states: null,

	handler: function() {
		this._option.set((this._option.get() + 1) % this.states.length);
	},

	display: function() {
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
		}
	},

	cease: function() {
		this.mute(false);
	}
});

#include "videoplayback.js"

#include "videoquality.js"

#include "playersize.js"
