function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      __loadTemplate = __helpers.l,
      __renderer = __helpers.r,
      _________node_modules_marko_node_modules_marko_layout_use_tag_js = __renderer(require("marko/node_modules/marko-layout/use-tag")),
      __tag = __helpers.t,
      _________node_modules_marko_node_modules_marko_layout_put_tag_js = __renderer(require("marko/node_modules/marko-layout/put-tag"));

  return function render(data, out) {
    __tag(out,
      _________node_modules_marko_node_modules_marko_layout_use_tag_js,
      {
        "template": __loadTemplate(data.layout_path, require),
        "getContent": function(__layoutHelper) {
          out.w('\n  ');
          __tag(out,
            _________node_modules_marko_node_modules_marko_layout_put_tag_js,
            {
              "into": "visual",
              "layout": __layoutHelper
            },
            function(out) {
              out.w('\n    <div class="docs-body-visual">\n      <div class="pattern"></div>\n      <div class="section">\n\n        AX5UI\n        ax5core\n        <button>Let\'s Play</button>\n\n      </div>\n    </div>\n  ');
            });

          out.w('\n  ');
          __tag(out,
            _________node_modules_marko_node_modules_marko_layout_put_tag_js,
            {
              "into": "body",
              "layout": __layoutHelper
            },
            function(out) {
              out.w('\n\n\n\n\n\n  ');
            });

          out.w('\n  ');
          __tag(out,
            _________node_modules_marko_node_modules_marko_layout_put_tag_js,
            {
              "into": "page-js",
              "layout": __layoutHelper
            },
            function(out) {
              out.w('\n    <script language="javascript">\n\n    </script>\n  ');
            });

          out.w('\n');
        },
        "*": {
          "pageTitle": "home",
          "bodyStyle": "main",
          "showHeader": true
        }
      });

    out.w('\n');
  };
}
(module.exports = require("marko").c(__filename)).c(create);