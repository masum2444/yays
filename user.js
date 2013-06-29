// #include "meta.jst"

// #include "license.jst"

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

unsafeWindow[Meta.ns] = {
	ns: Meta.ns
};

// #include "util.jst"
// #include "console.jst"
// #include "i18n.jst"
// #include "dom.jst"
// #include "config.jst"
// #include "jsonrequest.jst"
// #include "update.jst"
// #include "player.jst"
// #include "button.jst"
// #include "playeroption.jst"
// #include "ui.jst"

/*
 * Player ready callback.
 */

var onPlayerReady = asyncProxy(function() {
	var element = DH.id('movie_player') || DH.id('movie_player-flash') || DH.id('movie_player-html5');

	if (element) {
		try {
			Player.initialize(DH.unwrap(element)).onReady(function(player) {
				Console.debug('Player ready');

				var autoPlay = new AutoPlay(player), videoQuality = new VideoQuality(player), playerSize = new PlayerSize(player);

				playerSize.apply();
				autoPlay.apply();
				videoQuality.apply();

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
					}
					else if (DH.hasClass(page, 'channel')) {
						new ChannelUI([
							videoQuality.button(Button),
							autoPlay.button(Button)
						]);
					}
				}
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
