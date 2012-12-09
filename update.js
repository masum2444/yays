/*
 * Update checker.
 */

(function() {
	if (new Date().valueOf() - Number(Config.get('update_checked_at')) < 24 * 36e5) // 1 day
		return;

	var popup = null;

	new JSONRequest(Meta.site + '/changelog', {version: Meta.version}, function(changelog) {
		Config.set('update_checked_at', new Date().valueOf().toFixed());

		if (changelog && changelog.length)
			popup = renderPopup(changelog);
	});

	function renderPopup(changelog) {
		return document.body.appendChild(DH.build({
			style: {
				'position': 'fixed',
				'top': '15px',
				'right': '15px',
				'z-index': '1000',
				'padding': '10px 15px 10px',
				'background-color': '#f8f8f8',
				'border': '1px solid #cccccc'
			},
			children: [{
				tag: 'h3',
				style: {
					'text-align': 'center',
				},
				children: Meta.title
			}, {
				style: {
					'font-size': '11px',
					'color': '#808080',
					'text-align': 'center'
				},
				children: 'User Script update notification.'
			}, {
				tag: 'p',
				style: {
					'margin': '10px 0'
				},
				children: [
					'You are using version ',
					{
						tag: 'strong',
						children: Meta.version
					},
					', released on ',
					{
						tag: 'em',
						children: Meta.releasedate
					},
					'.',
					{
						tag: 'br'
					},
					'Please consider updating to the latest release.'
				]
			}, {
				children: map(function(entry) {
					return {
						style: {
							'margin-bottom': '5px'
						},
						children: [{
							tag: 'strong',
							style: {
								'font-size': '11px'
							},
							children: entry.version
						}, {
							tag: 'em',
							style: {
								'margin-left': '5px'
							},
							children: entry.date
						}, {
							style: {
								'padding': '0 0 2px 10px',
								'white-space': 'pre'
							},
							children: [].concat(entry.note).join('\n')
						}]
					};
				}, [].concat(changelog))
			}, {
				style: {
					'text-align': 'center',
					'padding': '10px 0'
				},
				children: map(function(text, handler) {
					return DH.build({
						tag: 'span',
						attributes: {
							'class': 'yt-uix-button yt-uix-button-default'
						},
						style: {
							'margin': '0 5px',
							'padding': '5px 10px'
						},
						children: text,
						listeners: {
							'click': handler
						}
					});
				}, ['Update', 'Dismiss'], [openDownloadSite, removePopup])
			}]
		}));
	}

	function removePopup() {
		document.body.removeChild(popup);
	}

	function openDownloadSite() {
		removePopup();
		unsafeWindow.open(buildURL(Meta.site + '/download', {version: Meta.version}));
	}
})();

