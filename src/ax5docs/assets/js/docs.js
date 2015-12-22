var fn_docs = (function () {
    return {
        _data: {},
        _jos: {}, // jquery objects 저장소
        menu: {
            list: [],
            target: null,
            scrollType: '',
            printed: false,
            ready: function (target, scrollType) {
                var list = [];
                this.target = target;
                this.scrollType = scrollType;

                if (scrollType == 'inline') {
                    var h1_index = -1, h2_index = -1;
                    fn_docs._jos['docs-body'].find('h1,h2,h3').each(function (idx, nn) {
                        if(!this.id) this.id = 'docs-' + (new Date()).getTime();

                        if(this.tagName === "H1"){
                            h1_index++;
                            _list = list;
                        }
                        else if(this.tagName === "H2"){
                            h2_index++;
                            _list = (h1_index > -1) ? list[h1_index].child : list;
                        }
                        else if(this.tagName == "H3"){
                            _list = (h1_index > -1 && h2_index > -1) ? list[h1_index].child[h2_index].child : list;
                        }

                        _list.push({
                            id: this.id,
                            label: this.innerHTML,
                            offset: $(this).offset(),
                            child: []
                        });
                    });
                }
                this.list = list;
                if(!this.printed) this.print();
            },
            getMenuList: function (list) {
                var _this = this,  po = [];
                list.forEach(function (item) {
                    po.push('<li>');
                    po.push('<a href="">' + item.label + "</a>");
                    po.push('</li>');
                    if (item.child.length > 0) {
                        po.push('<ul>');
                        po.push(_this.getMenuList(item.child));
                        po.push('</ul>');
                    }
                });
                return po.join('');
            },
            print: function () {
                var po = [];
                po.push('<ul>');
                po.push(this.getMenuList(this.list));
                po.push('</ul>');
                this.target.html(po.join(''));
                this.printed = true;
            }
        }
    }
})();

$(document.body).ready(function () {
    if (!window.fn_docs) return;

    $.ajax({
        url: "https://api.github.com/repos/ax5ui/ax5core"
    }).done(function (data) {
        $("#started-count").html(ax5.util.number(data.stargazers_count, {'money': true})).fadeIn();
    });

    fn_docs._jos = (function () {
        return {
            "menu-target": $("#docs-menu-print-target"),
            "docs-header-tool": $("#docs-header-tool"),
            "docs-body": $("#docs-body"),
            "docs-inline-menu": $("#docs-inline-menu"),
            "docs-menu": $("#docs-menu")
        }
    })();

    $(window).on('load resize', function () {
        // toolbar position cache
        fn_docs._data["doc-heder-tool-change-position"] = ax5.util.number(fn_docs._jos["docs-body"].css("margin-top")) - fn_docs._jos["docs-header-tool"].height();

        // change print way(static) -- remove
        if (fn_docs._jos['docs-inline-menu'][0]) {
            fn_docs.menu.ready(fn_docs._jos['docs-inline-menu'], 'inline');
        }
        if (fn_docs._jos['docs-menu'][0]) {
            fn_docs.menu.ready(fn_docs._jos['docs-menu'], 'static');
        }
    });

    $(window).scroll(function () {
        if ($(window).scrollTop() >= fn_docs._data["doc-heder-tool-change-position"]) {
            fn_docs._jos["docs-header-tool"].addClass("reflection");
        }
        else {
            fn_docs._jos["docs-header-tool"].removeClass("reflection");
        }
    });
});