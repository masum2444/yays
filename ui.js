/*
 * Abstract UI class.
 */

function UI(buttons) {
	this.buttons = buttons;
	this.button = DH.build(this._def.button(bind(this.toggle, this)));
	this.panel = DH.build(this._def.panel(buttons));
}

UI.setVisible = function(node, visible) {
	DH[visible ? 'delClass' : 'addClass'](node, 'hid');
	DH.style(node, {
		'display': visible ? 'block' : 'none'
	});
};

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
					children: {
						tag: 'span',
						attributes: {
							'class': 'yt-uix-button-icon-wrapper'
						},
						children: [this.icon, {
							tag: 'span',
							attributes: {
								'class': 'yt-uix-button-valign'
							}
						}]
					},
					listeners: {
						'click': click
					}
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
		VideoQuality.button(Button),
		PlayerSize.button(Button),
		AutoPlay.button(Button)
	]);

	this.panel = DH.build({
		attributes: {
			'id': 'action-panel-yays',
			'class': 'action-panel-content hid',
			'data-panel-loaded': 'true'
		},
		style: {
			'display': 'none',
			'color': '#333'
		},
		children: this.panel
	});

	DH.append(DH.id('watch7-secondary-actions'), this.button);
	DH.prepend(DH.id('watch7-action-panels'), this.panel);

	PlayerSize.apply();
}

WatchUI.prototype = extend(UI, {
	toggle: function() {
		this.refresh();
	}
});

/*
 * ChannelUI class.
 */

function ChannelUI() {
	UI.call(this, [
		VideoQuality.button(Button),
		AutoPlay.button(Button)
	]);

	this.panel = DH.build({
		attributes: {
			'class': 'hid'
		},
		style: {
			'display': 'none',
			'margin-top': '7px'
		},
		children: this.panel
	});

	DH.append(DH.walk(DH.id('flag-video-panel'), '../h3/div'), [' ', this.button]);
	DH.insertAfter(DH.id('flag-video-panel'), this.panel);
}

ChannelUI.prototype = extend(UI, {
	_def: merge({
		button: function(click) {
			return {
				tag: 'button',
				style: {
					'padding': '0 4px'
				},
				attributes: {
					'type': 'button',
					'role': 'button',
					'class': 'yt-uix-button yt-uix-button-default yt-uix-tooltip yt-uix-tooltip-reverse yt-uix-button-empty',
					'title': _('Player settings')
				},
				children: this.icon,
				listeners: {
					'click': click
				}
			};
		}
	}, UI.prototype._def, false),

	toggle: function() {
		if (DH.hasClass(this.panel, 'hid')) {
			each(this.panel.parentNode.childNodes, function(i, node) {
				if (node.nodeType == DH.ELEMENT_NODE && node.tagName.toLowerCase() == 'div')
					UI.setVisible(node, false);
			});

			this.refresh();

			UI.setVisible(this.panel, true);
		}
		else
			UI.setVisible(this.panel, false);
	}
});

