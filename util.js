/*
 * Utility functions.
 */

function each(iterable, callback, scope) {
	if (iterable.length) {
		for (var i = 0, len = iterable.length; i < len; ++i)
			callback.call(scope, i, iterable[i]);
	}
	else {
		for (var key in iterable)
			if (iterable.hasOwnProperty(key))
				callback.call(scope, key, iterable[key]);
	}
}

function map() {
	var
		args = Array.prototype.constructor.apply([], arguments),
		callback = args.shift() || bind(Array.prototype.constructor, []),
		buffer = [];

	if (args.length > 1) {
		var i = 0, len = Math.max.apply(Math, map(function(arg) { return arg.length; }, args));
		function getter(arg) { return arg[i]; }

		for (; i < len; ++i)
			buffer.push(callback.apply(null, map(getter, args)));
	}
	else {
		for (var i = 0, arg = args[0], len = arg.length; i < len; ++i)
			buffer.push(callback(arg[i]));
	}

	return buffer;
}

function combine(keys, values) {
	var object = {};
	map(function(key, value) { object[key] = value; }, keys, values);

	return object;
}

function bind(func, scope, args) {
	return function() {
		return func.apply(scope, typeof args == 'undefined' ? arguments : args);
	};
}

function merge(target, source, override) {
	override = override === undefined || override;

	for (var key in source) {
		if (override || ! target.hasOwnProperty(key))
			target[key] = source[key];
	}

	return target;
}

function extend(base, proto) {
	function T() {}
	T.prototype = base.prototype;

	return merge(new T(), proto);
}

function asyncCall(func, scope, args) {
	setTimeout(bind(func, scope, args), 0);
}

function asyncProxy(func) {
	return function() {
		asyncCall(func, this, arguments);
	};
}

function extendFn(func, extension) {
	if (! func)
		return extension;

	return function() {
		asyncCall(func, this, arguments);

		extension.apply(this, arguments);
	};
}

function emptyFn() { return; };

function buildURL(path, parameters) {
	var query = [];
	each(parameters, function(key, value) { query.push(key.concat('=', encodeURIComponent(value))); });

	return path.concat('?', query.join('&'));
}

function parseJSON(data) {
	if (typeof JSON != 'undefined')
		return JSON.parse(data);

	return eval('('.concat(data, ')'));
}

function debug() {
	unsafeWindow.console.debug.apply(unsafeWindow.console, Array.prototype.concat.apply(['['.concat(Meta.ns, ']')], arguments));
}

