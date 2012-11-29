/*
 * i18n
 */

var _ = (function() {
	var
	vocabulary = [
		'Auto play', 'ON', 'OFF', 'AUTO', 'Toggle video autoplay',
		'Quality', 'AUTO', 'ORIGINAL', 'Set default video quality',
		'Size', 'AUTO', 'WIDE', 'FIT', 'Set default player size',
		'Player settings', 'Help'
	],
	dictionary = combine(vocabulary, (function() {
		switch ((document.documentElement.lang || 'en').substr(0, 2)) {
			// hungarian - magyar
			case 'hu':
				return [
					'Automatikus lej\xE1tsz\xE1s', 'BE', 'KI', 'AUTO', 'Automatikus lej\xE1tsz\xE1s ki-be kapcsol\xE1sa',
					'Min\u0151s\xE9g', undefined, 'EREDETI', 'Vide\xF3k alap\xE9rtelmezett felbont\xE1sa',
					'M\xE9ret', undefined, 'SZ\xC9LES', 'ILLESZTETT', 'Lej\xE1tsz\xF3 alap\xE9rtelmezett m\xE9rete',
					'Lej\xE1tsz\xF3 be\xE1ll\xEDt\xE1sai', 'S\xFAg\xF3'
				];

			// dutch - nederlands (Mike-RaWare @userscripts.org)
			case 'nl':
				return [
					'Auto spelen', 'AAN', 'UIT', 'AUTOMATISCH', 'Stel automatisch afspelen in',
					'Kwaliteit', 'AUTOMATISCH', undefined, 'Stel standaard videokwaliteit in',
					undefined, undefined, undefined, undefined, undefined,
					undefined, undefined
				];

			// spanish - español (yonane @userscripts.org)
			case 'es':
				return [
					'Reproducci\xF3n Autom\xE1tica', undefined, undefined, 'AUTO', 'Modificar Reproducci\xF3n Autom\xE1tica',
					'Calidad', 'AUTO', undefined, 'Usar calidad por defecto',
					undefined, undefined, undefined, undefined, undefined,
					undefined, undefined
				];

			// german - deutsch (xemino @userscripts.org)
			case 'de':
				return [
					'Automatische Wiedergabe', 'AN', 'AUS', 'AUTO', 'Automatische Wiedergabe umschalten',
					'Qualit\xE4t', 'AUTO', undefined, 'Standard Video Qualit\xE4t setzen',
					undefined, undefined, undefined, undefined, undefined,
					undefined, undefined
				];

			// brazilian portuguese - português brasileiro (Pitukinha @userscripts.org)
			case 'pt':
				return [
					'Reprodu\xE7\xE3o Autom\xE1tica', 'LIGADO', 'DESLIGADO', 'AUTOM\xC1TICO', 'Modificar Reprodu\xE7\xE3o Autom\xE1tica',
					'Qualidade', 'AUTOM\xC1TICO', undefined, 'Defini\xE7\xE3o padr\xE3o de v\xEDdeo',
					undefined, undefined, undefined, undefined, undefined,
					'Configura\xE7\xE3o do usu\xE1rio', undefined
				];

			// greek - Έλληνες (TastyTeo @userscripts.org)
			case 'el':
				return [
					'\u0391\u03C5\u03C4\u03CC\u03BC\u03B1\u03C4\u03B7 \u03B1\u03BD\u03B1\u03C0\u03B1\u03C1\u03B1\u03B3\u03C9\u03B3\u03AE', '\u0395\u039D\u0395\u03A1\u0393\u039F', '\u0391\u039D\u0395\u039D\u0395\u03A1\u0393\u039F', '\u0391\u03A5\u03A4\u039F\u039C\u0391\u03A4\u0397', '\u0395\u03BD\u03B1\u03BB\u03BB\u03B1\u03B3\u03AE \u03B1\u03C5\u03C4\u03CC\u03BC\u03B1\u03C4\u03B7\u03C2 \u03B1\u03BD\u03B1\u03C0\u03B1\u03C1\u03B1\u03B3\u03C9\u03B3\u03AE\u03C2',
					'\u03A0\u03BF\u03B9\u03CC\u03C4\u03B7\u03C4\u03B1', '\u0391\u03A5\u03A4\u039F\u039C\u0391\u03A4\u0397', undefined, '\u039F\u03C1\u03B9\u03C3\u03BC\u03CC\u03C2 \u03C0\u03C1\u03BF\u03B5\u03C0\u03B9\u03BB\u03B5\u03B3\u03BC\u03AD\u03BD\u03B7\u03C2 \u03C0\u03BF\u03B9\u03CC\u03C4\u03B7\u03C4\u03B1\u03C2 \u03B2\u03AF\u03BD\u03C4\u03B5\u03BF',
					undefined, undefined, undefined, undefined, undefined,
					'\u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AD\u03C2 Player', undefined
				];

			// french - français (eXa @userscripts.org)
			case 'fr':
				return [
					'Lecture Auto', undefined, undefined, undefined, 'Lecture auto ON/OFF',
					'Qualit\xE9', undefined, undefined, 'Qualit\xE9 par d\xE9faut',
					undefined, undefined, undefined, undefined, undefined,
					'Option du lecteur', undefined
				];

			// slovenian - slovenščina (Paranoia.Com @userscripts.org)
			case 'sl':
				return [
					'Samodejno predvajanje', 'Vklju\u010Di', 'Izklju\u010Di', 'Samodejno', 'Vklop/izklop samodejnega predvajanja',
					'Kakovost', 'Samodejno', undefined, 'Nastavi privzeto kakovost videa',
					undefined, undefined, undefined, undefined, undefined,
					'Nastavitve predvajalnika', 'Pomo\u010D'
				];

			// russian - русский (an1k3y @userscripts.org)
			case 'ru':
				return [
					'\u0410\u0432\u0442\u043E \u0432\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435', '\u0412\u041A\u041B', '\u0412\u042B\u041A\u041B', '\u0410\u0412\u0422\u041E', '\u0410\u0432\u0442\u043E\u0437\u0430\u043F\u0443\u0441\u043A \u0432\u0438\u0434\u0435\u043E',
					'\u041A\u0430\u0447\u0435\u0441\u0442\u0432\u043E', '\u0410\u0412\u0422\u041E', undefined, '\u041A\u0430\u0447\u0435\u0441\u0442\u0432\u043E \u0432\u0438\u0434\u0435\u043E \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E',
					'\u0420\u0410\u0417\u041C\u0415\u0420', undefined, '\u0420\u0410\u0417\u0412\u0415\u0420\u041D\u0423\u0422\u042C', '\u0420\u0410\u0421\u0422\u042F\u041D\u0423\u0422\u042C', '\u0420\u0430\u0437\u043C\u0435\u0440 \u0432\u0438\u0434\u0435\u043E \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E',
					'\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043F\u043B\u0435\u0435\u0440\u0430', '\u041F\u043E\u043C\u043E\u0449\u044C'
				];

			// hebrew - עברית (baryoni @userscripts.org)
			case 'iw':
				return [
					'\u05D4\u05E4\u05E2\u05DC\u05D4 \u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9\u05EA', '\u05E4\u05E2\u05D9\u05DC', '\u05DB\u05D1\u05D5\u05D9', '\u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9', '\u05E9\u05E0\u05D4 \u05DE\u05E6\u05D1 \u05D4\u05E4\u05E2\u05DC\u05D4 \u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9\u05EA \u05E9\u05DC \u05D4\u05D5\u05D9\u05D3\u05D0\u05D5',
					'\u05D0\u05D9\u05DB\u05D5\u05EA', '\u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9\u05EA', undefined, '\u05D4\u05D2\u05D3\u05E8 \u05D0\u05EA \u05D0\u05D9\u05DB\u05D5\u05EA \u05D1\u05E8\u05D9\u05E8\u05EA \u05D4\u05DE\u05D7\u05D3\u05DC \u05E9\u05DC \u05D4\u05D5\u05D9\u05D3\u05D0\u05D5',
					'\u05D2\u05D5\u05D3\u05DC', undefined, '\u05E8\u05D7\u05D1', '\u05DE\u05DC\u05D0', '\u05D4\u05D2\u05D3\u05E8 \u05D0\u05EA \u05D2\u05D5\u05D3\u05DC \u05D1\u05E8\u05D9\u05E8\u05EA \u05D4\u05DE\u05D7\u05D3\u05DC \u05E9\u05DC \u05D4\u05E0\u05D2\u05DF',
					'\u05D4\u05D2\u05D3\u05E8\u05D5\u05EA \u05E0\u05D2\u05DF', '\u05E2\u05D6\u05E8\u05D4'
				];
		}

		return [];
	})());

	return function(text) { return dictionary[text] || text; };
})();

