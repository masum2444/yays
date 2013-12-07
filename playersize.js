/**
 * @class PlayerSize
 */
function PlayerSize(player) {
	PlayerOption.call(this, player, 'player_size');
}

#define CONTENT_WIDTH  960
#define PLAYER_WIDTH   854
#define PLAYER_HEIGHT  480
#define CONTROL_HEIGHT  30
#define PLAYLIST_WIDTH 300

#define SCALE                (CONTENT_WIDTH / PLAYER_WIDTH)
#define TRANSLATE(dimension) ((SCALE - 1) / 2 * dimension)

// |sx  0  0|   | 1  0 tx|   |     sx       0 sx * tx|
// | 0 sy  0| * | 0  1 ty| = |      0      sy sy * ty|
// | 0  0  1|   | 0  0  1|   |      0       0       1|

#define TRANSFORM [SCALE, 0, 0, SCALE, SCALE * TRANSLATE(PLAYER_WIDTH), SCALE * TRANSLATE(PLAYER_HEIGHT)]

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
							'width: ' + CONTENT_WIDTH + 'px;',
						'}',
						'.watch-medium .player-height {',
							'height: ' + (CONTENT_WIDTH / (PLAYER_WIDTH / PLAYER_HEIGHT) + CONTROL_HEIGHT) + 'px;',
						'}',
						'.watch-medium .watch7-playlist-bar-left {',
							'width: ' + (CONTENT_WIDTH - PLAYLIST_WIDTH) + 'px;',
						'}',
						'.watch-medium #watch7-playlist-tray-container {',
							'left: ' + (CONTENT_WIDTH - PLAYLIST_WIDTH) + 'px;',
						'}',
						'.watch-medium .html5-video-container {',
							'transform: matrix(' + TRANSFORM.join(', ') + ');',
							'-o-transform: matrix(' + TRANSFORM.join(', ') + ');',
							'-moz-transform: matrix(' + TRANSFORM.join(', ') + ');',
							'-webkit-transform: matrix(' + TRANSFORM.join(', ') + ');',
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
