function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      __loadTemplate = __helpers.l,
      __renderer = __helpers.r,
      ______assets_components_tmpl_metadata_renderer_js = __renderer(require("../../assets/components/tmpl-metadata/renderer")),
      __tag = __helpers.t,
      ____________node_modules_marko_node_modules_marko_layout_use_tag_js = __renderer(require("marko/node_modules/marko-layout/use-tag")),
      ____________node_modules_marko_node_modules_marko_layout_put_tag_js = __renderer(require("marko/node_modules/marko-layout/put-tag")),
      ______assets_components_ax5docs_md_renderer_js = __renderer(require("../../assets/components/ax5docs-md/renderer"));

  return function render(data, out) {
    __tag(out,
      ______assets_components_tmpl_metadata_renderer_js,
      {},
      function(out) {
        out.w('\n  <parent></parent>\n  <sort>0</sort>\n\n  <id>install</id>\n  <title>Install</title>\n  <desc></desc>\n');
      });

    out.w('\n');
    __tag(out,
      ____________node_modules_marko_node_modules_marko_layout_use_tag_js,
      {
        "template": __loadTemplate(data.layout_path, require),
        "getContent": function(__layoutHelper) {
          out.w('\n  ');
          __tag(out,
            ____________node_modules_marko_node_modules_marko_layout_put_tag_js,
            {
              "into": "visual",
              "layout": __layoutHelper
            },
            function(out) {
              out.w('\n\n    <div class="contents">\n      <div class="style-sub-visual">\n        <div class="title">Install</div>\n        <div class="description">"ax5core" is a utility for creating AX5UI Library. need to install on your browser.\n        </div>\n      </div>\n    </div>\n\n  ');
            });

          out.w('\n  ');
          __tag(out,
            ____________node_modules_marko_node_modules_marko_layout_put_tag_js,
            {
              "into": "body",
              "layout": __layoutHelper
            },
            function(out) {
              out.w('\n    <section class="ax5docs-section">\n      ');
              __tag(out,
                ______assets_components_ax5docs_md_renderer_js,
                {
                  "file": "src/ax5core/README.md"
                });

              out.w('\n    </section>\n\n  ');
            });

          out.w('\n  ');
          __tag(out,
            ____________node_modules_marko_node_modules_marko_layout_put_tag_js,
            {
              "into": "page-js",
              "layout": __layoutHelper
            },
            function(out) {
              out.w('\n\n  ');
            });

          out.w('\n');
        },
        "*": {
          "pageTitle": "Install",
          "pageId": "install",
          "bodyStyle": "style-sub"
        }
      });
  };
}
(module.exports = require("marko").c(__filename)).c(create);