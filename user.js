#include "meta.js"

#include "license.js"

function YAYS(unsafeWindow) {

/*
 * Meta.
 */

var Meta = {
	title:       APOSTROPHIZE(SCRIPT_NAME),
	version:     APOSTROPHIZE(SCRIPT_VERSION),
	releasedate: APOSTROPHIZE(SCRIPT_RELEASE_DATE),
	site:        APOSTROPHIZE(SCRIPT_SITE),
	ns:          APOSTROPHIZE(SCRIPT_NS)
};

/*
 * Script context.
 */

var Context = unsafeWindow[Meta.ns] = {
	ns: Meta.ns
};

#include "util.js"

#include "console.js"

#include "i18n.js"

#include "dom.js"

#include "config.js"

#include "jsonrequest.js"

#include "update.js"

#include "migrations.js"

#include "player.js"

#include "button.js"

#include "playeroption.js"

#include "ui.js"

/*
 * Player ready callback.
 */

function onPlayerReady() {
	try {
		var element = DH.unwrap(DH.id('movie_player') || DH.id('movie_player-flash') || DH.id('movie_player-html5'));

		Player.initialize(element).onReady(function onReady(player) {
			var videoPlayback = new VideoPlayback(player), videoQuality = new VideoQuality(player), playerSize = new PlayerSize(player);

			var videoId = player.getVideoId();

			player.onStateChange(function(player, state) {
				if (state == Player.CUED && videoId != player.getVideoId()) {
					onReady(player);
				}
				else {
					videoPlayback.apply();
					videoQuality.apply();
				}
			});

			videoPlayback.apply();
			videoQuality.apply();

			var page = DH.id('page');
			if (page) {
				if (DH.hasClass(page, 'watch')) {
					UI.initialize(WatchUI, [
						new VideoQuality.Button(videoQuality),
						new PlayerSize.Button(playerSize),
						new VideoPlayback.Button(videoPlayback)
					]);

					playerSize.apply();
				}
				else if (DH.hasClass(page, 'channel')) {
					UI.initialize(ChannelUI, [
						new VideoQuality.Button(videoQuality),
						new VideoPlayback.Button(videoPlayback)
					]);
				}
			}
		});
	}
	catch (e) {
		Console.debug(e);
	}
}

unsafeWindow.onYouTubePlayerReady = extendFn(unsafeWindow.onYouTubePlayerReady, asyncProxy(onPlayerReady));

onPlayerReady();

} // YAYS

if (window.top === window.self) {
	if (this['unsafeWindow']) { // Greasemonkey.
		YAYS(unsafeWindow);
	}
	else {
		var node = document.createElement('script');
		node.setAttribute('type', 'text/javascript');
		node.text = '('.concat(YAYS.toString(), ')(window);');

		document.body.appendChild(node);
		document.body.removeChild(node);
	}
}
