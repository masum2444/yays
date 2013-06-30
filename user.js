#include "meta.js"

#include "license.js"

function YAYS(unsafeWindow) {

/*
 * Meta.
 */

var Meta = {
	title:       APOSTROPHIZE(SCRIPT_NAME),
	version:     APOSTROPHIZE(SCRIPT_VERSION),
	revision:    APOSTROPHIZE(SCRIPT_REVISION),
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
#include "player.js"
#include "button.js"
#include "playeroption.js"
#include "ui.js"

/*
 * Player ready callback.
 */

var onPlayerReady = asyncProxy(function() {
	var element = DH.id('movie_player') || DH.id('movie_player-flash') || DH.id('movie_player-html5');

	if (element) {
		try {
			Player.initialize(DH.unwrap(element)).onReady(function(player) {
				var autoPlay = new AutoPlay(player), videoQuality = new VideoQuality(player), playerSize = new PlayerSize(player);

				player.onStateChange(function(state) {
					autoPlay.apply();
					videoQuality.apply();
				});

				var page = DH.id('page');
				if (page) {
					if (DH.hasClass(page, 'watch')) {
						new WatchUI([
							videoQuality.button(Button),
							playerSize.button(Button),
							autoPlay.button(Button)
						]);

						playerSize.apply();
					}
					else if (DH.hasClass(page, 'channel')) {
						new ChannelUI([
							videoQuality.button(Button),
							autoPlay.button(Button)
						]);
					}
				}

				autoPlay.apply();
				videoQuality.apply();
			});
		}
		catch (e) {
			Console.debug(e);
		}
	}
});

each(['onYouTubePlayerReady', 'ytPlayerOnYouTubePlayerReady'], function(i, callback) {
	unsafeWindow[callback] = extendFn(unsafeWindow[callback], onPlayerReady);
});

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
