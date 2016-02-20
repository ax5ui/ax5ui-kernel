exports.render = function (input, out) {
    var _s = "", s, HTML, CSS, JS;
    var strip_indent = require('strip-indent');
    var _out = {
        w: function (text) {
            _s = strip_indent(text).replace(/</g, "&lt;").trim();
        }
    };
    if (input.renderBody) {
        input.renderBody(_out);
    }

    out.write('<pre class="prettyprint linenums lang-css">');
    out.write(_s);
    out.write('</pre>');
};