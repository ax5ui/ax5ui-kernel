exports.render = function(input, out) {
	var _s = "", s, HTML, CSS, JS;
	var md = require('markdown-it')();

	var _out = {
		w: function(text) {

			var text_array = text.split(/\n/g);

			if (text_array.length > 0) {
				var find_first_line = false, i = 0;
				while (!find_first_line) {
					if (text_array[i] != '') {
						find_first_line = true;
					}
					else {
						i++;
					}
				}
			}
			text_array.splice(0, i);

			var remove_str_position = text_array[0].search(/[^ ^\t]/);
			var remove_str = text_array[0].substring(0, remove_str_position);

			text_array.forEach(function(s, idx) {
				if (s.substring(0, remove_str_position) == remove_str) {
					text_array[idx] = s.substr(remove_str_position);

				}
			});

			// 마지막 줄에 문자열이 있는지 확인
			var i = text_array.length;
			while (i--) {
				if (!/\S/.test(text_array[i])) {
					text_array.pop();
				}
				else {
					break;
				}
			}

			_s = md.render( text_array.join("\n")).replace(/<pre><code class="(.*)">/g, function(match, str){
				return '<pre class="prettyprint linenums ' + str.replace("language", "lang") + '"><code>';
			});
		}
	};
	if (input.renderBody) {
		input.renderBody(_out);
	}

	out.write(_s);
};