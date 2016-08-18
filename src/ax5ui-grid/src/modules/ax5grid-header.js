// ax5.ui.grid.header
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var init = function () {
        // 헤더 초기화


        this.$["container"]["header"].on("click", '[data-ax5grid-column-attr]', function (e) {
            var findError = false;
            var target = U.findParentNode(e.target, function(target){
                if(U.isString(target.getAttribute("data-ax5grid-column-resizer"))){
                    findError = true;
                    return true;
                }else if(target.getAttribute("data-ax5grid-column-attr")){
                    return true;
                }else{
                    return false;
                }
            });

            if(target && !findError) {
                console.log(target);
            }
        });
        this.$["container"]["header"]
            .on("mousedown", '[data-ax5grid-column-resizer]', function (e) {
                console.log(this);
            })
            .on("dragstart", function (e) {
                U.stopEvent(e);
                return false;
            });
    };

    var repaint = function () {
        var cfg = this.config;
        var dividedHeaderObj = GRID.util.divideTableByFrozenColumnIndex(this.headerTable, this.config.frozenColumnIndex);
        var asideHeaderData = this.asideHeaderData = (function (dataTable) {
            var colGroup = [];
            var data = {rows: []};
            for (var i = 0, l = dataTable.rows.length; i < l; i++) {
                data.rows[i] = {cols: []};
                if (i === 0) {
                    var col = {
                        label: "",
                        colspan: 1,
                        rowspan: dataTable.rows.length,
                        key: "__dindex__",
                        colIndex: null
                    }, _col = {};

                    if (cfg.showLineNumber) {
                        _col = jQuery.extend({}, col, {
                            label: "&nbsp;",
                            width: cfg.lineNumberColumnWidth,
                            _width: cfg.lineNumberColumnWidth
                        });
                        colGroup.push(_col);
                        data.rows[i].cols.push(_col);
                    }
                    if (cfg.showRowSelector) {
                        _col = jQuery.extend({}, col, {
                            label: "",
                            width: cfg.rowSelectorColumnWidth,
                            _width: cfg.rowSelectorColumnWidth
                        });
                        colGroup.push(_col);
                        data.rows[i].cols.push(_col);
                    }
                }
            }

            this.asideColGroup = colGroup;
            return data;
        }).call(this, this.headerTable);
        var leftHeaderData = this.leftHeaderData = dividedHeaderObj.leftData;
        var headerData = this.headerData = dividedHeaderObj.rightData;

        // this.asideColGroup : asideHeaderData에서 처리 함.
        this.leftHeaderColGroup = this.colGroup.slice(0, this.config.frozenColumnIndex);
        this.headerColGroup = this.colGroup.slice(this.config.frozenColumnIndex);

        var repaintHeader = function (_elTarget, _colGroup, _bodyRow) {
            var tableWidth = 0;
            var SS = [];
            SS.push('<table border="0" cellpadding="0" cellspacing="0">');
            SS.push('<colgroup>');
            for (var cgi = 0, cgl = _colGroup.length; cgi < cgl; cgi++) {
                SS.push('<col style="width:' + _colGroup[cgi]._width + 'px;"  />');
                tableWidth += _colGroup[cgi]._width;
            }
            SS.push('<col  />');
            SS.push('</colgroup>');

            for (var tri = 0, trl = _bodyRow.rows.length; tri < trl; tri++) {
                var trCSS_class = "";
                SS.push('<tr class="' + trCSS_class + '">');
                for (var ci = 0, cl = _bodyRow.rows[tri].cols.length; ci < cl; ci++) {
                    var col = _bodyRow.rows[tri].cols[ci];
                    var cellHeight = cfg.header.columnHeight * col.rowspan - cfg.header.columnBorderWidth;

                    SS.push('<td ',
                        'data-ax5grid-column-attr="' + (col.columnAttr || "default") + '" ',
                        'data-ax5grid-column-row="' + tri + '" ',
                        'data-ax5grid-column-col="' + ci + '" ',
                        'colspan="' + col.colspan + '" ',
                        'rowspan="' + col.rowspan + '" ',
                        'class="' + (function (_col) {
                            var tdCSS_class = "";
                            if (_col.styleClass) {
                                if (U.isFunction(_col.styleClass)) {
                                    tdCSS_class += _col.styleClass.call({
                                            column: _col,
                                            key: _col.key
                                        }) + " ";
                                } else {
                                    tdCSS_class += _col.styleClass + " ";
                                }
                            }
                            if (cfg.header.columnBorderWidth) tdCSS_class += "hasBorder ";
                            if (ci == cl - 1) tdCSS_class += "isLastColumn ";
                            return tdCSS_class;
                        }).call(this, col) + '" ',
                        'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                    SS.push((function () {
                        var lineHeight = (cfg.header.columnHeight - cfg.header.columnPadding * 2 - cfg.header.columnBorderWidth);
                        return '<span data-ax5grid-cellHolder="" style="height: ' + (cfg.header.columnHeight - cfg.header.columnBorderWidth) + 'px;line-height: ' + lineHeight + 'px;">';
                    })(), (col.label || "&nbsp;"), '</span>');

                    if(col.colIndex != null) {
                        SS.push('<div data-ax5grid-column-resizer="' + col.colIndex + '"></div>');
                    }

                    SS.push('</td>');
                }
                SS.push('<td ',
                    'data-ax5grid-column-row="null" ',
                    'data-ax5grid-column-col="null" ',
                    'style="height: ' + (cfg.header.columnHeight) + 'px;min-height: 1px;" ',
                    '></td>');
                SS.push('</tr>');
            }
            SS.push('</table>');

            _elTarget.html(SS.join(''));

            return tableWidth;
        };

        if (cfg.asidePanelWidth > 0) {
            repaintHeader(this.$.panel["aside-header"], this.asideColGroup, asideHeaderData);
        }

        if (cfg.frozenColumnIndex > 0) {
            repaintHeader(this.$.panel["left-header"], this.leftHeaderColGroup, leftHeaderData);
        }
        this.xvar.scrollContentWidth = repaintHeader(this.$.panel["header-scroll"], this.headerColGroup, headerData);

        if (cfg.rightSum) {

        }
    };

    var scrollTo = function (css) {
        this.$.panel["header-scroll"].css(css);
    };

    GRID.header = {
        init: init,
        repaint: repaint,
        scrollTo: scrollTo
    };

})();