/**
 * @class Player
 */
function Player(element) {
	this._element = element;

	this._exportApiInterface();

	Console.debug('Player ready');

	this._listeners = {};
	this._muted = Number(this.isMuted());
	this._video = this.getVideoId();

	Context.onPlayerStateChange = asyncProxy(bind(this._onStateChange, this));
	this.addEventListener('onStateChange', Context.ns + '.onPlayerStateChange');
}

merge(Player, {
	UNSTARTED: -1,
	ENDED: 0,
	PLAYING: 1,
	PAUSED: 2,
	BUFFERING: 3,
	CUED: 5,

	instance: {
		_element: null
	},

	create: function(element) {
		switch (element.tagName) {
			case 'EMBED':
				return new FlashPlayer(element);
			case 'DIV':
				return new HTML5Player(element);
		}

		throw 'Unknown player type';
	},

	initialize: function(element) {
		if (! element) {
			throw 'Invalid player element';
		}

		if (this.instance._element === element) {
			throw 'Player already initialized';
		}

		return this.instance = this.create(element);
	}
});

Player.prototype = {
	_element: null,
	_listeners: null,
	_muted: 0,
	_video: null,

	_exportApiInterface: function() {
		each(this._element.getApiInterface(), function(i, method) {
			if (! (method in this)) {
				this[method] = bind(this._element[method], this._element);
			}
		}, this);
	},

	_listenEvent: function(name, listener) {
		this._listeners[name] = listener;
	},

	_dispatchEvent: function(name /* ... */) {
		if (name in this._listeners) {
			this._listeners[name].apply(null, [this].concat(Array.prototype.slice.call(arguments, 1)));
		}
	},

	_onStateChange: function(state) {
		Console.debug('State changed to', ['unstarted', 'ended', 'playing', 'paused', 'buffering', undefined, 'cued'][state + 1]);

		if (state == Player.UNSTARTED && this._video != this.getVideoId()) {
			this._onVideoChange();
		}

		this._dispatchEvent('statechange', state);
	},

	_onVideoChange: function() {
		Console.debug('Video changed');

		this._video = this.getVideoId();

		this._dispatchEvent('videochange');
	},

	onStateChange: function(listener) {
		this._listenEvent('statechange', listener);
	},

	onVideoChange: function(listener) {
		this._listenEvent('videochange', listener);
	},

	getArgument: function(name) {
		return;
	},

	isAutoPlaying: function() {
		return (this.getArgument('autoplay') || '1') == 1;
	},

	isPlayerState: function() {
		return Array.prototype.indexOf.call(arguments, this.getPlayerState()) > -1;
	},

	getVideoId: function() {
		try {
			return this.getVideoData().video_id;
		}
		catch (e) {
			return (this.getVideoUrl().match(/\bv=([\w-]+)/) || [, undefined])[1];
		}
	},

	seekToStart: function(ahead) {
		var
			code = (location.hash + location.search).match(/\bt=(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?|\bat=(\d+)/) || new Array(5),
			seconds = (Number(code[1]) || 0) * 3600 + (Number(code[2]) || 0) * 60 + (Number(code[3]) || Number(code[4]) || 0);

		this.seekTo(seconds, ahead);
	},

	resetState: function() {
		this.seekTo(this.getCurrentTime(), true);
	},

	mute: function() {
		if (! this._muted++) {
			this._element.mute();
		}
	},

	unMute: function() {
		if (! --this._muted) {
			this._element.unMute();
		}
	}
};

/**
 * @class FlashPlayer
 */
function FlashPlayer(element) {
	Player.call(this, element);
}

FlashPlayer.prototype = extend(Player, {
	_exportApiInterface: function() {
		try {
			Player.prototype._exportApiInterface.call(this);
		}
		catch (e) {
			throw 'Player not loaded yet';
		}
	},

	getArgument: function(name) {
		var match = new RegExp('(?:^|&)' + name + '=(.+?)(?:&|$)').exec(this._element.getAttribute('flashvars') || '');
		return match ? decodeURIComponent(match[1]) : undefined;
	}
});

/**
 * @class HTML5Player
 */
function HTML5Player(element) {
	Player.call(this, element);

	this._state = element.getPlayerState();
}

HTML5Player.prototype = extend(Player, {
	_state: null,

	_onStateChange: function(state) {
		this._state = state;

		Player.prototype._onStateChange.call(this, state);
	},

	getPlayerState: function() {
		return this._state;
	},

	getArgument: function(name) {
		try {
			return unsafeWindow.ytplayer.config.args[name];
		}
		catch (e) {
			return;
		}
	},

	playVideo: function() {
		this._element.playVideo();

		this._state = Player.PLAYING;
	},

	pauseVideo: function() {
		this._element.pauseVideo();

		this._state = Player.PAUSED;
	},

	stopVideo: function() {
		this._element.stopVideo();

		this._state = Player.CUED;
	},

	setPlaybackQuality: function(quality) {
		this._element.setPlaybackQuality(quality);

		asyncCall(function() {
			if (this.isPlayerState(Player.PLAYING, Player.BUFFERING)) {
				this.playVideo();
			}
		}, this);
	}
});
