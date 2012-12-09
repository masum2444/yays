/*
 * DOM Helper singleton.
 */

var DH = {
	ELEMENT_NODE: 1,

	build: function(def) {
		switch (Object.prototype.toString.call(def)) {
			case '[object Object]':
				def = merge({tag: 'div', style: null, attributes: null, listeners: null, children: null}, def);

				var node = this.createElement(def.tag);

				if (def.style !== null)
					this.style(node, def.style);

				if (def.attributes !== null)
					this.attributes(node, def.attributes);

				if (def.listeners !== null)
					this.listeners(node, def.listeners);

				if (def.children !== null)
					this.append(node, def.children);

				return node;

			case '[object String]':
				return this.createTextNode(def);

			default:
				return def;
		}
	},

	id: bind(unsafeWindow.document.getElementById, unsafeWindow.document),
	createElement: bind(unsafeWindow.document.createElement, unsafeWindow.document),
	createTextNode: bind(unsafeWindow.document.createTextNode, unsafeWindow.document),

	style: function(node, style) {
		each(style, node.style.setProperty, node.style);
	},

	append: function(node, children) {
		each([].concat(children), function(i, child) { node.appendChild(this.build(child)); }, this);
		node.normalize();
	},

	insertAfter: function(node, children) {
		var parent = node.parentNode, sibling = node.nextSibling;
		if (sibling) {
			each([].concat(children), function(i, child) { parent.insertBefore(this.build(child), sibling); }, this);
			parent.normalize();
		}
		else
			this.append(parent, children);
	},

	prepend: function(node, children) {
		if (node.hasChildNodes())
			each([].concat(children), function(i, child) { node.insertBefore(this.build(child), node.firstChild); }, this);
		else
			this.append(node, children);
	},

	attributes: function(node, attributes) {
		each(attributes, node.setAttribute, node);
	},

	hasClass: function(node, clss) {
		return \
			node.hasAttribute('class') &&
			(clss instanceof RegExp ? clss.test(node.getAttribute('class')) : node.getAttribute('class').indexOf(clss) != -1);
	},

	addClass: function(node, clss) {
		if (clss.indexOf(' ') == -1) {
			if (! this.hasClass(node, clss))
				node.setAttribute('class', (node.getAttribute('class') || '').concat(' ', clss).trim());
		}
		else
			each(clss.split(/ +/), function(i, clss) { this.addClass(node, clss); }, this);
	},

	delClass: function(node, clss) {
		clss = clss.trim().replace(/ +/g, '|');

		if (this.hasClass(node, new RegExp(clss)))
			node.setAttribute('class', node.getAttribute('class').replace(new RegExp('\\s*'.concat(clss, '\\s*'), 'g'), ' ').trim());
	},

	listeners: function(node, listeners) {
		each(listeners, function(type, listener) { this.on(node, type, listener); }, this);
	},

	on: function(node, type, listener) {
		node.addEventListener(type, listener, false);
	},

	un: function(node, type, listener) {
		node.removeEventListener(type, listener, false);
	},

	unwrap: function(element) {
		if (typeof XPCNativeWrapper != 'undefined' && typeof XPCNativeWrapper.unwrap == 'function')
			return XPCNativeWrapper.unwrap(element);

		return element;
	},

	walk: function(node, path) {
		var steps = path.split('/'), step = null;

		while (node && (step = steps.shift())) {
			if (step == '..') {
				node = node.parentNode;
				continue;
			}

			var
				selector = /^(\w*)(?:\[(\d+)\])?$/.exec(step),
				name = selector[1],
				index = Number(selector[2]) || 0;

			for (var i = 0, j = 0, nodes = node.childNodes; node = nodes.item(i); ++i)
				if (node.nodeType == this.ELEMENT_NODE && (! name || node.tagName.toLowerCase() == name) && j++ == index)
					break;
		}

		return node;
	}
};

