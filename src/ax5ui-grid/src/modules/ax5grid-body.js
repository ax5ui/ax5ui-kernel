// ax5.ui.grid.body
(function () {
    "use strict";

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var init = function () {
        // 바디 초기화
        this.bodyRowTable = {};
        this.leftBodyRowData = {};
        this.bodyRowData = {};
        this.rightBodyRowData = {};

        // this.bodyRowMap = {};
        this.bodyRowTable = makeBodyRowTable.call(this, this.columns);

        // set oneRowHeight = this.bodyTrHeight
        // 바디에 표현될 한줄의 높이를 계산합니다.
        this.xvar.bodyTrHeight = this.bodyRowTable.rows.length * this.config.body.columnHeight;

        this.$["container"]["body"].on("click", (function (e) {
            var self = this;
            var panelName, attr, row, col, index, rowIndex, colIndex;
            var target = ax5.util.findParentNode(e.originalEvent.target, {"data-ax5grid-event": "click"});
            var targetClick = {
                "default": function (column) {
                    console.log(self[column.panelName + "RowData"].rows[column.row].cols[column.col]);
                    //console.log(column, self.columns);
                },
                "rowSelector": function (column) {
                    //console.log(column);
                    //console.log();
                    GRID.data.select.call(self, column.index);
                    updateRowState.call(self, column.index, ["selected"]);
                },
                "lineNumber": function (column) {

                }
            };
            if (target) {
                //console.log();
                panelName = target.getAttribute("data-ax5grid-panel-name");
                attr = target.getAttribute("data-ax5grid-column-attr");
                row = target.getAttribute("data-ax5grid-column-row");
                col = target.getAttribute("data-ax5grid-column-col");
                //rowIndex = target.getAttribute("data-ax5grid-column-rowIndex");
                //colIndex = target.getAttribute("data-ax5grid-column-colIndex");
                index = target.getAttribute("data-ax5grid-data-index");

                if (attr in targetClick) {
                    targetClick[attr]({panelName: panelName, target: target, attr: attr, row: row, col: col, index: index, rowIndex: rowIndex, colIndex: colIndex});
                }
            }

        }).bind(this))
    };

    var makeBodyRowTable = function (columns) {
        var table = {
            rows: []
        };
        var colIndex = 0;
        var maekRows = function (_columns, depth, parentField) {
            var row = {cols: []};
            var i = 0, l = _columns.length;


            var selfMakeRow = function (__columns) {
                var i = 0, l = __columns.length;
                for (; i < l; i++) {
                    var field = __columns[i];
                    var colspan = 1;

                    if (!field.hidden) {

                        if ('key' in field) {
                            field.colspan = 1;
                            field.rowspan = 1;

                            field.rowIndex = depth;
                            field.colIndex = (function () {
                                if (!parentField) {
                                    return colIndex++;
                                } else {
                                    colIndex = parentField.colIndex + i + 1;
                                    return parentField.colIndex + i;
                                }
                            })();

                            row.cols.push(field);
                            if ('columns' in field) {
                                colspan = maekRows(field.columns, depth + 1, field);
                            }
                            field.colspan = colspan;
                        }
                        else {
                            if ('columns' in field) {
                                selfMakeRow(field.columns, depth);
                            }
                        }
                    } else {

                    }
                }
            };

            for (; i < l; i++) {
                var field = _columns[i];
                var colspan = 1;

                if (!field.hidden) {

                    if ('key' in field) {
                        field.colspan = 1;
                        field.rowspan = 1;

                        field.rowIndex = depth;
                        field.colIndex = (function () {
                            if (!parentField) {
                                return colIndex++;
                            } else {
                                colIndex = parentField.colIndex + i + 1;
                                return parentField.colIndex + i;
                            }
                        })();

                        row.cols.push(field);
                        if ('columns' in field) {
                            colspan = maekRows(field.columns, depth + 1, field);
                        }
                        field.colspan = colspan;
                    }
                    else {
                        if ('columns' in field) {
                            selfMakeRow(field.columns, depth);
                        }
                    }
                } else {

                }
            }

            if (row.cols.length > 0) {
                if (!table.rows[depth]) {
                    table.rows[depth] = {cols: []};
                }
                table.rows[depth].cols = table.rows[depth].cols.concat(row.cols);
                return (row.cols.length - 1) + colspan;
            } else {
                return colspan;
            }

        };
        maekRows(columns, 0);

        (function () {
            // set rowspan
            for (var r = 0, rl = table.rows.length; r < rl; r++) {
                var row = table.rows[r];
                for (var c = 0, cl = row.cols.length; c < cl; c++) {
                    var col = row.cols[c];
                    if (!('columns' in col)) {
                        col.rowspan = rl - r;
                    }
                }
            }
        })();

        return table;
    };

    var repaint = function () {
        var cfg = this.config;
        var dividedBodyRowObj = GRID.util.divideTableByFrozenColumnIndex(this.bodyRowTable, this.config.frozenColumnIndex);
        var asideBodyRowData = this.asideBodyRowData = (function (dataTable) {
            var data = {rows: []};
            for (var i = 0, l = dataTable.rows.length; i < l; i++) {
                data.rows[i] = {cols: []};
                if (i === 0) {
                    var col = {
                        label: "",
                        colspan: 1,
                        rowspan: dataTable.rows.length,
                        colIndex: null
                    }, _col = {};

                    if (cfg.showLineNumber) {
                        _col = jQuery.extend({}, col, {
                            width: cfg.lineNumberColumnWidth,
                            _width: cfg.lineNumberColumnWidth,
                            columnAttr: "lineNumber",
                            label: "&nbsp;", key: "__d-index__"
                        });
                        data.rows[i].cols.push(_col);
                    }
                    if (cfg.showRowSelector) {
                        _col = jQuery.extend({}, col, {
                            width: cfg.rowSelectorColumnWidth,
                            _width: cfg.rowSelectorColumnWidth,
                            columnAttr: "rowSelector",
                            label: "", key: "__d-checkbox__"
                        });
                        data.rows[i].cols.push(_col);
                    }
                }
            }

            return data;
        }).call(this, this.bodyRowTable);
        var leftBodyRowData = this.leftBodyRowData = dividedBodyRowObj.leftData;
        var bodyRowData = this.bodyRowData = dividedBodyRowObj.rightData;

        var data = this.data;
        var paintRowCount = Math.ceil(this.$.panel["body"].height() / this.xvar.bodyTrHeight) + 1;
        var paintStartRowIndex = Math.floor(Math.abs(this.$.panel["body-scroll"].position().top) / this.xvar.bodyTrHeight) + cfg.frozenRowIndex;

        this.xvar.scrollContentHeight = this.xvar.bodyTrHeight * (this.data.length - cfg.frozenRowIndex);
        if (this.xvar.dataRowCount === data.length && this.xvar.paintStartRowIndex === paintStartRowIndex) return this;
        this.$.livePanelKeys = [];

        // body-scroll 의 포지션에 의존적이므로..
        var repaintBody = function (_panelName, _elTargetKey, _colGroup, _bodyRow, _data, _scrollConfig) {
            var _elTarget = this.$.panel[_elTargetKey];
            var SS = [];
            var cgi, cgl;
            var di, dl;
            var tri, trl;
            var ci, cl;
            var col, cellHeight, tdCSS_class;
            var isScrolled = (function () {
                // repaint 함수가 스크롤되는지 여부
                if (typeof _scrollConfig === "undefined" || typeof _scrollConfig['paintStartRowIndex'] === "undefined") {
                    _scrollConfig = {
                        paintStartRowIndex: 0,
                        paintRowCount: _data.length
                    };
                    return false;
                } else {
                    return true;
                }
            })();

            var getFieldValue = function (data, index, key) {
                if (key === "__d-index__") {
                    return index + 1;
                }
                else if (key === "__d-checkbox__") {
                    return '<div class="checkBox"></div>';
                }
                else {
                    return data[key] || "&nbsp;";
                }
            };
            SS.push('<table border="0" cellpadding="0" cellspacing="0">');
            SS.push('<colgroup>');
            for (cgi = 0, cgl = _colGroup.length; cgi < cgl; cgi++) {
                SS.push('<col style="width:' + _colGroup[cgi]._width + 'px;"  />');
            }
            SS.push('<col  />');
            SS.push('</colgroup>');

            for (di = _scrollConfig.paintStartRowIndex, dl = (function () {
                var len;
                len = _data.length;
                if (_scrollConfig.paintRowCount + _scrollConfig.paintStartRowIndex < len) {
                    len = _scrollConfig.paintRowCount + _scrollConfig.paintStartRowIndex;
                }
                return len;
            })(); di < dl; di++) {
                for (tri = 0, trl = _bodyRow.rows.length; tri < trl; tri++) {

                    SS.push('<tr class="tr-' + (di % 4) + '" data-ax5grid-tr-data-index="' + di + '" data-ax5grid-selected="' + (_data[di][cfg.columnKeys.selected] || "false") + '">');
                    for (ci = 0, cl = _bodyRow.rows[tri].cols.length; ci < cl; ci++) {
                        col = _bodyRow.rows[tri].cols[ci];
                        cellHeight = cfg.body.columnHeight * col.rowspan - cfg.body.columnBorderWidth;
                        tdCSS_class = "";
                        if (cfg.body.columnBorderWidth) tdCSS_class += "hasBorder ";
                        if (ci == cl - 1) tdCSS_class += "isLastColumn ";

                        if (_colGroup[col.colIndex] && _colGroup[col.colIndex].CSSClass) tdCSS_class += _colGroup[col.colIndex].CSSClass + " ";
                        if (col.CSSClass) tdCSS_class += col.CSSClass + " ";

                        SS.push('<td ',
                            'data-ax5grid-panel-name="' + _panelName + '" ',
                            'data-ax5grid-event="click" ',
                            'data-ax5grid-column-row="' + tri + '" ',
                            'data-ax5grid-column-col="' + ci + '" ',
                            //'data-ax5grid-column-rowIndex="' + col.rowIndex + '" ',
                            //'data-ax5grid-column-colIndex="' + col.colIndex + '" ',
                            'data-ax5grid-data-index="' + di + '" ',
                            'data-ax5grid-column-attr="' + (col.columnAttr || "default") + '" ',
                            'colspan="' + col.colspan + '" rowspan="' + col.rowspan + '" ',
                            'class="' + tdCSS_class + '" ',
                            'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                        SS.push((function () {
                            var lineHeight = (cfg.body.columnHeight - cfg.body.columnPadding * 2 - cfg.body.columnBorderWidth);
                            if (col.multiLine) {
                                return '<span data-ax5grid-cellHolder="multiLine" style="height:' + cellHeight + 'px;line-height: ' + lineHeight + 'px;">';
                            } else {
                                return '<span data-ax5grid-cellHolder="" style="height: ' + (cfg.body.columnHeight - cfg.body.columnBorderWidth) + 'px;line-height: ' + lineHeight + 'px;">';
                            }
                        })(), getFieldValue.call(this, _data[di], di, col.key), '</span>');

                        SS.push('</td>');
                    }
                    SS.push('<td ',
                        'data-ax5grid-column-row="null" ',
                        'data-ax5grid-column-col="null" ',
                        'data-ax5grid-data-index="' + di + '" ',
                        'data-ax5grid-column-attr="' + ("default") + '" ',
                        'style="height: ' + (cfg.body.columnHeight) + 'px;min-height: 1px;" ',
                        '></td>');
                    SS.push('</tr>');
                }
            }
            SS.push('</table>');

            if (isScrolled) {
                _elTarget.css({paddingTop: (_scrollConfig.paintStartRowIndex - cfg.frozenRowIndex) * _scrollConfig.bodyTrHeight});
            }
            _elTarget.html(SS.join(''));
            this.$.livePanelKeys.push(_elTargetKey); // 사용중인 패널키를 모아둠. (뷰의 상태 변경시 사용하려고)
        };
        var scrollConfig = {
            paintStartRowIndex: paintStartRowIndex,
            paintRowCount: paintRowCount,
            bodyTrHeight: this.xvar.bodyTrHeight
        };

        // aside
        if (cfg.asidePanelWidth > 0) {
            if (cfg.frozenRowIndex > 0) {
                // 상단 행고정
                repaintBody.call(this, "asideBody", "top-aside-body", this.asideColGroup, asideBodyRowData, data.slice(0, cfg.frozenRowIndex));
            }

            repaintBody.call(this, "asideBody", "aside-body-scroll", this.asideColGroup, asideBodyRowData, data, scrollConfig);

            if (cfg.footSum) {
                // 바닥 합계
                repaintBody.call(this, "asideBody", "bottom-aside-body", this.asideColGroup, asideBodyRowData, data);
            }
        }

        // left
        if (cfg.frozenColumnIndex > 0) {
            if (cfg.frozenRowIndex > 0) {
                // 상단 행고정
                repaintBody.call(this, "leftBody", "top-left-body", this.leftHeaderColGroup, leftBodyRowData, data.slice(0, cfg.frozenRowIndex));
            }
            repaintBody.call(this, "leftBody", "left-body-scroll", this.leftHeaderColGroup, leftBodyRowData, data, scrollConfig);
            if (cfg.footSum) {

            }
        }

        // body
        if (cfg.frozenRowIndex > 0) {
            // 상단 행고정
            repaintBody.call(this, "body", "top-body-scroll", this.headerColGroup, bodyRowData, data.slice(0, cfg.frozenRowIndex));
        }
        repaintBody.call(this, "body", "body-scroll", this.headerColGroup, bodyRowData, data, scrollConfig);
        if (cfg.footSum) {

        }

        // right
        if (cfg.rightSum) {
            // todo : right 표현 정리
        }

        this.xvar.paintStartRowIndex = paintStartRowIndex;
        this.xvar.dataRowCount = data.length;
    };

    var scrollTo = function (css, type) {
        var cfg = this.config;

        if (typeof type === "undefined") {

            if (cfg.asidePanelWidth > 0) {
                this.$.panel["aside-body-scroll"].css({top: css.top});
            }
            if (cfg.frozenColumnIndex > 0) {
                this.$.panel["left-body-scroll"].css({top: css.top});
            }
            if (cfg.frozenRowIndex > 0) {
                this.$.panel["top-body-scroll"].css({left: css.left});
            }
            this.$.panel["body-scroll"].css(css);

            repaint.call(this);
        } else {
            if (cfg.asidePanelWidth > 0 && type === "vertical") {
                this.$.panel["aside-body-scroll"].css(css);
            }
            if (cfg.frozenColumnIndex > 0 && type === "vertical") {
                this.$.panel["left-body-scroll"].css(css);
            }
            if (cfg.frozenRowIndex > 0 && type === "horizontal") {
                this.$.panel["top-body-scroll"].css(css);
            }
            this.$.panel["body-scroll"].css(css);

            if (type === "vertical") {
                repaint.call(this);
            }
        }
    };

    var updateRowState = function (dindex, states) {
        var self = this;
        var cfg = this.config;

        var processor = {
            "selected": function (dindex) {
                var i = this.$.livePanelKeys.length;
                while (i--) {
                    this.$.panel[this.$.livePanelKeys[i]].find('[data-ax5grid-tr-data-index="' + dindex + '"]').attr("data-ax5grid-selected", this.data[dindex][cfg.columnKeys.selected]);
                }
            }
        };
        states.forEach(function (state) {
            processor[state].call(self, dindex);
        });
    };

    GRID.body = {
        init: init,
        repaint: repaint,
        updateRowState: updateRowState,
        scrollTo: scrollTo
    };
})();

// todo : aside checkbox