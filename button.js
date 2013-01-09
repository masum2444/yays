/*
 * Button class.
 */

function Button(labelText, tooltipText, callbacks) {
	var
		node = DH.build(this._def.node),
		label = DH.build(this._def.label),
		indicator = DH.build(this._def.indicator);

	DH.attributes(node, {title: tooltipText});
	DH.append(label, labelText);
	DH.append(node, [label, indicator]);

	DH.on(node, 'click', bind(this._onClick, this));

	this._node = node;
	this._indicator = indicator.firstChild;

	merge(this, callbacks);
}

Button.prototype = {
	_indicator: null,
	_node: null,

	_def: {
		node: {
			tag: 'button',
			style: {
				'margin': '2px'
			},
			attributes: {
				'type': 'button',
				'class': 'yt-uix-button yt-uix-button-default yt-uix-tooltip'
			}
		},

		label: {
			tag: 'span',
			attributes: {
				'class': 'yt-uix-button-content'
			}
		},

		indicator: {
			tag: 'span',
			style: {
				'font-size': '14px',
				'margin-left': '5px'
			},
			attributes: {
				'class': 'yt-uix-button-content'
			},
			children: '-'
		}
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

