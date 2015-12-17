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
      ______assets_components_ax5docs_js_renderer_js = __renderer(require("../../assets/components/ax5docs-js/renderer"));

  return function render(data, out) {
    __tag(out,
      ______assets_components_tmpl_metadata_renderer_js,
      {},
      function(out) {
        out.w('\n  <parent></parent>\n  <sort>2</sort>\n  \n  <id>ax5.util</id>\n  <title>ax5.util</title>\n  <desc></desc>\n');
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
              "into": "visual",
              "layout": __layoutHelper
            },
            function(out) {
              out.w('\n\n    <div class="contents">\n      <div class="style-sub-visual">\n        <div class="title">ax5.util</div>\n        <div class="description">"ax5core" is a utility for creating AX5UI Library. need to install on your browser.\n        </div>\n      </div>\n    </div>\n\n  ');
            });

          out.w('\n  ');
          __tag(out,
            ____________node_modules_marko_node_modules_marko_layout_put_tag_js,
            {
              "into": "body",
              "layout": __layoutHelper
            },
            function(out) {
              out.w('\n    \n    \n    <section class="ax5docs-section">\n      <h2 data-method>ax5.util.get_type</h2>\n      \n      <p>\n        Return argument object type\n      </p>\n      \n      ');
              __tag(out,
                ______assets_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          ax5.util.get_type(1); // "number"\n          ax5.util.get_type("1"); // "string"\n          ax5.util.get_type([0, 1, 2]); // "array"\n          ax5.util.get_type({a: 1}); // "object"\n          ax5.util.get_type(function() {}); // "function"\n          ax5.util.get_type(document.querySelectorAll("div")); // "nodelist"\n          ax5.util.get_type(document.createDocumentFragment()); // "fragment"\n        </script>\n      ');
                });

              out.w('\n      <p>\n        Javascript object type name is not clear. so <code>util.get_type</code> method very useful.\n      </p>\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2 data-method>ax5.util.is_[type]</h2>\n      \n      <p>\n        Return argument object type is [type] result.\n      </p>\n      ');
              __tag(out,
                ______assets_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          // return is window.\n          ax5.util.is_window(window);\n          \n          // return is element.\n          ax5.util.is_element(document.getElementById("#ax5-util-is-type"));\n          \n          // return is Object.\n          ax5.util.is_object();\n          \n          // return is Array.\n          ax5.util.is_array();\n          \n          // return is Functon.\n          ax5.util.is_function();\n          \n          // return is String.\n          ax5.util.is_string();\n          \n          // return is Number.\n          ax5.util.is_number();\n          \n          // return is nodeList.\n          ax5.util.is_nodelist(document.querySelectorAll(".content"));\n          \n          // return is undefined.\n          ax5.util.is_undefined();\n          \n          // return is undefined|\'\'|null.\n          ax5.util.is_nothing();\n        </script>\n      ');
                });

              out.w('\n    </section>\n\n    \n    <section class="ax5docs-section">\n      <h2 data-method>ax5.util.filter</h2>\n      \n      <p>\n        The first item is delivered to the second argument of the filter function.\n        The second argument is an anonymous function, the result is True, the items will be collected.\n      </p>\n      ');
              __tag(out,
                ______assets_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          var result, aarray = [5, 4, 3, 2, 1];\n          \n          result = ax5.util.filter(aarray, function() {\n            return this % 2;\n          });\n          console.log(result);\n          \n          var list = [\n            {isdel: 1, name: "ax5-1"}, {name: "ax5-2"}, {isdel: 1, name: "ax5-3"}, {name: "ax5-4"}, {name: "ax5-5"}\n          ];\n          result = ax5.util.filter(list, function() {\n            return (this.isdel != 1);\n          });\n          console.log(JSON.stringify(result));\n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.search</h2>\n      \n      <p>\n        It returns the first item of the result of the function is True.\n      </p>\n      ');
              __tag(out,
                ______assets_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          var a = ["A", "X", "5"];\n          var idx = ax5.util.search(a, function() {\n            return this == "X";\n          });\n          console.log(a[idx]);\n          // X\n          \n          console.log(a[\n              ax5.util.search(a, function(idx) {\n                return idx == 2;\n              })\n              ]);\n          // 5\n          \n          var b = {a: "AX5-0", x: "AX5-1", 5: "AX5-2"};\n          console.log(b[\n              ax5.util.search(b, function(k, v) {\n                return k == "x";\n              })\n              ]);\n          // AX5-1\n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.map</h2>\n      \n      <p>\n        "map" creating a new array features set into an array or object.\n        In the example I\'ve created a simple object array as a numeric array.\n      </p>\n      ');
              __tag(out,
                ______assets_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          var a = [1, 2, 3, 4, 5];\n          a = ax5.util.map(a, function() {\n            return {id: this};\n          });\n          console.log(ax5.util.to_json(a));\n          \n          console.log(\n              ax5.util.map({a: 1, b: 2}, function(k, v) {\n                return {id: k, value: v};\n              })\n          );\n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.merge</h2>\n      \n      <p>\n        "array like" the type of object "concat".\n      </p>\n      ');
              __tag(out,
                ______assets_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          var a = [1, 2, 3], b = [7, 8, 9];\n          console.log(ax5.util.merge(a, b));\n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.reduce</h2>\n      \n      <p>\n        As a result of the process performed in the operation from the left to the right of the array it will be\n        reflected to the left side item. It returns the final value of the item.\n      </p>\n      ');
              __tag(out,
                ______assets_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          var aarray = [5, 4, 3, 2, 1], result;\n          console.log(ax5.util.reduce(aarray, function(p, n) {\n            return p * n;\n          }));\n          // 120\n\n          console.log(ax5.util.reduce({a: 1, b: 2}, function(p, n) {\n            // If the "Object" is the first "p" value is "undefined".\n            return parseInt(p | 0) + parseInt(n);\n          }));\n          // 3\n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.reduce_right</h2>\n      \n      <p>\n        Same as "reduce" but with a different direction.\n      </p>\n      ');
              __tag(out,
                ______assets_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          var aarray = [5, 4, 3, 2, 1];\n          console.log(ax5.util.reduce_right(aarray, function(p, n) {\n            return p - n;\n          }));\n          // -13\n        </script>\n      ');
                });

              out.w('\n    </section>\n\n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.first</h2>\n      \n      <p>\n        It returns the first element in the Array, or Object. However, it is faster to use Array in the "Array [0]"\n        rather than using the "first" method.\n      </p>\n      ');
              __tag(out,
                ______assets_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          var _arr = ["ax5", "axisj"];\n          var _obj = {k: "ax5", z: "axisj"};\n\n          console.log(ax5.util.first(_arr));\n          // ax5\n\n          console.log(ax5.util.to_json(ax5.util.first(_obj)));\n          // {"k": "ax5"}\n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.last</h2>\n      \n      <p>\n        It returns the last element in the Array, or Object.\n      </p>\n      ');
              __tag(out,
                ______assets_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          var _arr = ["ax5", "axisj"];\n          var _obj = {k: "ax5", z: "axisj"};\n\n          console.log(ax5.util.last(_arr));\n          // axisj\n\n          console.log(ax5.util.to_json(ax5.util.last(_obj)));\n          // {"z": "axisj"}\n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.left</h2>\n      \n      <p>\n        Returns. Since the beginning of the string to the index, up to a certain character in a string from the\n        beginning of the string.\n      </p>\n      ');
              __tag(out,
                ______assets_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          console.log(ax5.util.left("abcd.efd", 3));\n          // abc\n          console.log(ax5.util.left("abcd.efd", "."));\n          // abcd\n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.right</h2>\n      \n      <p>\n        Returns. Up from the end of the string index, up to a certain character in a string from the end of the string\n      </p>\n      ');
              __tag(out,
                ______assets_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          console.log(ax5.util.right("abcd.efd", 3));\n          // efd\n          console.log(ax5.util.right("abcd.efd", "."));\n          // efd\n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.camel_case</h2>\n      \n      <p>\n        It converts a string to "Camel Case". "a-b", "a_b" will be the "aB".\n      </p>\n      ');
              __tag(out,
                ______assets_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          console.log(ax5.util.camel_case("inner-width"));\n          console.log(ax5.util.camel_case("inner_width"));\n          // innerWidth\n          console.log(ax5.util.camel_case("camelCase"));\n          // camelCase\n          console.log(ax5.util.camel_case("a_bc"));\n          // aBc\n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.snake_case</h2>\n      \n      <p>\n        It converts a string to "Snake Case". "aB" will be the "a-b".\n      </p>\n      ');
              __tag(out,
                ______assets_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          console.log(ax5.util.snake_case("inner-width"));\n          // inner-width\n          console.log(ax5.util.snake_case("camelCase"));\n          // camel-case\n          console.log(ax5.util.snake_case("a_bc"));\n          // a-bc\n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.number</h2>\n      \n      <p>\n        When the number covers the development, often it requires multiple steps.\n        The syntax is very complex and it is difficult to maintain.\n        "ax5.util.number" command to convert a number that were resolved by passing a JSON format.\n      </p>\n      ');
              __tag(out,
                ______assets_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          console.log(\'round(1) : \' + ax5.util.number(123456789.678, {round: 1}));\n          // round(1) : 123456789.7\n\n          console.log(\'round(1) money() : \'\n              + ax5.util.number(123456789.678, {round: 1, money: true}));\n          // round(1) money() : 123,456,789.7\n\n          console.log(\'round(2) byte() : \'\n              + ax5.util.number(123456789.678, {round: 2, byte: true}));\n          // round(2) byte() : 117.7MB\n\n          console.log(\'abs() round(2) money() : \'\n              + ax5.util.number(-123456789.678, {abs: true, round: 2, money: true}));\n          // abs() round(2) money() : 123,456,789.68\n\n          console.log(\'abs() round(2) money() : \'\n              + ax5.util.number("A-1234~~56789.8~888PX", {abs: true, round: 2, money: true}));\n          // abs() round(2) money() : 123,456,789.89\n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.param</h2>\n      \n      <p>\n        The parameter values may in some cases be the "Object" or "String".\n        At this time, useing the "param", it can be the same as verifying the parameter value.\n      </p>\n      ');
              __tag(out,
                ______assets_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          console.log(ax5.util.param({a: 1, b: \'123\\\'"2&\'}, "param"));\n          // a=1&b=123%27%222%26\n          console.log(ax5.util.param("a=1&b=12\'\\"32", "param"));\n          //a=1&b=12\'"32\n          console.log(ax5.util.to_json(util.param("a=1&b=1232")));\n          // {"a": "1", "b": "1232"}\n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.parse_json</h2>\n      \n      <p>\n        parsing a little more than the less sensitive the JSON syntax "JSON.parse".\n      </p>\n      ');
              __tag(out,
                ______assets_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          console.log(ax5.util.to_json(ax5.util.parse_json("[{\'a\':\'99\'},\'2\',\'3\']")[0]));\n          // {"a": "99"}\n          console.log(ax5.util.parse_json("{a:1}").a);\n          // 1\n          console.log(ax5.util.to_json(ax5.util.parse_json("{\'a\':1, \'b\':function(){return 1;}}", false)));\n          // {"error": 500, "msg": "syntax error"}\n          console.log(ax5.util.to_json(ax5.util.parse_json("{\'a\':1, \'b\':function(){return 1;}}", true)));\n          // {"a": 1, "b": "{Function}"}\n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.to_json</h2>\n      \n      <p>\n      \n      </p>\n      ');
              __tag(out,
                ______assets_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          console.log(ax5.util.to_json(1));\n          // 1\n          console.log(ax5.util.to_json("A"));\n          // "A"\n          console.log(ax5.util.to_json([1, 2, 3, \'A\']));\n          // [1,2,3,"A"]\n          console.log(ax5.util.to_json({a: \'a\', x: \'x\'}));\n          // {"a": "a", "x": "x"}\n          console.log(ax5.util.to_json([1, {a: \'a\', x: \'x\'}]));\n          // [1,{"a": "a", "x": "x"}]\n          console.log(ax5.util.to_json({a: \'a\', x: \'x\', list: [1, 2, 3]}));\n          // {"a": "a", "x": "x", "list": [1,2,3]}\n          console.log(ax5.util.to_json(function() {}));\n          // "{Function}"\n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.alert</h2>\n      \n      <p>\n      \n      </p>\n      ');
              __tag(out,
                ______assets_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          ax5.util.alert({a: 1, b: 2});\n        </script>\n      ');
                });

              out.w('\n    </section>\n    \n    \n    <section class="ax5docs-section">\n      <h2>ax5.util.to_array</h2>\n      \n      <p>\n        "nodelist" or on the Array Like such "arguments", has properties such as "length", but you can not use functions\n        defined in Array.prototype. With "to_array" because it is easy to convert an array.\n      </p>\n      ');
              __tag(out,
                ______assets_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          function something() {\n            var arr = ax5.util.to_array(arguments);\n            console.log(ax5.util.to_json(arr));\n          }\n          something("A", "X", "I", "S", "J");\n        </script>\n      ');
                });

              out.w('\n    </section>\n\n    \n    <section class="ax5docs-section">\n      <h2>ax5.get_cookie / set_cookie</h2>\n\n      <p>\n\n      </p>\n      ');
              __tag(out,
                ______assets_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          ax5.util.set_cookie("ax5-cookie", "abcde");\n          ax5.util.set_cookie("ax5-cookie-path", "abcde", 2, {path: "/"});\n          console.log(ax5.util.get_cookie("ax5-cookie"));\n          // abcde\n          console.log(ax5.util.get_cookie("ax5-cookie-path"));\n          // abcde\n        </script>\n      ');
                });

              out.w('\n    </section>\n  \n  ');
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
          "pageId": "ax5.util",
          "bodyStyle": "style-sub"
        }
      });
  };
}
(module.exports = require("marko").c(__filename)).c(create);