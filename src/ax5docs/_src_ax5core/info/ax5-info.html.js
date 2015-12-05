function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      __loadTemplate = __helpers.l,
      __renderer = __helpers.r,
      ____layouts_components_tmpl_metadata_renderer_js = __renderer(require("../_layouts/components/tmpl-metadata/renderer")),
      __tag = __helpers.t,
      ____________node_modules_marko_node_modules_marko_layout_use_tag_js = __renderer(require("marko/node_modules/marko-layout/use-tag")),
      ____________node_modules_marko_node_modules_marko_layout_put_tag_js = __renderer(require("marko/node_modules/marko-layout/put-tag")),
      ____layouts_components_ax5docs_js_renderer_js = __renderer(require("../_layouts/components/ax5docs-js/renderer"));

  return function render(data, out) {
    __tag(out,
      ____layouts_components_tmpl_metadata_renderer_js,
      {},
      function(out) {
        out.w('\n  <parent></parent>\n  <sort>1</sort>\n\n  <id>ax5.info</id>\n  <title>info</title>\n  <desc></desc>\n');
      });

    out.w('\n\n');
    __tag(out,
      ____________node_modules_marko_node_modules_marko_layout_use_tag_js,
      {
        "template": __loadTemplate(data.layout_path, require),
        "getContent": function(__layoutHelper) {
          out.w('\n  ');
          __tag(out,
            ____________node_modules_marko_node_modules_marko_layout_put_tag_js,
            {
              "into": "body",
              "layout": __layoutHelper
            },
            function(out) {
              out.w('\n\n    <section class="ax5docs-method">\n      <h2 data-method>ax5.info.version</h2>\n\n      <p>\n        Version of ax5\n      </p>\n\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          console.log(ax5.info.version);\n        </script>\n      ');
                });

              out.w('\n    </section>\n\n\n    <section class="ax5docs-method">\n      <h2 data-method>ax5.info.event_keys</h2>\n\n      <p>\n        event_keys object key map\n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          console.log(ax5.info.event_keys);\n          /*\n           { "BACKSPACE": 8, "TAB": 9, "RETURN": 13, "ESC": 27, "LEFT": 37, "UP": 38, "RIGHT": 39, "DOWN": 40, "DELETE":\n           46, "HOME": 36, "END": 35, "PAGEUP": 33, "PAGEDOWN": 34, "INSERT": 45, "SPACE": 32 }\n           */\n        </script>\n      ');
                });

              out.w('\n    </section>\n\n    <section class="ax5docs-method">\n      <h2 data-method>ax5.info.browser</h2>\n\n      <p>\n        It is user browser infomation\n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          console.log(ax5.info.browser);\n          // {"name": "chrome", "version": "46.0.2490.86", "mobile": }\n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    <section class="ax5docs-method">\n      <h2 data-method>ax5.info.url_util</h2>\n\n      <p>\n        Return current page\'s URL Infomation\n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          console.log(ax5.info.url_util());\n          /*\n           {\n           "href":"http://ax5ui:2028/ax5core/info/ax5-info.html",\n           "param":"",\n           "referrer":"http://ax5ui:2028/ax5core/util/ax5-util.html",\n           "pathname":"/ax5core/info/ax5-info.html",\n           "hostname":"ax5ui",\n           "port":"2028",\n           "url":"http://ax5ui:2028/ax5core/info/ax5-info.html",\n           "base_url":"http://ax5ui:2028"\n           }\n           */\n        </script>\n      ');
                });

              out.w('\n    </section>\n\n    <section class="ax5docs-method">\n      <h2 data-method>ax5.info.error_msg</h2>\n\n      <p>\n        When an error occurs in the UI Class, the error message can be customized.\n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          // reset user error message\n          ax5.info.error_msg["UI name"]["100"] = "my error 100";\n          ax5.info.error_msg["UI name"]["200"] = "my error 200";\n\n          // or reset all\n          ax5.info.error_msg["UI name"] = {\n            "100": "is 100 error",\n            "200": "is 200 error"\n          };\n        </script>\n      ');
                });

              out.w('\n    </section>\n\n    <section class="ax5docs-method">\n      <h2 data-method>ax5.info.ETC</h2>\n      <p>\n\n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          ax5.info.is_browser; // is borwser ?\n          ax5.info.wheel_enm; // Current browser whell event name\n          console.log(ax5.info.week_names);\n          /*\n           [\n           {label: "SUN"},\n           {label: "MON"},\n           {label: "TUE"},\n           {label: "WED"},\n           {label: "THU"},\n           {label: "FRI"},\n           {label: "SAT"}\n           ]\n          */\n        </script>\n      ');
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
          "pageTitle": "ax5.info",
          "showHeader": true
        }
      });
  };
}
(module.exports = require("marko").c(__filename)).c(create);