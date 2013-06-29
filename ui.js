/*
 * Abstract UI class.
 */

function UI(buttons) {
	this.buttons = buttons;
	this.button = DH.build(this._def.button(bind(this.toggle, this)));
	this.panel = DH.build(this._def.panel(buttons));
}

UI.prototype = {
	_def: {
		icon: {
			tag: 'img',
			attributes: {
				'src': 'data:image/png;base64,\
iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAA4ElEQVQoz32RMU4CQRhG38xqQ0e7\
CbHCnnxHEM/AEUiIthZegFAYErIhegTuwAWIGYiWWGKypY0bkgUZCxZ2JIuvmnkz8//fzECA2ppq\
qnbozJ8NOZfA2tVKZwE0lFcGbADwoExeo6KCujxTzb1LLBBxDgsRpK/xmtuK5Uf3BEZvNKgXakEH\
mNAq5t+sjHxw5tp9gJosT27xHxe8By0m2rc4kPFpAPTAoDJkHyJQj2Fl9Zv4K51Z4OdsgB1YcC8k\
QO4MOQSjsUvKb9pn2crLa1ua4zOnAMRzrlhxly4PBn4BWEpBljV5iJUAAAAASUVORK5CYII='}
		},

		button: function(click) {
			return {
				listeners: {
					'click': click
				}
			};
		},

		panel: function(buttons) {
			return [{
				style: {
					'margin-bottom': '10px'
				},
				children: [{
					tag: 'strong',
					children: _('Player settings')
				}, {
					tag: 'a',
					attributes: {
						'href': Meta.site,
						'target': '_blank'
					},
					style: {
						'margin-left': '4px',
						'vertical-align': 'super',
						'font-size': '10px'
					},
					children: _('Help')
				}]
			}, {
				style: {
					'text-align': 'center',
				},
				children: map(bind(Button.prototype.render.call, Button.prototype.render), buttons)
// #if ! RELEASE
			}, {
				style: {
					'margin-top': '10px',
					'padding': '5px',
					'color': '#777777',
					'font-size': '10px',
					'border': '1px solid #e2e2e2'
				},
				children: Console.display
// #endif
			}];
		}
	},

	buttons: null,
	button: null,
	panel: null,

	refresh: function() {
		each(this.buttons, function(i, button) { button.refresh(); });
	},

	toggle: emptyFn
};

/*
 * WatchUI class.
 */

function WatchUI() {
	UI.call(this, [
		VideoQuality.instance().button(Button),
		PlayerSize.instance().button(Button),
		AutoPlay.instance().button(Button)
	]);

	DH.append(DH.id('watch7-secondary-actions'), this.button);
	DH.prepend(DH.id('watch7-action-panels'), this.panel);

	PlayerSize.instance().apply();
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

		panel: function(buttons) {
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
				children: UI.prototype._def.panel(buttons)
			};
		}
	},

	toggle: function() {
		this.refresh();
	}
});

/*
 * ChannelUI class.
 */

function ChannelUI() {
	UI.call(this, [
		VideoQuality.instance().button(Button),
		AutoPlay.instance().button(Button)
	]);

	DH.append(DH.id('channel-navigation-menu'), DH.build({
		tag: 'li',
		children: [this.button, this.panel]
	}));
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
					'width': '300px'
				},
				children: UI.prototype._def.panel(buttons)
			};
		}
	},

	toggle: function() {
		this.refresh();
	}
});

