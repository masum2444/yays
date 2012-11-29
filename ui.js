/*
 * Abstract UI class.
 */

function UI() {
	this.buttons = this.buttons();
	this.button = this._def.button(bind(this.toggle, this));
	this.panel = this._def.panel(this.buttons);
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
iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIklEQVQ4y6WSPUoEQRCFv5kdWVAT\
DyDGJkKnpuoZJu5IUFeMRPYCaiAbOIhGL94LGHkBEbQ1XMM1N3EVVvxJaoelmRFHX1TV7/WrrupK\
qIH3fh04sPRI0lWVLqMel8CMxavA7I8G3vsesAe8SpoD3qcMvkwzMqNTSbsAiRGbwDnN0JFUpJa0\
aI60vBhCuHHOvQEbv7zclXQCkHjv74FFYCES3QG5xX3ARfwLMMyAlZoquaRHm1EODCJ+HlhO+Scy\
4KGmhb5VnrQQYwQ8JVN7sA8cNxjiYfkL3vstoNfg5WvOuecQwvVkBh9/aP+zXAZJF0BhxFhSAoyn\
xPHZmaSiNDCTDpBKaldsZ8s0bdNsU7XCIYQyds7dAkvAENgJIQxiDcA3XBdfpD8Lv/UAAAAASUVO\
RK5CYII='}
		},

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
				listeners: {click: click}
			};
		},

		panel: function(buttons) {
			return [{
				style: {
					'margin-bottom': '5px'
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

	button: null,
	panel: null,

	refresh: function() {
		each(this.buttons, function(i, button) { button.refresh(); });
	},

	buttons: emptyFn,
	toggle: emptyFn
};

/*
 * WatchUI class.
 */

function WatchUI() {
	UI.call(this);

	this.button = DH.build(this.button);

	this.panel = DH.build({
		attributes: {
			'class': 'watch-actions-panel'
		},
		children: this.panel
	});

	DH.insertAfter(DH.id('watch-flag'), [' ', this.button]);
	DH.prepend(DH.id('watch-actions-area'), this.panel);

	PlayerSize.apply();
}

WatchUI.prototype = extend(UI, {
	buttons: function() {
		return [
			VideoQuality.button(Button),
			PlayerSize.button(Button),
			AutoPlay.button(Button)
		];
	},

	toggle: function() {
		var container = DH.id('watch-actions-area-container');

		if (DH.hasClass(this.panel, 'hid') || DH.hasClass(container, 'hid')) {
			each(DH.id('watch-actions').getElementsByTagName('button'), function(i, button) {
				DH.delClass(button, 'active');
			});

			DH.addClass(this.button, 'active');

			each(DH.id('watch-actions-area').childNodes, function(i, node) {
				if (node.nodeType == DH.ELEMENT_NODE && DH.hasClass(node, 'watch-actions-panel'))
					UI.setVisible(node, false);
			});

			this.refresh();

			UI.setVisible(this.panel, true);
			UI.setVisible(container, true);
		}
		else {
			DH.delClass(this.button, 'active');

			UI.setVisible(container, false);
			UI.setVisible(this.panel, false);
		}
	}
});

/*
 * Watch7UI class.
 */

function Watch7UI() {
	UI.call(this);

	this.button = DH.build(this.button);

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
}

Watch7UI.prototype = extend(UI, {
	_def: merge({
		button: function(click) {
			return {
				tag: 'span',
				children: {
					tag: 'button',
					attributes: {
						'type': 'button',
						'role': 'button',
						'class': 'action-panel-trigger yt-uix-button yt-uix-button-hh-text yt-uix-button-empty',
						'data-button-toggle': 'true',
						'data-trigger-for': 'action-panel-yays'
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
					}
				}
			};
		}
	}, UI.prototype._def, false),

	buttons: function() {
		return [
			VideoQuality.button(Button7),
			AutoPlay.button(Button7)
		];
	}
});


/*
 * ChannelUI class.
 */

function ChannelUI() {
	UI.call(this);

	this.button = DH.build(this.button);

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
	buttons: function() {
		return [
			VideoQuality.button(Button),
			AutoPlay.button(Button)
		];
	},

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

/*
 * Channel7UI
 */

function Channel7UI() {
	ChannelUI.call(this);

	DH.delClass(this.button, 'yt-uix-button-default');
	DH.addClass(this.button, 'yt-uix-button-hh-default');
}

Channel7UI.prototype = extend(ChannelUI, {
	buttons: function() {
		return [
			VideoQuality.button(Button7),
			AutoPlay.button(Button7)
		];
	}
});
