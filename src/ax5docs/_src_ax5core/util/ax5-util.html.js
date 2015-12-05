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
        out.w('\n  <parent></parent>\n  <sort>2</sort>\n\n  <id>ax5.util</id>\n  <title>util</title>\n  <desc></desc>\n');
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
              out.w('\n\n    \n    <section class="ax5docs-method">\n      <h2 data-method>ax5.util.get_type</h2>\n\n      <p>\n        Return argument object type\n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          ax5.util.get_type(1); // "number"\n          ax5.util.get_type("1"); // "string"\n          ax5.util.get_type([0, 1, 2]); // "array"\n          ax5.util.get_type({a: 1}); // "object"\n          ax5.util.get_type(function() {}); // "function"\n          ax5.util.get_type(document.querySelectorAll("div")); // "nodelist"\n          ax5.util.get_type(document.createDocumentFragment()); // "fragment"\n        </script>\n      ');
                });

              out.w('\n      <p>\n        Javascript object type name is not clear. so <code>util.get_type</code> method very useful.\n      </p>\n    </section>\n\n    \n    <section class="ax5docs-method">\n      <h2 data-method>ax5.util.is_[type]</h2>\n\n      <p>\n        Return argument object type is [type] result.\n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          // return is window.\n          ax5.util.is_window(window);\n\n          // return is element.\n          ax5.util.is_element(document.getElementById("#ax5-util-is-type"));\n\n          // return is Object.\n          ax5.util.is_object();\n\n          // return is Array.\n          ax5.util.is_array();\n\n          // return is Functon.\n          ax5.util.is_function();\n\n          // return is String.\n          ax5.util.is_string();\n\n          // return is Number.\n          ax5.util.is_number();\n\n          // return is nodeList.\n          ax5.util.is_nodelist(document.querySelectorAll(".content"));\n\n          // return is undefined.\n          ax5.util.is_undefined();\n\n          // return is undefined|\'\'|null.\n          ax5.util.is_nothing();\n        </script>\n      ');
                });

              out.w('\n    </section>\n\n    \n    <section class="ax5docs-method">\n      <h2 data-method2>ax5.util.clone</h2>\n\n      <p>\n        Return copied new Object\n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          var a = {a: 1};\n          var b = a;\n          console.log("(a == b) => " + (a == b));\n          b = ax5.util.clone(a);\n          console.log("(a == b) => " + (a == b));\n        </script>\n      ');
                });

              out.w('\n    </section>\n\n    \n    <section class="ax5docs-method">\n      <h2 data-method>ax5.util.each</h2>\n\n      <p>\n        You can cycle through the items processed in an Array or an Object using each.<br>\n        If the object in each function second argument (key, value) is passed,\n        Array in each function second argument (index, Array item)\n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          var a = {a: "axisj", b: "ax5"};\n          var b = [9, 8, 5, 4, 3, 1];\n\n          var po = [];\n          po.push("* a");\n          ax5.util.each(a, function(k, v) {\n            po.push(k + ":" + v + " | " + this);\n          });\n          po.push("* b");\n\n          ax5.util.each(b, function(index, item) {\n            po.push(index + ":" + item + " | " + this);\n          });\n\n          console.log(po.join(\'\\n\'));\n        </script>\n      ');
                });

              out.w('\n\n      \n      <section class="ax5docs-method">\n        <h2 data-method>ax5.util.filter</h2>\n\n        <p>\n          The first item is delivered to the second argument of the filter function.\n          The second argument is an anonymous function, the result is True, the items will be collected.\n        </p>\n        ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n          <script type="text/javascript">\n            var result, aarray = [5, 4, 3, 2, 1];\n\n            result = ax5.util.filter(aarray, function() {\n              return this % 2;\n            });\n            console.log(result);\n\n            var list = [\n              {isdel: 1, name: "ax5-1"}, {name: "ax5-2"}, {isdel: 1, name: "ax5-3"}, {name: "ax5-4"}, {name: "ax5-5"}\n            ];\n            result = ax5.util.filter(list, function() {\n              return (this.isdel != 1);\n            });\n            console.log(JSON.stringify(result));\n          </script>\n        ');
                });

              out.w('\n      </section>\n\n    </section>\n  ');
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
          "pageTitle": "ax5.util",
          "showHeader": true
        }
      });
  };
}
(module.exports = require("marko").c(__filename)).c(create);