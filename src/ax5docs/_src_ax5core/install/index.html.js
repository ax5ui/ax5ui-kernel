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
      ____layouts_components_ax5docs_md_renderer_js = __renderer(require("../_layouts/components/ax5docs-md/renderer")),
      ____layouts_components_ax5docs_js_renderer_js = __renderer(require("../_layouts/components/ax5docs-js/renderer")),
      ____layouts_components_ax5docs_css_renderer_js = __renderer(require("../_layouts/components/ax5docs-css/renderer")),
      ____layouts_components_ax5docs_html_renderer_js = __renderer(require("../_layouts/components/ax5docs-html/renderer"));

  return function render(data, out) {
    __tag(out,
      ____layouts_components_tmpl_metadata_renderer_js,
      {},
      function(out) {
        out.w('\n  <parent></parent>\n  <sort>0</sort>\n\n  <id>install</id>\n  <title>Install</title>\n  <desc></desc>\n');
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
              out.w('\n\n    <p>\n      Install\n    </p>\n\n    \n    <section class="ax5docs-section">\n      ');
              __tag(out,
                ____layouts_components_ax5docs_md_renderer_js,
                {},
                function(out) {
                  out.w('\n        ## Markdown\n        ---\n\n        *\uae30\uc6b8\uc5ec\uc4f0\uae30(italic)* _\uae30\uc6b8\uc5ec\uc4f0\uae30(italic)_\n        **\uad75\uac8c\uc4f0\uae30(bold)** __\uad75\uac8c\uc4f0\uae30(bold)__\n\n        [\ub9c1\ud06c](http://example.com "\ub9c1\ud06c\uc81c\ubaa9").\n\n        [\ub9c1\ud06c1][1] \uacfc [\ub9c1\ud06c2][2].\n\n        [1]: http://example.com/ "\ub9c1\ud06c\uc81c\ubaa91"\n        [2]: http://example.org/ "\ub9c1\ud06c\uc81c\ubaa92"\n\n        ---\n        ***\n        ___\n\n        \uac01\uc8fc [^1] \ub294 \uc774\ub807\uac8c \ub9cc\ub4e0\ub2e4.\n\n        [^1]: \uac01\uc8fc\ub2e4.\n\n        \uac01 \ub77c\uc778\uc758 \ub05d\uc5d0\n        2\uac1c \uc774\uc0c1\uc758 \uc2a4\ud398\uc774\uc2a4\ub97c \ub123\uc73c\uba74\n        \uc904 \ub118\uae30\uae30(\uac1c\ud589)\uac00 \ub41c\ub2e4.\n\n        * \ubaa9\ub85d\n        * \ubaa9\ub85d\n        - \ubaa9\ub85d\n        - \ubaa9\ub85d\n\n        1. \ubaa9\ub85d\n        2. \ubaa9\ub85d\n        * \ud63c\ud569 \ubaa9\ub85d\n        * \ud63c\ud569 \ubaa9\ub85d\n        3. \ubaa9\ub85d\n\n        > \uc778\uc6a9\ubb38.\n        > > \uc778\uc6a9\ubb38\uc548\uc758 \uc778\uc6a9\ubb38.\n\n        > * \uc778\uc6a9 \ubaa9\ub85d\n        > * \uc778\uc6a9 \ubaa9\ub85d\n\n        `\ucf54\ub4dc\uc774\ub2e4. [test](http://test.com)`\n\n        ## Methods\n\n        ### AXBinder.set_model(Object, jQueryObject) : Model\n        \ubc14\uc778\ub529\ud560 \uc790\ubc14\uc2a4\ud06c\ub9bd\ud2b8 \uc624\ube0c\uc81d\ud2b8\ub85c\n        \uc81c\uc774\ucffc\ub9ac\ub85c \uac80\uc0c9\ub41c HTML dom \uc5d8\ub9ac\uba3c\ud2b8 \uc5d0 \ubc14\uc778\ub529\ud569\ub2c8\ub2e4.\n        \ubc14\uc778\ub529\ub41c \ubaa8\ub378\uc744 \ubc18\ud658\ud569\ub2c8\ub2e4.\n\n        ```html\n        <div id="form-target">\n          <input type="text" data-ax-path="name" class="AXInput">\n          <input type="text" data-ax-path="email" class="AXInput">\n        </div>\n        ```\n\n        ```js\n        var a = 1;\n        function b(){\n          return a;\n        }\n        ```\n      ');
                });

              out.w('\n    </section>\n\n    <section class="ax5docs-section">\n      <h2>JS</h2>\n\n      <p>\n\n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_js_renderer_js,
                {},
                function(out) {
                  out.w('\n        <script type="text/javascript">\n          function buzz() { return 0; }\n\n          var foo = {\n\n            numbers: [\'one\', \'two\', \'three\', \'four\', \'five\', \'six\'],\n            data: {\n              a: {\n                id: 123,\n                type: "String",\n                isAvailable: true\n              },\n              b: {id: 456, type: "Int"}\n            },\n            // fBar : function (x,y);\n            fOne: function(a, b, c, d, e, f, g, h) {\n              var x = a + b + c + d + e + f + g + h;\n              fTwo(a, b, c, fThree(d, e, f, g, h));\n              var z = a == \'Some string\' ? \'yes\' : \'no\';\n              z = a == 10 ? \'yes\' : \'no\';\n              var colors = [\'red\', \'green\', \'blue\', \'black\', \'white\', \'gray\'];\n              for (j = 0; j < 2; j++) i = a;\n              for (var i = 0; i < colors.length; i++)\n                var colorString = this.numbers[i];\n            },\n\n            /**\n             * Function JSDoc. Long lines can be wrapped with \'Comments\'/\'Wrap at right margin\' option\n             * @param {string} a Parameter A description.\n             * @param {string} b Parameter B description. Can extend beyond the right margin.\n             */\n            fTwo: function(a, b, c, d) {\n              foo(a, b, c, d); // Line comment which can be wrapped if long.\n              if (true)\n                return c;\n              if (a == \'one\' && (b == \'two\' || c == \'three\')) {\n                return a + b + c + d;\n              }\n              else return strD;\n              if (a == \'one\') {\n                return 1;\n              }\n              else if (a == \'two\') {\n                return 2;\n              }\n              var number = -10;\n              while (x < 0) {\n                number = number + 1;\n              }\n              do {\n                number = number + 1;\n              } while (number < 10);\n              return d;\n            },\n\n            fThree: function(strA, strB, strC, strD, strE) {\n              var number = prompt("Enter a number:", 0);\n              switch (number) {\n                case 0 :\n                  alert("Zero");\n                  break;\n                case 1:\n                  alert("One");\n                  break;\n              }\n              try {\n                a[2] = 10;\n              }\n              catch (e) {\n                alert("Failure: " + e.message);\n              }\n              return strA + strB + strC + strD + strE;\n            }\n          };\n        </script>\n      ');
                });

              out.w('\n    </section>\n\n    <section class="ax5docs-section">\n      <h2>CSS</h2>\n\n      <p>\n\n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_css_renderer_js,
                {},
                function(out) {
                  out.w('\n        <style type="text/css">\n          /* desert scheme ported from vim to google prettify */\n          code.prettyprint {\n            display: block;\n            padding: 2px;\n            border: 1px solid #888;\n            background-color: #333;\n          }\n\n          .str {\n            color: #ffa0a0;\n          }\n\n          /* string  - pink */\n          .kwd {\n            color: #f0e68c;\n            font-weight: bold;\n          }\n\n          .com {\n            color: #87ceeb;\n          }\n\n          /* comment - skyblue */\n          .typ {\n            color: #98fb98;\n          }\n\n          /* type    - lightgreen */\n          .lit {\n            color: #cd5c5c;\n          }\n\n          /* literal - darkred */\n          .pun {\n            color: #fff;\n          }\n\n          /* punctuation */\n          .pln {\n            color: #fff;\n          }\n\n          /* plaintext */\n          .tag {\n            color: #f0e68c;\n            font-weight: bold;\n          }\n\n          /* html/xml tag    - lightyellow*/\n          .atn {\n            color: #bdb76b;\n            font-weight: bold;\n          }\n\n          /* attribute name  - khaki*/\n          .atv {\n            color: #ffa0a0;\n          }\n\n          /* attribute value - pink */\n          .dec {\n            color: #98fb98;\n          }\n\n          /* decimal         - lightgreen */\n        </style>\n      ');
                });

              out.w('\n    </section>\n\n    <section class="ax5docs-section">\n      <h2>HTML</h2>\n\n      <p>\n\n      </p>\n      ');
              __tag(out,
                ____layouts_components_ax5docs_html_renderer_js,
                {},
                function(out) {
                  out.w('\n        <div style="display: inline-block;">\n          <table>\n            <tbody cellpadding="10">\n            <tr>\n              <td>String</td>\n            </tr>\n            </tbody>\n          </table>\n        </div>\n      ');
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
          "showHeader": true
        }
      });
  };
}
(module.exports = require("marko").c(__filename)).c(create);