/**
 * @class PlayerSize
 */
function PlayerSize(player) {
	PlayerOption.call(this, player, 'player_size');
}

#define CONTENT_WIDTH  1040
#define PLAYER_WIDTH    854
#define PLAYER_HEIGHT   480
#define CONTROL_HEIGHT   30

#define SCALE (CONTENT_WIDTH / PLAYER_WIDTH)
#define TRANSLATE(dimension) ((SCALE - 1) / 2 * dimension)
#define TRANSFORM (SCALE, 0, 0, SCALE, TRANSLATE(PLAYER_WIDTH), TRANSLATE(PLAYER_HEIGHT))

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
						'.watch-medium,',
						'.watch-medium .player-width {',
							CONCATENATE('width: ', CONTENT_WIDTH, 'px !important;'),
						'}',
						'.watch-medium .player-height {',
							CONCATENATE('height: ', EVALUATE(CONTENT_WIDTH / (PLAYER_WIDTH / PLAYER_HEIGHT) + CONTROL_HEIGHT), 'px !important;'),
						'}',
						'.watch-medium .html5-video-content,',
						'.watch-medium .html5-main-video {',
							CONCATENATE('transform: matrix', EVALUATE(TRANSFORM), ' !important;'),
							CONCATENATE('-o-transform: matrix', EVALUATE(TRANSFORM), ' !important;'),
							CONCATENATE('-moz-transform: matrix', EVALUATE(TRANSFORM), ' !important;'),
							CONCATENATE('-webkit-transform: matrix', EVALUATE(TRANSFORM), ' !important;'),
						'}',
						'.watch-medium .html5-main-video {',
							'z-index: -1;',
						'}'
					]
				});

				// no break;

			case 1: // WIDE
				var container = DH.id('watch7-container'), player = DH.id('player');

				DH.addClass(container, 'watch-wide');
				DH.delClass(player, 'watch-small');
				DH.addClass(player, 'watch-medium');

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
