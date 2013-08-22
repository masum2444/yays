/**
 * @class ChannelUI
 */
function ChannelUI(buttons) {
	UI.call(this, buttons);

	DH.append(DH.id('channel-navigation-menu'), {
		tag: 'li',
		children: [this.button, this.panel]
	});
}

ChannelUI.prototype = extend(UI, {
	_def: {
		button: function(click) {
			return {
				tag: 'button',
				attributes: {
					'type': 'button',
					'role': 'button',
					'class': 'epic-nav-item-empty yt-uix-button-epic-nav-item yt-uix-button yt-uix-button-empty yt-uix-tooltip flip',
					'data-button-menu-id': 'yays-panel-dropdown',
					'data-tooltip-text': _('Player settings')
				},
				style: {
					'position': 'absolute',
					'right': '20px',
					'width': '30px'
				},
				listeners: {
					'click': click
				},
				children: {
					tag: 'span',
					attributes: {
						'class': 'yt-uix-button-icon-wrapper'
					},
					style: {
						'opacity': '0.75'
					},
					children: [UI.prototype._def.icon, {
						tag: 'span',
						attributes: {
							'class': 'yt-uix-button-valign'
						}
					}]
				}
			};
		},

		panel: function(buttons) {
			return {
				attributes: {
					'id': 'yays-panel-dropdown',
					'class': 'epic-nav-item-dropdown hid'
				},
				style: {
					'padding': '5px 10px 10px',
					'width': '400px'
				},
				children: UI.prototype._def.panel(buttons)
			};
		}
	}
});
