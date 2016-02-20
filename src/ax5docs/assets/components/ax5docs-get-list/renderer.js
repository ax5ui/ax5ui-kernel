exports.render = function (input, out) {
    var fs = require('fs');
    var Finder = require('fs-finder');
    var htmlparser = require("htmlparser");

    var projectName = input.projectName;
    var loadFilePath, hrefRoot;

    if (projectName == "ax5ui") {

    }
    else {
        loadFilePath = "src/ax5docs/_src_" + projectName, hrefRoot = "src/ax5docs/_src_";
    }

    if (loadFilePath) {

        // find files and filter
        var files = Finder.from(loadFilePath).findFiles('*.html').filter(function (path) {
            return /html$/.test(path);
        });

        var url_replace = function (url) {
            return url.replace(process.cwd() + "/" + hrefRoot, "/");
        };

        var menus = [], trees = [];

        (function () {
            // Read file and parse 'tmpl-metadata' tag
            files.forEach(function (src) {

                var meta = (function () {

                    var
                        rawHtml = fs.readFileSync(src, 'utf8'),
                        handler = new htmlparser.DefaultHandler(function (error) {}, {verbose: false, ignoreWhitespace: true}),
                        parser = new htmlparser.Parser(handler)
                        ;

                    parser.parseComplete(rawHtml);

                    var
                        obj = {}, i = handler.dom.length
                        ;

                    while (i--) {
                        if (handler.dom[i].name == "tmpl-metadata") {
                            obj = handler.dom[i].attribs;
                            break;
                        }
                    }

                    return obj;
                })();

                var menu = {
                    url: url_replace(src)
                };

                // extend object
                for (var k in meta) {
                    if (k == "sort") menu[k] = Number(meta[k]);
                    else menu[k] = meta[k];
                }
                if (menu.title) menus.push(menu);
            });

            // menus array sort
            menus.sort(function (v1, v2) {
                if (v1.sort == v2.sort) return 0;
                else if (v1.sort > v2.sort) return 1;
                else return -1;
            });

            menus.forEach(function (dn) {
                if (!dn.parentId) {
                    trees.push(dn);
                }
                else {
                    var findMenuIndex = -1;
                    trees.forEach(function (mn, midx) {
                        if (mn.id == dn.parentId) {
                            findMenuIndex = midx;
                            return false;
                        }
                    });
                    if (findMenuIndex == -1) {
                        trees.push({title: dn.parentTitle, id: dn.parentId, child: [dn]});
                    }
                    else {
                        trees[findMenuIndex].child.push(dn);
                    }
                }
            });
        })();
        
        // console.log(trees);

        var getUrl = function (url) {
            return url;
        };

        var po = [];
        for (var i = 0, l = trees.length, _item; i < l; i++) {
            _item = trees[i];
            po.push('<li ' + (function () {
                    return (input.activeId == _item.id) ? "class='active'" : "";
                })() + '>');

            if (!_item.url && _item.child && _item.child.length > 0) {
                _item.url = _item.child[0].url;
            }

            po.push('<a href="' + getUrl(_item.url) + '">' + _item.title + '</a>');
            po.push('</li>');
        }

        out.write(po.join(''));

    }
    else {
        out.write('');
    }
};