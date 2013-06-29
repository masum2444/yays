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

unsafeWindow[Meta.ns] = {};

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
 * Player state change callback.
 */

unsafeWindow[Meta.ns].onPlayerStateChange = asyncProxy(function(state) {
	Console.debug('State changed to', ['unstarted', 'ended', 'playing', 'paused', 'buffering', undefined, 'cued'][state + 1]);

	AutoPlay.instance().apply();

	// Pausing playback doesn't have any effect if we immediately rebuffer the video in the new quality level.
	asyncCall(VideoQuality.instance().apply, VideoQuality.instance());
});

/*
 * Player ready callback.
 */

var onPlayerReady = asyncProxy(function() {
	var element = DH.id('movie_player') || DH.id('movie_player-flash') || DH.id('movie_player-html5');

	if (element) {
		try {
			Player.initialize(DH.unwrap(element)).onReady(function(player) {
				Console.debug('Player ready');

				AutoPlay.instance(new AutoPlay(player));
				VideoQuality.instance(new VideoQuality(player));
				PlayerSize.instance(new PlayerSize(player));

				AutoPlay.instance().apply();
				VideoQuality.instance().apply();

				player.addEventListener('onStateChange', Meta.ns + '.onPlayerStateChange');
			});

			var page = DH.id('page');
			if (page) {
				if (DH.hasClass(page, 'watch')) {
					new WatchUI();
				}
				else if (DH.hasClass(page, 'channel')) {
					try {
						new ChannelUI();
					}
					catch (e) {
						new OldChannelUI();
					}
				}
			}
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
