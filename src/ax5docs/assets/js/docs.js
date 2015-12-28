var fn_docs = (function () {
    return {
        _data: {},
        _jos: {}, // jquery objects 저장소
        menu: {
            list: [],
            offsetList: [],
            target: null,
            scrollType: '',
            printed: false,
            viewType: -1,
            focusedH1: '',
            focusedH2: '',
            focusedH3: '',
            ready: function (target, scrollType) {
                if (scrollType != 'inline') return;

                var list = [], offsetList = [];
                this.target = target;
                this.scrollType = scrollType;

                var h1_index = -1, h2_index = -1, h3_index = -1;
                fn_docs._jos['docs-body'].find('h1,h2,h3').each(function (idx, nn) {
                    var $this = $(this);
                    $this.find('a[data-name]').remove();
                    var h_id = 'doc-' + this.innerHTML.replace(/\W/g, "-") + '-' + idx;

                    if(idx == 0 && this.tagName !== "H1"){
                        // 상위 아이템 없음.
                        h1_index = 0;
                        h2_index = 0;
                        h3_index = 0;
                        list.push({
                            tagName: "H1",
                            id: "",
                            label: "",
                            child: []
                        });

                        offsetList.push({
                            top: 0,
                            id: "",
                            h1_index: h1_index,
                            h2_index: h2_index,
                            h3_index: h3_index
                        });
                    }

                    if (this.tagName === "H1") {
                        _list = list;
                        h1_index = _list.length;
                        h2_index = 0;
                        h3_index = 0;
                    }
                    else if (this.tagName === "H2") {
                        _list = (h1_index > -1) ? list[h1_index].child : list;
                        h2_index = _list.length;
                        h3_index = 0;
                    }
                    else if (this.tagName == "H3") {
                        _list = (h1_index > -1 && h2_index > -1) ? list[h1_index].child[h2_index].child : list;
                        h3_index = _list.length;
                    }

                    _list.push({
                        tagName: this.tagName,
                        id: h_id,
                        label: this.innerHTML,
                        child: []
                    });

                    offsetList.push({
                        top: $this.offset().top,
                        id: h_id,
                        h1_index: h1_index,
                        h2_index: h2_index,
                        h3_index: h3_index
                    });

                    $this.append('<a name="' + h_id + '" data-name="true"></a>');

                });

                this.list = list;
                this.offsetList = offsetList;
                if (!this.printed) this.print();
            },
            getMenuList: function (list, depth) {
                var _this = this, po = [];
                list.forEach(function (item) {
                    po.push('<li data-h' + depth + '-id="' + item.id + '">');
                    po.push('<a href="#' + item.id + '">' + item.label + "</a>");
                    po.push('</li>');
                    if (item.child.length > 0) {
                        po.push('<ul data-parent-h' + depth + '-id="' + item.id + '">');
                        po.push(_this.getMenuList(item.child, (depth+1)));
                        po.push('</ul>');
                    }
                });
                return po.join('');
            },
            print: function () {
                var po = [];
                po.push('<ul>');
                po.push(this.getMenuList(this.list, 1));
                po.push('</ul>');
                this.target.html(po.join(''));
                this.printed = true;
            },

            setFocus: function (scTop) {
                var $menu = fn_docs._jos["docs-inline-menu"];
                for (var i = 0, l = this.offsetList.length, item; i < l; i++) {
                    item = this.offsetList[i];
                    if(item.h1_index === -1) break;
                    if (item.top >= scTop) { // 보정이 필요할수도 있음.
                        if (this.focusedH1 !== item.h1_index) {
                            $menu.find('[data-parent-h1-id]').removeClass("open");
                            $menu.find('[data-parent-h1-id="' + this.list[item.h1_index].id + '"]').addClass("open");
                            $menu.find('[data-h1-id]').removeClass("open");
                            $menu.find('[data-h1-id="' + this.list[item.h1_index].id + '"]').addClass("open");
                            this.focusedH1 = item.h1_index;
                            this.focusedH2 = '';
                            this.focusedH3 = '';
                        }

                        if (this.list[item.h1_index].child.length > 0 && this.focusedH2 !== item.h2_index) {
                            $menu.find('[data-parent-h2-id]').removeClass("open");
                            $menu.find('[data-parent-h2-id="' + this.list[item.h1_index].child[item.h2_index].id + '"]').addClass("open");
                            $menu.find('[data-h2-id]').removeClass("open");
                            $menu.find('[data-h2-id="' + this.list[item.h1_index].child[item.h2_index].id + '"]').addClass("open");
                            this.focusedH2 = item.h2_index;
                            this.focusedH3 = '';
                        }

                        break;
                    }
                }

            }
        }
    }
})();

$(document.body).ready(function () {
    if (!window.fn_docs) return;

    fn_docs._jos = (function () {
        return {
            "menu-target": $("#docs-menu-print-target"),
            "docs-header-tool": $("#docs-header-tool"),
            "docs-body": $("#docs-body"),
            "docs-foot": $("#docs-foot"),
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
    });

    var windowScrollTop = 0;
    $(window).on('load resize scroll', function () {
        windowScrollTop = $(window).scrollTop();

        /// viewType 결정
        var viewType;
        if (windowScrollTop >= fn_docs._data["doc-heder-tool-change-position"]) {
            viewType = 1;
            if (fn_docs.menu.target) {
                if (fn_docs.menu.target.outerHeight() + windowScrollTop > $(document.body).height() - fn_docs._jos['docs-foot'].height()) {
                    viewType = 2;
                }
            }
        }
        else {
            viewType = 0;
        }

        /// viewType이 변경 되었다면 CSS Class 변경
        if (fn_docs.menu.viewType != viewType) {
            if (viewType == 0) {
                fn_docs._jos["docs-header-tool"].removeClass("reflection");
                if (fn_docs.menu.printed) fn_docs.menu.target.attr("class", "docs-menu").css({top: 'auto'});
            }
            else if (viewType == 1) {
                fn_docs._jos["docs-header-tool"].addClass("reflection");
                if (fn_docs.menu.printed) fn_docs.menu.target.attr("class", "docs-menu fixed").css({top: 70});
            }
            else if (viewType == 2) {
                fn_docs._jos["docs-header-tool"].addClass("reflection");
                if (fn_docs.menu.printed) {
                    fn_docs.menu.target.attr("class", "docs-menu fixed fixed-bottom")
                        .css({top: $(document.body).height() - fn_docs._jos['docs-foot'].height() - fn_docs.menu.target.outerHeight() - fn_docs._data["doc-heder-tool-change-position"]});
                }
            }
            fn_docs.menu.viewType = viewType;
        }

        /// windowScrollTop 위치에 맞게 메뉴 하이라이트
        if (fn_docs.menu.scrollType === "inline") {
            fn_docs.menu.setFocus(windowScrollTop);
        }
    });
});