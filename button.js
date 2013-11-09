/**
 * @class Button
 */
function Button(label, tooltip) {
	this._node = DH.build(this._def(tooltip, label, this._indicator = DH.build('-')));
}

Button.prototype = {
	_indicator: null,
	_node: null,

	_def: function(tooltip, label, indicator) {
		return {
			tag: 'button',
			attributes: {
				'type': 'button',
				'class': 'yt-uix-button yt-uix-button-default yt-uix-tooltip',
				'title': tooltip
			},
			listeners: {
				'click': bind(this._onClick, this)
			},
			style: {
				'margin': '0 0.5%'
			},
			children: [{
				tag: 'span',
				attributes: {
					'class': 'yt-uix-button-content'
				},
				children: label
			}, {
				tag: 'span',
				style: {
					'font-size': '14px',
					'margin-left': '5px'
				},
				attributes: {
					'class': 'yt-uix-button-content'
				},
				children: indicator
			}]
		};
	},

	_onClick: function() {
		this.handler();
		this.refresh();
	},

	refresh: function() {
		this._indicator.data = this.display();
	},

	render: function() {
		this.refresh();
		return this._node;
	},

	handler: emptyFn,
	display: emptyFn
};
