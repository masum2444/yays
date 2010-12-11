
// http://pygments.org/ Trac color scheme.

function toHexColor(rgbstring) {
	return String.prototype.concat.apply('#', rgbstring.match(new RegExp('\\d+', 'g')).map(function (color){
		var hex = Number(color).toString(16);
		return hex.length == 1 ? '0' + hex : hex;
	}));
}

var rules = document.styleSheets[1].cssRules, ruleCache = {};

function getCssText(selector) {
	var cssText = ruleCache[selector];
	
	if (! cssText) {
		for (var i = 0, rule; rule = rules[i]; i++) {
			if (rule.selectorText == selector) {
				cssText = ruleCache[selector] = rule.style.cssText;
				break;
			}
		}
	}
	
	return cssText;
}

var hlcode = document.getElementsByClassName('hlcode')[0];
var spans = hlcode.getElementsByTagName('span');
var i = 0, span;

while (span = spans[i++]) {
	css = getCssText('.syntax .' + span.getAttribute('class'));
	span.removeAttribute('class');
	
	if (! css) {
		span.parentNode.replaceChild(span.firstChild, span);
		i--;
	} else {
		//css = css.replace(new RegExp('rgb\\([\\d, ]+\\)'), toHexColor);
		span.setAttribute('style', css);
	}
}

hlcode.normalize();
