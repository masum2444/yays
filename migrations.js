/*
 * Migrations
 */

(function(current_version) {
	function versionLower(a, b) {
		for (var i = 0, a = a.split('.'), b = b.split('.'), parts = Math.max(a.length, b.length); i < parts; ++i) {
			if (a[i] != b[i]) {
				return Number(a[i] || 0) < Number(b[i] || 0);
			}
		}

		return false;
	}

	var previous_version = Config.get('version') || '1.0';

	if (previous_version == current_version) {
		return;
	}

	var migrations = [
		// Added "144p" to the quality levels.
		['1.7', function() {
			var video_quality = Number(Config.get('video_quality'));
			if (video_quality > 0 && video_quality < 7) {
				Config.set('video_quality', ++video_quality);
			}
		}]
	];

	while (versionLower(migrations[0][0], previous_version) && migrations.shift());

	for (var i = 0, len = migrations.length; i < len; ++i) {
		migrations[i][1]();
	}

	Config.set('version', current_version);
})(Meta.version);
