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
        "template": __loadTemplate(data.layout_index, require),
        "getContent": function(__layoutHelper) {
          out.w('\n  ');
          __tag(out,
            _________node_modules_marko_node_modules_marko_layout_put_tag_js,
            {
              "into": "body",
              "layout": __layoutHelper
            },
            function(out) {
              out.w('\n\n\n    asdfasdfasdf <i class="icon-ax5button"></i>\n\n    <h1>\n      \uc81c\ubaa9\n      <i class="icon-ax5"></i>\n    </h1>\n\n    <h1>\n      Title\n      <i class="icon-ax5"></i>\n    </h1>\n\n  ');
            });

          out.w('\n  ');
          __tag(out,
            _________node_modules_marko_node_modules_marko_layout_put_tag_js,
            {
              "into": "page-js",
              "layout": __layoutHelper
            },
            function(out) {
              out.w('\n\n    <script language="javascript">\n      //\twindow.location.href = "/ax5core"\n    </script>\n  ');
            });

          out.w('\n');
        },
        "*": {
          "pageTitle": "ax5core",
          "showHeader": true
        }
      });

    out.w('\n');
  };
}
(module.exports = require("marko").c(__filename)).c(create);