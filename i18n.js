/*
 * i18n
 */

var _ = (function() {
	var
	vocabulary = ["Auto play", "ON", "OFF", "AUTO", "Toggle video autoplay", "Quality", "AUTO", "ORIGINAL", "Set default video quality", "Size", "AUTO", "WIDE", "FIT", "Set default player size", "Player settings", "Help"],
	dictionary = combine(vocabulary, (function() {
		switch ((document.documentElement.lang || 'en').substr(0, 2)) {
			// hungarian - eugenox
			case 'hu':
				return ["Automatikus lej\u00e1tsz\u00e1s", "BE", "KI", "AUTO", "Automatikus lej\u00e1tsz\u00e1s ki-be kapcsol\u00e1sa", "Min\u0151s\u00e9g", "AUTO", "EREDETI", "Vide\u00f3k alap\u00e9rtelmezett felbont\u00e1sa", "M\u00e9ret", "AUTO", "SZ\u00c9LES", "ILLESZTETT", "Lej\u00e1tsz\u00f3 alap\u00e9rtelmezett m\u00e9rete", "Lej\u00e1tsz\u00f3 be\u00e1ll\u00edt\u00e1sai", "S\u00fag\u00f3"];

			// dutch - Mike-RaWare
			case 'nl':
				return ["Auto spelen", "AAN", "UIT", "AUTOMATISCH", "Stel automatisch afspelen in", "Kwaliteit", "AUTOMATISCH", null, "Stel standaard videokwaliteit in", null, null, null, null, null, null, null];

			// spanish - yonane
			case 'es':
				return ["Reproducci\u00f3n Autom\u00e1tica", null, null, "AUTO", "Modificar Reproducci\u00f3n Autom\u00e1tica", "Calidad", "AUTO", null, "Usar calidad por defecto", null, null, null, null, null, null, null];

			// german - xemino
			case 'de':
				return ["Automatische Wiedergabe", "AN", "AUS", "AUTO", "Automatische Wiedergabe umschalten", "Qualit\u00e4t", "AUTO", null, "Standard Video Qualit\u00e4t setzen", null, null, null, null, null, null, null];

			// portuguese - Pitukinha
			case 'pt':
				return ["Reprodu\u00e7\u00e3o Autom\u00e1tica", "LIGADO", "DESLIGADO", "AUTOM\u00c1TICO", "Modificar Reprodu\u00e7\u00e3o Autom\u00e1tica", "Qualidade", "AUTOM\u00c1TICO", null, "Defini\u00e7\u00e3o padr\u00e3o de v\u00eddeo", null, null, null, null, null, "Configura\u00e7\u00e3o do usu\u00e1rio", null];

			// greek - TastyTeo
			case 'el':
				return ["\u0391\u03c5\u03c4\u03cc\u03bc\u03b1\u03c4\u03b7 \u03b1\u03bd\u03b1\u03c0\u03b1\u03c1\u03b1\u03b3\u03c9\u03b3\u03ae", "\u0395\u039d\u0395\u03a1\u0393\u039f", "\u0391\u039d\u0395\u039d\u0395\u03a1\u0393\u039f", "\u0391\u03a5\u03a4\u039f\u039c\u0391\u03a4\u039f", "\u0395\u03bd\u03b1\u03bb\u03bb\u03b1\u03b3\u03ae \u03b1\u03c5\u03c4\u03cc\u03bc\u03b1\u03c4\u03b7\u03c2 \u03b1\u03bd\u03b1\u03c0\u03b1\u03c1\u03b1\u03b3\u03c9\u03b3\u03ae\u03c2", "\u03a0\u03bf\u03b9\u03cc\u03c4\u03b7\u03c4\u03b1", "\u0391\u03a5\u03a4\u039f\u039c\u0391\u03a4\u039f", "\u03a0\u03a1\u039f\u0395\u03a0\u0399\u039b\u039f\u0393\u0397", "\u039f\u03c1\u03b9\u03c3\u03bc\u03cc\u03c2 \u03c0\u03c1\u03bf\u03b5\u03c0\u03b9\u03bb\u03b5\u03b3\u03bc\u03ad\u03bd\u03b7\u03c2 \u03c0\u03bf\u03b9\u03cc\u03c4\u03b7\u03c4\u03b1\u03c2 \u03b2\u03af\u03bd\u03c4\u03b5\u03bf", "\u039c\u03ad\u03b3\u03b5\u03b8\u03bf\u03c2", "\u0391\u03a5\u03a4\u039f\u039c\u0391\u03a4\u039f", "\u03a0\u039b\u0391\u03a4\u03a5", "\u03a0\u03a1\u039f\u03a3\u0391\u03a1\u039c\u039f\u0393\u0397", "\u039f\u03c1\u03b9\u03c3\u03bc\u03cc\u03c2 \u03c0\u03c1\u03bf\u03b5\u03c0\u03b9\u03bb\u03b5\u03b3\u03bc\u03ad\u03bd\u03b7\u03c2 \u03b1\u03bd\u03ac\u03bb\u03c5\u03c3\u03b7\u03c2 \u03b1\u03bd\u03b1\u03c0\u03b1\u03c1\u03b1\u03b3\u03c9\u03b3\u03ad\u03b1", "\u0395\u03c0\u03b9\u03bb\u03bf\u03b3\u03ad\u03c2 \u03b1\u03bd\u03b1\u03c0\u03b1\u03c1\u03b1\u03b3\u03c9\u03b3\u03ad\u03b1", "\u0392\u03bf\u03ae\u03b8\u03b5\u03b9\u03b1"];

			// french - eXa
			case 'fr':
				return ["Lecture Auto", "ON", "OFF", "AUTO", "Lecture auto ON/OFF", "Qualit\u00e9", "AUTO", "ORIGINAL", "Qualit\u00e9 par d\u00e9faut", "Taille", "AUTO", "LARGE", "ADAPT\u00c9", "Taille par d\u00e9faut du lecteur", "Options du lecteur", "Aide"];

			// slovenian - Paranoia.Com
			case 'sl':
				return ["Samodejno predvajanje", "Vklju\u010di", "Izklju\u010di", "Samodejno", "Vklop/izklop samodejnega predvajanja", "Kakovost", "Samodejno", null, "Nastavi privzeto kakovost videa", null, null, null, null, null, "Nastavitve predvajalnika", "Pomo\u010d"];

			// russian - an1k3y
			case 'ru':
				return ["\u0410\u0432\u0442\u043e \u0432\u043e\u0441\u043f\u0440\u043e\u0438\u0437\u0432\u0435\u0434\u0435\u043d\u0438\u0435", "\u0412\u041a\u041b", "\u0412\u042b\u041a\u041b", "\u0410\u0412\u0422\u041e", "\u0410\u0432\u0442\u043e\u0437\u0430\u043f\u0443\u0441\u043a \u0432\u0438\u0434\u0435\u043e", "\u041a\u0430\u0447\u0435\u0441\u0442\u0432\u043e", "\u0410\u0412\u0422\u041e", null, "\u041a\u0430\u0447\u0435\u0441\u0442\u0432\u043e \u0432\u0438\u0434\u0435\u043e \u043f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e", "\u0420\u0410\u0417\u041c\u0415\u0420", null, "\u0420\u0410\u0417\u0412\u0415\u0420\u041d\u0423\u0422\u042c", "\u0420\u0410\u0421\u0422\u042f\u041d\u0423\u0422\u042c", "\u0420\u0430\u0437\u043c\u0435\u0440 \u0432\u0438\u0434\u0435\u043e \u043f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e", "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 \u043f\u043b\u0435\u0435\u0440\u0430", "\u041f\u043e\u043c\u043e\u0449\u044c"];

			// hebrew - baryoni
			case 'iw':
				return ["\u05d4\u05e4\u05e2\u05dc\u05d4 \u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9\u05ea", "\u05e4\u05e2\u05d9\u05dc", "\u05db\u05d1\u05d5\u05d9", "\u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9", "\u05e9\u05e0\u05d4 \u05de\u05e6\u05d1 \u05d4\u05e4\u05e2\u05dc\u05d4 \u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9\u05ea \u05e9\u05dc \u05d4\u05d5\u05d9\u05d3\u05d0\u05d5", "\u05d0\u05d9\u05db\u05d5\u05ea", "\u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9\u05ea", null, "\u05d4\u05d2\u05d3\u05e8 \u05d0\u05ea \u05d0\u05d9\u05db\u05d5\u05ea \u05d1\u05e8\u05d9\u05e8\u05ea \u05d4\u05de\u05d7\u05d3\u05dc \u05e9\u05dc \u05d4\u05d5\u05d9\u05d3\u05d0\u05d5", "\u05d2\u05d5\u05d3\u05dc", null, "\u05e8\u05d7\u05d1", "\u05de\u05dc\u05d0", "\u05d4\u05d2\u05d3\u05e8 \u05d0\u05ea \u05d2\u05d5\u05d3\u05dc \u05d1\u05e8\u05d9\u05e8\u05ea \u05d4\u05de\u05d7\u05d3\u05dc \u05e9\u05dc \u05d4\u05e0\u05d2\u05df", "\u05d4\u05d2\u05d3\u05e8\u05d5\u05ea \u05e0\u05d2\u05df", "\u05e2\u05d6\u05e8\u05d4"];

			// chinese - blankhang
			case 'zh':
				return ["\u81ea\u52a8\u64ad\u653e", "\u5f00", "\u5173", "\u81ea\u52a8", "\u5207\u6362\u89c6\u9891\u81ea\u52a8\u64ad\u653e", "\u89c6\u9891\u8d28\u91cf", "\u81ea\u52a8", "\u539f\u753b", "\u8bbe\u7f6e\u9ed8\u8ba4\u89c6\u9891\u8d28\u91cf", "\u64ad\u653e\u5668\u5927\u5c0f", "\u81ea\u52a8", "\u5bbd\u5c4f", "\u81ea\u9002\u5e94", "\u8bbe\u7f6e\u64ad\u653e\u5668\u9ed8\u8ba4\u5927\u5c0f", "\u64ad\u653e\u5668\u8bbe\u7f6e", "\u5e2e\u52a9"];

			// polish - mkvs
			case 'pl':
				return ["Automatyczne odtwarzanie", "W\u0141\u0104CZONE", "WY\u0141ACZNONE", "AUTOMATYCZNE", "Ustaw automatyczne odtwarzanie film\u00f3w", "Jako\u015b\u0107", "AUTOMATYCZNA", "ORYGINALNA", "Ustaw domy\u015bln\u0105 jako\u015b\u0107 film\u00f3w", "Rozmiar", "AUTOMATYCZNY", "SZEROKI", "DOPASOWANY", "Ustaw domy\u015blny rozmiar odtwarzacza", "Ustawienia odtwarzacza", "Pomoc"];

			// swedish - eson
			case 'sv':
				return ["Automatisk uppspelning", "P\u00c5", "AV", "AUTO", "V\u00e4xla uppspelningsl\u00e4ge", "Kvalitet", "AUTO", "ORIGINAL", "Ange standardkvalitet", "Storlek", "AUTO", "BRED", "ANPASSAD", "Ange standardstorlek", "Inst\u00e4llningar", "Hj\u00e4lp"];
		}

		return [];
	})());

	return function(text) { return dictionary[text] || text; };
})();

