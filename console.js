/*
 * Console singleton.
 */

var Console = {
#if RELEASE
	debug: function() {
		unsafeWindow.console.debug.apply(unsafeWindow.console, Array.prototype.concat.apply(['['.concat(Meta.ns, ']')], arguments));
	}
#else
	display: document.createElement('pre'),

	debug: function() {
		var pieces = Array.prototype.concat.apply([], arguments);

		this.display.appendChild(document.createTextNode(pieces.join(' ') + '\n'));
		unsafeWindow.console.debug.apply(unsafeWindow.console, ['['.concat(Meta.ns, ']')].concat(pieces));
	}
#endif
};
