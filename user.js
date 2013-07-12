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
#include "migrations.js"

/*
 * Player ready callback.
 */

function onPlayerReady() {
	var element = DH.id('movie_player') || DH.id('movie_player-flash') || DH.id('movie_player-html5');

	if (element) {
		try {
			Player.initialize(DH.unwrap(element)).onReady(function onReady(player) {
				var autoPlay = new AutoPlay(player), videoQuality = new VideoQuality(player), playerSize = new PlayerSize(player);

				player.onStateChange(function(player, state) {
					if (state == Player.CUED) {
						onReady(player);
					}
					else {
						autoPlay.apply();
						videoQuality.apply();
					}
				});

				autoPlay.apply();
				videoQuality.apply();

				var page = DH.id('page');
				if (page) {
					if (DH.hasClass(page, 'watch')) {
						new WatchUI([
							new VideoQuality.Button(videoQuality),
							new PlayerSize.Button(playerSize),
							new AutoPlay.Button(autoPlay)
						]);

						playerSize.apply();
					}
					else if (DH.hasClass(page, 'channel')) {
						new ChannelUI([
							new VideoQuality.Button(videoQuality),
							new AutoPlay.Button(autoPlay)
						]);
					}
				}
			});
		}
		catch (e) {
			Console.debug(e);
		}
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
