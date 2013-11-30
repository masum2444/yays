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
				DH.id('yays-player-size') || DH.append(document.body, {
					tag: 'style',
					attributes: {
						'id': 'yays-player-size',
						'type': 'text/css'
					},
					children: [
						'.watch-medium .player-width {',
							'width: 945px;',
						'}',
						'.watch-medium .player-height {',
							'height: 562px;',
						'}',
						'.watch-medium .watch7-playlist-bar-left {',
							'width: 645px;',
						'}',
						'.watch-medium #watch7-playlist-tray-container {',
							'left: 645px;',
						'}',
						'.watch-medium .html5-video-content, .watch-medium .html5-main-video {',
							'top: 0 !important;',
							'left: 0 !important;',
							'width: 100% !important;',
							'height: 100% !important;',
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

/**
 * @class PlayerSize.Button
 */
PlayerSize.Button = PlayerOption.Button.extend({
	label: _('Size'),
	tooltip: _('Set default player size'),
	states: [_('AUTO'), _('WIDE'), _('FIT')]
});
