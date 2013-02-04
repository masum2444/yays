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
	debug('State changed to', ['unstarted', 'ended', 'playing', 'paused', 'buffering'][state + 1]);

	AutoPlay.apply();

	// Pausing playback doesn't have any effect if we rebuffer the video in the new quality level immediately.
	asyncCall(VideoQuality.apply, VideoQuality);
});

/*
 * Player ready callback.
 */

var onPlayerReady = asyncProxy(function() {
	var element = DH.id('movie_player') || DH.id('movie_player-flash') || DH.id('movie_player-html5');

	if (element) {
		try {
			Player.initialize(DH.unwrap(element)).onReady(function(player) {
				debug('Player ready');

				each([AutoPlay, VideoQuality, PlayerSize], function(i, option) {
					option.init(player);
				});

				AutoPlay.apply();
				VideoQuality.apply();

				player.addEventListener('onStateChange', Meta.ns + '.onPlayerStateChange');
			});
		}
		catch (e) {
			debug(e);
		}
	}
});

each(['onYouTubePlayerReady', 'ytPlayerOnYouTubePlayerReady'], function(i, callback) {
	unsafeWindow[callback] = extendFn(unsafeWindow[callback], onPlayerReady);
});

onPlayerReady();

var page = DH.id('page');
if (page) {
	if (DH.hasClass(page, 'watch'))
		new WatchUI();
	else if (DH.hasClass(page, 'channel'))
		new ChannelUI();
}

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
