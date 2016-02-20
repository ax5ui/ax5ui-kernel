exports.render = function (input, out) {
    var _s = "", s, HTML, CSS, JS;
    var strip_indent = require('strip-indent');

    var _out = {
        w: function (text) {
            JS = strip_indent(text).replace(/<script+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\script>/gi, '').trim();
            _s = strip_indent(text).replace(/</g, "&lt;").trim();
        }
    };
    if (input.renderBody) {
        input.renderBody(_out);
    }

    out.write('<pre class="prettyprint linenums lang-js">');
    out.write(_s);
    out.write('</pre>');

    if (input.run) {
        out.write('<script type="text/javascript">');
        out.write( JS );
        out.write('</script>');
    }
};