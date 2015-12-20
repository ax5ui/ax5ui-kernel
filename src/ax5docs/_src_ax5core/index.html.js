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
        "template": __loadTemplate(data.layoutPath, require),
        "getContent": function(__layoutHelper) {
          out.w('\n    ');
          __tag(out,
            _________node_modules_marko_node_modules_marko_layout_put_tag_js,
            {
              "into": "visual",
              "layout": __layoutHelper
            },
            function(out) {
              out.w('\n\n        <div class="contents">\n            <div class="style-index-visual">\n                <div class="brand-title">AX5UI</div>\n                <div class="project-name">ax5core</div>\n                <div class="DH10"></div>\n                <div class="button-group">\n                    <button class="btn btn-lg btn-border white" onclick="location.href = &#39;https://github.com/ax5ui&#39;;">\n                        Get\n                        ax5core\n                    </button>\n                    &nbsp;\n                    <button class="btn btn-lg btn-border white" onclick="location.href = &#39;/ax5core/install/index.html&#39;;">Documentation\n                    </button>\n                </div>\n            </div>\n        </div>\n\n    ');
            });

          out.w('\n    ');
          __tag(out,
            _________node_modules_marko_node_modules_marko_layout_put_tag_js,
            {
              "into": "body",
              "layout": __layoutHelper
            },
            function(out) {
              out.w('\n\n\n    ');
            });

          out.w('\n    ');
          __tag(out,
            _________node_modules_marko_node_modules_marko_layout_put_tag_js,
            {
              "into": "page-js",
              "layout": __layoutHelper
            },
            function(out) {
              out.w('\n        <script language="javascript">\n\n        </script>\n    ');
            });

          out.w('\n');
        },
        "*": {
          "projectName": data.projectName,
          "pageTitle": "home",
          "bodyStyle": "index"
        }
      });

    out.w('\n');
  };
}
(module.exports = require("marko").c(__filename)).c(create);