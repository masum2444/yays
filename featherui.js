/**
 * @class FeatherUI
 */
function FeatherUI(buttons) {
	UI.call(this, map(function(button) { return new FeatherUI.ButtonDecorator(button); }, buttons));

	var toolbar = DH.walk(DH.id('movie_player'), '../../div[2]');

	DH.append(toolbar, this.button);
	DH.insertAfter(toolbar, this.panel);
}

FeatherUI.prototype = extend(UI, {
	_def: {
		button: function(click) {
			return {
				tag: 'button',
				attributes: {
					'class': 'b'
				},
				style: {
					'margin-left': '10px'
				},
				listeners: {
					'click': click
				},
				children: merge({
					style: {
						'vertical-align': 'sub',
						'opacity': '0.82'
					}
				}, UI.prototype._def.icon)
			};
		},

		panel: function(buttons) {
			return {
				attributes: {
					'class': 'hid'
				},
				style: {
					'padding': '10px',
					'margin-top': '0.5em'
				},
				children: UI.prototype._def.panel(buttons)
			}
		}
	},

	toggle: function() {
		UI.prototype.toggle.call(this);

		(DH.hasClass(this.panel, 'hid') ? DH.delClass : DH.addClass).call(DH, this.panel, 'hid');
	}
});

/**
 * @class FeatherUI.ButtonDecorator
 */
FeatherUI.ButtonDecorator = function(button) {
	this._button = button;

	DH.attributes(button._node, {
		'class': 'b'
	});

	DH.style(DH.walk(button._node, 'span[0]'), {
		'font-size': '11px'
	});

	DH.style(DH.walk(button._node, 'span[1]'), {
		'font-weight': 'bold'
	});
};

FeatherUI.ButtonDecorator.prototype = {
	_button: null,

	refresh: function() {
		return this._button.refresh();
	},

	render: function() {
		return this._button.render();
	}
};
