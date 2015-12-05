function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      __renderer = __helpers.r,
      ____________node_modules_marko_node_modules_marko_layout_placeholder_tag_js = __renderer(require("marko/node_modules/marko-layout/placeholder-tag")),
      __tag = __helpers.t;

  return function render(data, out) {
    out.w('<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<title>ax5ui / ax5core : ' +
      escapeXml(data.pageTitle) +
      '</title>\n\n\t\n\t<script type="text/javascript" src="../../assets/lib/jquery/jquery.min.js"></script>\n\t<script src="https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js?lang=css"></script>\n\t<link rel="stylesheet" type="text/css" href="../../assets/lib/prettify/github.css">\n\t<script type="text/javascript" src="../../assets/lib/ax5core/ax5core.js"></script>\n\n\t\n\t<link rel="stylesheet" type="text/css" href="../../assets/css/docs.css">\n\t<script type="text/javascript" src="../../assets/js/ax5core-menus.js"></script>\n\t<script type="text/javascript" src="../../assets/js/docs.js"></script>\n\n');
    __tag(out,
      ____________node_modules_marko_node_modules_marko_layout_placeholder_tag_js,
      {
        "name": "head-css",
        "content": data.layoutContent
      });

    out.w('\n');
    __tag(out,
      ____________node_modules_marko_node_modules_marko_layout_placeholder_tag_js,
      {
        "name": "head-js",
        "content": data.layoutContent
      });

    out.w('\n</head>\n<body>\n\t<div class="demo-body">\n\t\t');

    if (data.showHeader !== false) {
      out.w('<h1>\n\t\t\t' +
        escapeXml(data.pageTitle) +
        '\n\t\t</h1>');
    }

    out.w('\n\t\t');
    __tag(out,
      ____________node_modules_marko_node_modules_marko_layout_placeholder_tag_js,
      {
        "name": "body",
        "content": data.layoutContent
      });

    out.w('\n\t</div>\n\t<div class="demo-menu" id="demo-menu-print-target"></div>\n\n');
    __tag(out,
      ____________node_modules_marko_node_modules_marko_layout_placeholder_tag_js,
      {
        "name": "page-js",
        "content": data.layoutContent
      });

    out.w('\n</body>\n</html>');
  };
}
(module.exports = require("marko").c(__filename)).c(create);