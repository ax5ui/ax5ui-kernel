exports.render = function(input, out) {
	var _s = "", s, HTML, CSS, JS;
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

			var remove_str_position = text_array[0].search(/[<>()\[\]{}\/a-zA-Z가-힝0-9 ]/);
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

			if(input.type == "js") {
				JS = text_array.join("\n");
			}
			else if(input.type == "css") {
				CSS = text_array.join("\n");
			}
			else if(input.type == "html") {
				HTML = text_array.join("\n");
			}

			_s = text_array.join("\n").replace(/</g, "&lt;");
		}
	};
	if (input.renderBody) {
		input.renderBody(_out);
	}

	out.write('<pre class="prettyprint linenums">');
	out.write(_s);
	out.write('</pre>');

	/*
	var data = {
		title              : input.title || "",
		description        : input.description || "",
		html               : HTML,
		css                : CSS,
		js                 : JS,
		
		html_pre_processor : "none",
		css_pre_processor  : "none",
		css_starter        : "neither",
		css_prefix_free    : false,
		js_pre_processor   : "none",
		js_modernizr       : true,
		js_library         : "",
		html_classes       : "",
		css_external       : "",
		js_external        : "http://ax5.io/assets/lib/ax5core/ax5core.js"
	};

	var JSONstring = JSON.stringify(data)
			// Quotes will screw up the JSON
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&apos;");

	var form =
		'<form action="http://codepen.io/pen/define" method="POST" target="codepen">' +
		'<input type="hidden" name="data" value=\'' + JSONstring + '\'>' +
		'<input type="image" src="http://s.cdpn.io/3/cp-arrow-right.svg" width="40" height="40" value="Create New Pen with Prefilled Data" class="codepen-mover-button">' +
		'</form>';

	out.write(form);
	*/

};