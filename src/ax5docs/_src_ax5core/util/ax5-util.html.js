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
        out.w('\n  <parent></parent>\n  <sort>2</sort>\n  \n  <id>ax5.util</id>\n  <title>util</title>\n  <desc></desc>\n');
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
              out.w('\n    \n    \n    <section class="ax5docs-method">\n      <h2 data-method>ax5.util.get_type</h2>\n      \n      <p>\n        Return argument object type\n      </p>\n      \n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          ax5.util.get_type(1); // "number"\n          ax5.util.get_type("1"); // "string"\n          ax5.util.get_type([0, 1, 2]); // "array"\n          ax5.util.get_type({a: 1}); // "object"\n          ax5.util.get_type(function() {}); // "function"\n          ax5.util.get_type(document.querySelectorAll("div")); // "nodelist"\n          ax5.util.get_type(document.createDocumentFragment()); // "fragment"\n        </script>\n      ');
                });

              out.w('\n      <p>\n        Javascript object type name is not clear. so <code>util.get_type</code> method very useful.\n      </p>\n    </section>\n    \n    \n    <section class="ax5docs-method">\n      <h2 data-method>ax5.util.is_[type]</h2>\n      \n      <p>\n        Return argument object type is [type] result.\n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          // return is window.\n          ax5.util.is_window(window);\n          \n          // return is element.\n          ax5.util.is_element(document.getElementById("#ax5-util-is-type"));\n          \n          // return is Object.\n          ax5.util.is_object();\n          \n          // return is Array.\n          ax5.util.is_array();\n          \n          // return is Functon.\n          ax5.util.is_function();\n          \n          // return is String.\n          ax5.util.is_string();\n          \n          // return is Number.\n          ax5.util.is_number();\n          \n          // return is nodeList.\n          ax5.util.is_nodelist(document.querySelectorAll(".content"));\n          \n          // return is undefined.\n          ax5.util.is_undefined();\n          \n          // return is undefined|\'\'|null.\n          ax5.util.is_nothing();\n        </script>\n      ');
                });

              out.w('\n    </section>\n\n    \n    <section class="ax5docs-method">\n      <h2 data-method>ax5.util.filter</h2>\n      \n      <p>\n        The first item is delivered to the second argument of the filter function.\n        The second argument is an anonymous function, the result is True, the items will be collected.\n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          var result, aarray = [5, 4, 3, 2, 1];\n          \n          result = ax5.util.filter(aarray, function() {\n            return this % 2;\n          });\n          console.log(result);\n          \n          var list = [\n            {isdel: 1, name: "ax5-1"}, {name: "ax5-2"}, {isdel: 1, name: "ax5-3"}, {name: "ax5-4"}, {name: "ax5-5"}\n          ];\n          result = ax5.util.filter(list, function() {\n            return (this.isdel != 1);\n          });\n          console.log(JSON.stringify(result));\n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.search</h2>\n      \n      <p>\n        It returns the first item of the result of the function is True.\n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          var a = ["A", "X", "5"];\n          var idx = ax5.util.search(a, function() {\n            return this == "X";\n          });\n          console.log(a[idx]);\n          // X\n          \n          console.log(a[\n              ax5.util.search(a, function(idx) {\n                return idx == 2;\n              })\n              ]);\n          // 5\n          \n          var b = {a: "AX5-0", x: "AX5-1", 5: "AX5-2"};\n          console.log(b[\n              ax5.util.search(b, function(k, v) {\n                return k == "x";\n              })\n              ]);\n          // AX5-1\n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.map</h2>\n      \n      <p>\n        "map" creating a new array features set into an array or object.\n        In the example I\'ve created a simple object array as a numeric array.\n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          var a = [1, 2, 3, 4, 5];\n          a = ax5.util.map(a, function() {\n            return {id: this};\n          });\n          console.log(ax5.util.to_json(a));\n          \n          console.log(\n              ax5.util.map({a: 1, b: 2}, function(k, v) {\n                return {id: k, value: v};\n              })\n          );\n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.merge</h2>\n      \n      <p>\n        "array like" the type of object "concat".\n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          var a = [1, 2, 3], b = [7, 8, 9];\n          console.log(ax5.util.merge(a, b));\n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.reduce</h2>\n      \n      <p>\n        As a result of the process performed in the operation from the left to the right of the array it will be\n        reflected to the left side item. It returns the final value of the item.\n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          var aarray = [5, 4, 3, 2, 1], result;\n          console.log(ax5.util.reduce(aarray, function(p, n) {\n            return p * n;\n          }));\n          // 120\n\n          console.log(ax5.util.reduce({a: 1, b: 2}, function(p, n) {\n            // If the "Object" is the first "p" value is "undefined".\n            return parseInt(p | 0) + parseInt(n);\n          }));\n          // 3\n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.reduce_right</h2>\n      \n      <p>\n        Same as "reduce" but with a different direction.\n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          var aarray = [5, 4, 3, 2, 1];\n          console.log(ax5.util.reduce_right(aarray, function(p, n) {\n            return p - n;\n          }));\n          // -13\n        </script>\n      ');
                });

              out.w('\n    </section>\n\n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.first</h2>\n      \n      <p>\n        It returns the first element in the Array, or Object. However, it is faster to use Array in the "Array [0]" rather than using the "first" method.\n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          var _arr = ["ax5","axisj"];\n          var _obj = {k:"ax5", z:"axisj"};\n\n          console.log( ax5.util.first(_arr) );\n          // ax5\n\n          console.log( ax5.util.to_json( ax5.util.first( _obj) ) );\n          // {"k": "ax5"}\n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.last</h2>\n      \n      <p>\n        It returns the last element in the Array, or Object.\n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          var _arr = ["ax5","axisj"];\n          var _obj = {k:"ax5", z:"axisj"};\n\n          console.log( ax5.util.last(_arr) );\n          // axisj\n\n          console.log( ax5.util.to_json( ax5.util.last( _obj) ) );\n          // {"z": "axisj"}\n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.left</h2>\n      \n      <p>\n      \n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n        \n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.right</h2>\n      \n      <p>\n      \n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n        \n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.camel_case</h2>\n      \n      <p>\n      \n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n        \n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.snake_case</h2>\n      \n      <p>\n      \n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n        \n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.number</h2>\n      \n      <p>\n      \n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n        \n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.param</h2>\n      \n      <p>\n      \n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n        \n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.parse_json</h2>\n      \n      <p>\n      \n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n        \n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.to_json</h2>\n      \n      <p>\n      \n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n        \n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.alert</h2>\n      \n      <p>\n      \n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n        \n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.to_array</h2>\n      \n      <p>\n      \n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n        \n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    // todo : get, set cookie or storage\n  \n  \n  ');
            });

          out.w('\n  ');
          __tag(out,
            ____________node_modules_marko_node_modules_marko_layout_put_tag_js,
            {
              "into": "page-js",
              "layout": __layoutHelper
            },
            function(out) {
              out.w('\n  \n  ');
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