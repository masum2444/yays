/**
 * @class WatchUI
 */
function WatchUI(buttons) {
	UI.call(this, new UI.Content(buttons));

	DH.append(DH.id('watch7-secondary-actions'), this.button);
	DH.append(DH.id('watch7-action-panels'), this.panel);
}

WatchUI.prototype = extend(UI, {
	_def: {
		button: function(click) {
			return {
				tag: 'span',
				children: {
					tag: 'button',
					attributes: {
						'type': 'button',
						'role': 'button',
						'class': 'action-panel-trigger yt-uix-button yt-uix-button-text yt-uix-button-empty yt-uix-tooltip',
						'data-button-toggle': 'true',
						'data-trigger-for': 'action-panel-yays',
						'data-tooltip-text': _('Player settings')
					},
					listeners: {
						'click': click
					},
					children: {
						tag: 'span',
						attributes: {
							'class': 'yt-uix-button-icon-wrapper'
						},
						children: [UI.prototype._def.icon, {
							tag: 'span',
							attributes: {
								'class': 'yt-uix-button-valign'
							}
						}]
					}
				}
			};
		},

		panel: function(content) {
			return {
				attributes: {
					'id': 'action-panel-yays',
					'class': 'action-panel-content hid',
					'data-panel-loaded': 'true'
				},
				style: {
					'display': 'none',
					'color': '#333'
				},
				children: UI.prototype._def.panel(content)
			};
		}
	}
});
