/*
 * Create XHR or JSONP requests.
 */

var JSONRequest = (function(namespace) {
	var Request = null;

	// XHR
	if (typeof GM_xmlhttpRequest == 'function') {
		Request = function(url, parameters, callback) {
			this._callback = callback;

			GM_xmlhttpRequest({
				method: 'GET',
				url: buildURL(url, parameters),
				onload: bind(this._onLoad, this)
			});
		};

		Request.prototype = {
			_onLoad: function(response) {
				this._callback(parseJSON(response.responseText));
			}
		};
	}
	// JSONP
	else {
		Request = (function() {
			var requests = [], requestsNs = 'jsonp';

			function Request(url, parameters, callback) {
				this._callback = callback;
				this._id = requests.push(bind(this._onLoad, this)) - 1;

				parameters.callback = namespace.concat('.', requestsNs, '[', this._id, ']');

				this._scriptNode = document.body.appendChild(DH.build({
					tag: 'script',
					attributes: {
						'type': 'text/javascript',
						'src': buildURL(url, parameters)
					}
				}));
			}

			Request.prototype = {
				_callback: null,
				_id: null,
				_scriptNode: null,

				_onLoad: function(response) {
					this._callback(response);

					document.body.removeChild(this._scriptNode);
					delete requests[this._id];
				}
			};

			unsafeWindow[namespace][requestsNs] = requests;

			return Request;
		})();
	}

	return Request;
})(Meta.ns);

