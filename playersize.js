/**
 * @class PlayerSize
 */
function PlayerSize(player) {
	PlayerOption.call(this, player, 'player_size');
}

PlayerSize.prototype = extend(PlayerOption, {
	apply: function() {
		var mode = this.get();

		switch (mode) {
			case 2: // FIT
				if (! DH.id('yays-player-size')) {
					DH.append(document.body, {
						tag: 'style',
						attributes: {
							'type': 'text/css',
							'id': 'yays-player-size'
						},
						children: [
							'.watch-medium .watch7-playlist-bar {',
								'width: 945px;',
							'}',
							'.watch-medium .watch7-playlist-bar-left {',
								'width: 670px;',
							'}',
							'.watch-medium #watch7-playlist-tray-container {',
								'left: 670px;',
							'}',
							'.watch-medium .player-width {',
								'width: 945px;',
							'}',
							'.watch-medium .player-height {',
								'height: 560px;',
							'}'
						]
					});
				}
				// no break;

			case 1: // WIDE
				DH.addClass(DH.id('watch7-container'), 'watch-wide');
				DH.addClass(DH.id('player') || DH.id('player-legacy'), 'watch-medium watch-playlist-collapsed');
				break;

			default:
				return;
		}

		Console.debug('Size set to', ['wide', 'fit'][mode - 1]);
	}
});

/**
 * @class PlayerSize.Button
 */
PlayerSize.Button = function(option) {
	PlayerOption.Button.call(this, option);
};

PlayerSize.Button.prototype = extend(PlayerOption.Button, {
	label: _('Size'),
	tooltip: _('Set default player size'),
	states: [_('AUTO'), _('WIDE'), _('FIT')]
});
