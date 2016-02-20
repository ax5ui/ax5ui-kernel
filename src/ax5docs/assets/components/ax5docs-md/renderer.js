exports.render = function (input, out) {
    var _s = "", s, _out, HTML, CSS, JS;
    var md = require('markdown-it')();
    var strip_indent = require('strip-indent');
    var fs = require('fs'), readFileData;

    if (input.file) { // readme file 처리
        readFileData = fs.readFileSync(input.file, 'utf8');
        _s = md.render(readFileData).replace(/<pre><code class="(.*)">/g, function (match, str) {
            return '<pre class="prettyprint linenums ' + str.replace("language", "lang") + '"><code>';
        });
    }
    else {
        _out = {
            w: function (text) {
                _s = md.render(strip_indent(text)).replace(/<pre><code class="(.*)">/g, function (match, str) {
                    return '<pre class="prettyprint linenums ' + str.replace("language", "lang") + '"><code>';
                });
            }
        };

        if (input.renderBody) {
            input.renderBody(_out);
        }
    }

    out.write(_s);
};