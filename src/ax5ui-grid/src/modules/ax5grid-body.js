// ax5.ui.grid.body
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var columnSelect = {
        focusClear: function () {
            var self = this;
            for (var c in self.focusedColumn) {
                var _column = self.focusedColumn[c];
                if (_column) {
                    self.$.panel[_column.panelName]
                        .find('[data-ax5grid-tr-data-index="' + _column.dindex + '"]')
                        .find('[data-ax5grid-column-rowindex="' + _column.rowIndex + '"][data-ax5grid-column-colindex="' + _column.colIndex + '"]')
                        .removeAttr('data-ax5grid-column-focused');
                }
            }
            self.focusedColumn = {};
        },
        clear: function () {
            var self = this;
            for (var c in self.selectedColumn) {
                var _column = self.selectedColumn[c];
                if (_column) {
                    self.$.panel[_column.panelName]
                        .find('[data-ax5grid-tr-data-index="' + _column.dindex + '"]')
                        .find('[data-ax5grid-column-rowindex="' + _column.rowIndex + '"][data-ax5grid-column-colindex="' + _column.colIndex + '"]')
                        .removeAttr('data-ax5grid-column-selected');
                }
            }
            self.selectedColumn = {};
        },
        init: function (column) {
            var self = this;

            // focus
            columnSelect.focusClear.call(self);
            self.focusedColumn[column.dindex + "_" + column.colIndex + "_" + column.rowIndex] = {
                panelName: column.panelName,
                dindex: column.dindex,
                rowIndex: column.rowIndex,
                colIndex: column.colIndex,
                colspan: column.colspan
            };

            // select
            columnSelect.clear.call(self);
            self.xvar.selectedRange = {
                start: [column.dindex, column.rowIndex, column.colIndex, column.colspan - 1],
                end: null
            };
            self.selectedColumn[column.dindex + "_" + column.colIndex + "_" + column.rowIndex] = (function (data) {
                if (data) {
                    return false;
                } else {
                    return {
                        panelName: column.panelName,
                        dindex: column.dindex,
                        rowIndex: column.rowIndex,
                        colIndex: column.colIndex,
                        colspan: column.colspan
                    }
                }
            })(self.selectedColumn[column.dindex + "_" + column.colIndex + "_" + column.rowIndex]);

            this.$.panel[column.panelName]
                .find('[data-ax5grid-tr-data-index="' + column.dindex + '"]')
                .find('[data-ax5grid-column-rowindex="' + column.rowIndex + '"][data-ax5grid-column-colindex="' + column.colIndex + '"]')
                .attr('data-ax5grid-column-focused', "true")
                .attr('data-ax5grid-column-selected', "true");

        },
        update: function (column) {
            var self = this;
            var dindex, colIndex, rowIndex, trl;

            self.xvar.selectedRange["end"] = [column.dindex, column.rowIndex, column.colIndex, column.colspan - 1];
            columnSelect.clear.call(self);

            var range = {
                r: {
                    s: Math.min(self.xvar.selectedRange["start"][0], self.xvar.selectedRange["end"][0]),
                    e: Math.max(self.xvar.selectedRange["start"][0], self.xvar.selectedRange["end"][0])
                },
                c: {
                    s: Math.min(self.xvar.selectedRange["start"][2], self.xvar.selectedRange["end"][2]),
                    e: Math.max(self.xvar.selectedRange["start"][2] + self.xvar.selectedRange["start"][3], self.xvar.selectedRange["end"][2] + self.xvar.selectedRange["end"][3])
                }
            };

            dindex = range.r.s;
            for (; dindex <= range.r.e; dindex++) {


                trl = this.bodyRowTable.rows.length;
                rowIndex = 0;
                for (; rowIndex < trl; rowIndex++) {
                    colIndex = range.c.s;
                    for (; colIndex <= range.c.e; colIndex++) {
                        var _panels = [],
                            panelName = "";

                        if (self.xvar.frozenRowIndex > dindex) _panels.push("top");
                        if (self.xvar.frozenColumnIndex > colIndex) _panels.push("left");
                        _panels.push("body");
                        if (_panels[0] !== "top") _panels.push("scroll");
                        panelName = _panels.join("-");

                        self.selectedColumn[dindex + "_" + colIndex + "_" + rowIndex] = {
                            panelName: panelName,
                            dindex: dindex,
                            rowIndex: rowIndex,
                            colIndex: colIndex,
                            colspan: column.colspan
                        };

                        _panels = null;
                        panelName = null;
                    }
                }
            }
            dindex = null;
            colIndex = null;
            rowIndex = null;

            for (var c in self.selectedColumn) {
                var _column = self.selectedColumn[c];
                if (_column) {
                    self.$.panel[_column.panelName]
                        .find('[data-ax5grid-tr-data-index="' + _column.dindex + '"]')
                        .find('[data-ax5grid-column-rowindex="' + _column.rowIndex + '"][data-ax5grid-column-colindex="' + _column.colIndex + '"]')
                        .attr('data-ax5grid-column-selected', 'true');
                }
            }

        }
    };

    var columnSelector = {
        "on": function (cell) {
            var self = this;
            columnSelect.init.call(self, cell);

            this.$["container"]["body"]
                .on("mousemove.ax5grid-" + this.instanceId, '[data-ax5grid-column-attr="default"]', function () {
                    if (this.getAttribute("data-ax5grid-column-rowIndex")) {
                        columnSelect.update.call(self, {
                            panelName: this.getAttribute("data-ax5grid-panel-name"),
                            dindex: Number(this.getAttribute("data-ax5grid-data-index")),
                            rowIndex: Number(this.getAttribute("data-ax5grid-column-rowIndex")),
                            colIndex: Number(this.getAttribute("data-ax5grid-column-colIndex")),
                            colspan: Number(this.getAttribute("colspan"))
                        });
                    }
                })
                .on("mouseup.ax5grid-" + this.instanceId, function () {
                    columnSelector.off.call(self);
                })
                .on("mouseleave.ax5grid-" + this.instanceId, function () {
                    columnSelector.off.call(self);
                });

            jQuery(document.body)
                .attr('unselectable', 'on')
                .css('user-select', 'none')
                .on('selectstart', false);
        },
        "off": function () {

            this.$["container"]["body"]
                .off("mousemove.ax5grid-" + this.instanceId)
                .off("mouseup.ax5grid-" + this.instanceId)
                .off("mouseleave.ax5grid-" + this.instanceId);

            jQuery(document.body)
                .removeAttr('unselectable')
                .css('user-select', 'auto')
                .off('selectstart');
        }
    };

    var updateRowState = function (states, dindex, data) {
        var self = this;
        var cfg = this.config;

        var processor = {
            "selected": function (dindex) {
                var i = this.$.livePanelKeys.length;
                while (i--) {
                    this.$.panel[this.$.livePanelKeys[i]]
                        .find('[data-ax5grid-tr-data-index="' + dindex + '"]')
                        .attr("data-ax5grid-selected", this.data[dindex][cfg.columnKeys.selected]);
                }
            },
            "selectedClear": function(){
                var si = this.selectedDataIndexs.length;
                while(si--){
                    var dindex = this.selectedDataIndexs[si];
                    var i = this.$.livePanelKeys.length;
                    while (i--) {
                        this.$.panel[this.$.livePanelKeys[i]]
                            .find('[data-ax5grid-tr-data-index="' + dindex + '"]')
                            .attr("data-ax5grid-selected", false);
                        this.data[dindex][cfg.columnKeys.selected] = false;
                    }
                }
            }
        };
        states.forEach(function (state) {
            if(!processor[state]) throw 'invaild state name';
            processor[state].call(self, dindex, data);
        });
    };

    var init = function () {
        var self = this;
        // 바디 초기화
        this.bodyRowTable = {};
        this.leftBodyRowData = {};
        this.bodyRowData = {};
        this.rightBodyRowData = {};

        this.bodyRowTable = makeBodyRowTable.call(this, this.columns);
        this.bodyRowMap = makeBodyRowMap.call(this, this.bodyRowTable);

        // 바디에 표현될 한줄의 높이를 계산합니다.
        this.xvar.bodyTrHeight = this.bodyRowTable.rows.length * this.config.body.columnHeight;

        this.$["container"]["body"].on("click", '[data-ax5grid-column-attr]', function () {
            var panelName, attr, row, col, dindex, rowIndex, colIndex;
            var targetClick = {
                "default": function (_column) {
                    var column = self.bodyRowMap[_column.rowIndex + "_" + _column.colIndex];
                    var that = {
                        self: self,
                        page: self.page,
                        data: self.data,
                        dindex: _column.dindex,
                        rowIndex: _column.rowIndex,
                        colIndex: _column.colIndex,
                        column: column,
                        value: self.data[_column.dindex][column.key]
                    };

                    if (self.config.body.onClick) {
                        self.config.body.onClick.call(that);
                    }
                },
                "rowSelector": function (_column) {
                    GRID.data.select.call(self, _column.dindex);
                    updateRowState.call(self, ["selected"], _column.dindex);
                },
                "lineNumber": function (_column) {

                }
            };

            //console.log();
            panelName = this.getAttribute("data-ax5grid-panel-name");
            attr = this.getAttribute("data-ax5grid-column-attr");
            row = Number(this.getAttribute("data-ax5grid-column-row"));
            col = Number(this.getAttribute("data-ax5grid-column-col"));
            rowIndex = Number(this.getAttribute("data-ax5grid-column-rowIndex"));
            colIndex = Number(this.getAttribute("data-ax5grid-column-colIndex"));
            dindex = Number(this.getAttribute("data-ax5grid-data-index"));

            if (attr in targetClick) {
                targetClick[attr]({
                    panelName: panelName,
                    attr: attr,
                    row: row,
                    col: col,
                    dindex: dindex,
                    rowIndex: rowIndex,
                    colIndex: colIndex
                });
            }
        });
        this.$["container"]["body"].on("mouseover", "tr", function () {
            return;
            var dindex = this.getAttribute("data-ax5grid-tr-data-index");
            var i = self.$.livePanelKeys.length;
            while (i--) {
                if (typeof self.xvar.dataHoveredIndex !== "undefined") self.$.panel[self.$.livePanelKeys[i]].find('[data-ax5grid-tr-data-index="' + self.xvar.dataHoveredIndex + '"]').removeClass("hover");
                self.$.panel[self.$.livePanelKeys[i]].find('[data-ax5grid-tr-data-index="' + dindex + '"]').addClass("hover");
            }
            self.xvar.dataHoveredIndex = dindex;
        });
        this.$["container"]["body"]
            .on("mousedown", '[data-ax5grid-column-attr="default"]', function (e) {
                if (this.getAttribute("data-ax5grid-column-rowIndex")) {
                    columnSelector.on.call(self, {
                        panelName: this.getAttribute("data-ax5grid-panel-name"),
                        dindex: Number(this.getAttribute("data-ax5grid-data-index")),
                        rowIndex: Number(this.getAttribute("data-ax5grid-column-rowIndex")),
                        colIndex: Number(this.getAttribute("data-ax5grid-column-colIndex")),
                        colspan: Number(this.getAttribute("colspan"))
                    });
                }
            })
            .on("dragstart", function (e) {
                U.stopEvent(e);
                return false;
            });
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

    var makeBodyRowMap = function (table) {
        var map = {};
        table.rows.forEach(function (row) {
            row.cols.forEach(function (col) {
                map[col.rowIndex + "_" + col.colIndex] = jQuery.extend({}, col);
            });
        });
        return map;
    };

    var repaint = function (_reset) {
        var cfg = this.config;
        var data = this.data;
        if (_reset) {
            this.xvar.paintStartRowIndex = undefined;
        }
        var paintStartRowIndex = Math.floor(Math.abs(this.$.panel["body-scroll"].position().top) / this.xvar.bodyTrHeight) + this.xvar.frozenRowIndex;
        if (this.xvar.dataRowCount === data.length && this.xvar.paintStartRowIndex === paintStartRowIndex) return this; // 스크롤 포지션 변경 여부에 따라 프로세스 진행여부 결정
        var isFirstPaint = (typeof this.xvar.paintStartRowIndex === "undefined");
        var dividedBodyRowObj = GRID.util.divideTableByFrozenColumnIndex(this.bodyRowTable, this.xvar.frozenColumnIndex);
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
        var paintRowCount = Math.ceil(this.$.panel["body"].height() / this.xvar.bodyTrHeight) + 1;
        this.xvar.scrollContentHeight = this.xvar.bodyTrHeight * (this.data.length - this.xvar.frozenRowIndex);
        this.$.livePanelKeys = [];

        // body-scroll 의 포지션에 의존적이므로..
        var repaintBody = function (_elTargetKey, _colGroup, _bodyRow, _data, _scrollConfig) {
            var _elTarget = this.$.panel[_elTargetKey];

            if (!isFirstPaint && !_scrollConfig) {
                this.$.livePanelKeys.push(_elTargetKey); // 사용중인 패널키를 모아둠. (뷰의 상태 변경시 사용하려고)
                return false;
            }

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
                            'data-ax5grid-panel-name="' + _elTargetKey + '" ',
                            'data-ax5grid-data-index="' + di + '" ',
                            'data-ax5grid-column-row="' + tri + '" ',
                            'data-ax5grid-column-col="' + ci + '" ',
                            'data-ax5grid-column-rowIndex="' + col.rowIndex + '" ',
                            'data-ax5grid-column-colIndex="' + col.colIndex + '" ',
                            'data-ax5grid-column-attr="' + (col.columnAttr || "default") + '" ',
                            (function (_focusedColumn, _selectedColumn) {
                                var attrs = "";
                                if (_focusedColumn) {
                                    attrs += 'data-ax5grid-column-focused="true" ';
                                }
                                if (_selectedColumn) {
                                    attrs += 'data-ax5grid-column-selected="true" ';
                                }
                                return attrs;
                            })(this.focusedColumn[di + "_" + col.colIndex + "_" + col.rowIndex], this.selectedColumn[di + "_" + col.colIndex + "_" + col.rowIndex]),
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
                _elTarget.css({paddingTop: (_scrollConfig.paintStartRowIndex - this.xvar.frozenRowIndex) * _scrollConfig.bodyTrHeight});
            }
            _elTarget.html(SS.join(''));
            this.$.livePanelKeys.push(_elTargetKey); // 사용중인 패널키를 모아둠. (뷰의 상태 변경시 사용하려고)
            return true;
        };
        var scrollConfig = {
            paintStartRowIndex: paintStartRowIndex,
            paintRowCount: paintRowCount,
            bodyTrHeight: this.xvar.bodyTrHeight
        };

        // aside
        if (cfg.asidePanelWidth > 0) {
            if (this.xvar.frozenRowIndex > 0) {
                // 상단 행고정
                repaintBody.call(this, "top-aside-body", this.asideColGroup, asideBodyRowData, data.slice(0, this.xvar.frozenRowIndex));
            }

            repaintBody.call(this, "aside-body-scroll", this.asideColGroup, asideBodyRowData, data, scrollConfig);

            if (cfg.footSum) {
                // 바닥 합계
                repaintBody.call(this, "bottom-aside-body", this.asideColGroup, asideBodyRowData, data);
            }
        }

        // left
        if (this.xvar.frozenColumnIndex > 0) {
            if (this.xvar.frozenRowIndex > 0) {
                // 상단 행고정
                repaintBody.call(this, "top-left-body", this.leftHeaderColGroup, leftBodyRowData, data.slice(0, this.xvar.frozenRowIndex));
            }
            repaintBody.call(this, "left-body-scroll", this.leftHeaderColGroup, leftBodyRowData, data, scrollConfig);

            if (cfg.footSum) {

            }
        }

        // body
        if (this.xvar.frozenRowIndex > 0) {
            // 상단 행고정
            repaintBody.call(this, "top-body-scroll", this.headerColGroup, bodyRowData, data.slice(0, this.xvar.frozenRowIndex));
        }
        repaintBody.call(this, "body-scroll", this.headerColGroup, bodyRowData, data, scrollConfig);
        if (cfg.footSum) {

        }

        // right
        if (cfg.rightSum) {
            // todo : right 표현 정리
        }

        this.xvar.paintStartRowIndex = paintStartRowIndex;
        this.xvar.paintRowCount = paintRowCount;
        this.xvar.dataRowCount = data.length;

        GRID.page.statusUpdate.call(this);
    };

    var scrollTo = function (css, noRepaint) {
        var cfg = this.config;

        if (cfg.asidePanelWidth > 0 && "top" in css) {
            this.$.panel["aside-body-scroll"].css({top: css.top});
        }
        if (this.xvar.frozenColumnIndex > 0 && "top" in css) {
            this.$.panel["left-body-scroll"].css({top: css.top});
        }
        if (this.xvar.frozenRowIndex > 0 && "left" in css) {
            this.$.panel["top-body-scroll"].css({left: css.left});
        }
        this.$.panel["body-scroll"].css(css);

        if (!noRepaint && "top" in css) {
            repaint.call(this);
        }
    };

    var blur = function () {
        columnSelect.focusClear.call(this);
        columnSelect.clear.call(this);
    };

    var moveFocus = function (_position) {
        var focus = {
            "UD": function (_dy) {
                var focusedColumn;
                var originalColumn;
                var while_i;

                for (var c in this.focusedColumn) {
                    focusedColumn = jQuery.extend({}, this.focusedColumn[c], true);
                    break;
                }

                originalColumn = this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex];

                columnSelect.focusClear.call(this);
                columnSelect.clear.call(this);

                if (_dy > 0) {
                    if (focusedColumn.rowIndex + (originalColumn.rowspan - 1) + _dy > this.bodyRowTable.rows.length - 1) {
                        focusedColumn.dindex = focusedColumn.dindex + _dy;
                        focusedColumn.rowIndex = 0;
                        if (focusedColumn.dindex > this.data.length - 1) focusedColumn.dindex = this.data.length - 1;
                    } else {
                        focusedColumn.rowIndex = focusedColumn.rowIndex + _dy;
                    }
                }
                else {
                    if (focusedColumn.rowIndex + _dy < 0) {
                        focusedColumn.dindex = focusedColumn.dindex + _dy;
                        focusedColumn.rowIndex = this.bodyRowTable.rows.length - 1;
                        if (focusedColumn.dindex < 0) focusedColumn.dindex = 0;
                    } else {
                        focusedColumn.rowIndex = focusedColumn.rowIndex + _dy;
                    }
                }

                while_i = 0;
                while (typeof this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex] === "undefined") {
                    if (focusedColumn.rowIndex == 0 || while_i % 2 == ((_dy > 0) ? 0 : 1)) {
                        focusedColumn.colIndex--;
                    } else {
                        focusedColumn.rowIndex--;
                    }

                    if (focusedColumn.rowIndex <= 0 && focusedColumn.colIndex <= 0) {
                        // find fail
                        break;
                    }
                    while_i++;
                }

                focusedColumn.panelName = (function () {
                    var _panels = [],
                        panelName = "";

                    if (this.xvar.frozenRowIndex > focusedColumn.dindex) _panels.push("top");
                    if (this.xvar.frozenColumnIndex > focusedColumn.colIndex) _panels.push("left");
                    _panels.push("body");
                    if (_panels[0] !== "top") _panels.push("scroll");
                    panelName = _panels.join("-");

                    return panelName;
                }).call(this);

                // 포커스 컬럼의 위치에 따라 스크롤 처리.
                (function () {
                    if (focusedColumn.dindex + 1 > this.xvar.frozenRowIndex) {
                        if (focusedColumn.dindex < this.xvar.paintStartRowIndex) {
                            scrollTo.call(this, {top: -(focusedColumn.dindex - this.xvar.frozenRowIndex) * this.xvar.bodyTrHeight});
                            GRID.scroller.resize.call(this);
                        }
                        else if (focusedColumn.dindex + 1 > this.xvar.paintStartRowIndex + (this.xvar.paintRowCount - 2)) {
                            scrollTo.call(this, {top: -(focusedColumn.dindex - this.xvar.frozenRowIndex - this.xvar.paintRowCount + 3) * this.xvar.bodyTrHeight});
                            GRID.scroller.resize.call(this);
                        }
                    }
                }).call(this);

                this.focusedColumn[focusedColumn.dindex + "_" + focusedColumn.rowIndex + "_" + focusedColumn.colIndex] = focusedColumn;
                this.$.panel[focusedColumn.panelName]
                    .find('[data-ax5grid-tr-data-index="' + focusedColumn.dindex + '"]')
                    .find('[data-ax5grid-column-rowindex="' + focusedColumn.rowIndex + '"][data-ax5grid-column-colindex="' + focusedColumn.colIndex + '"]')
                    .attr('data-ax5grid-column-focused', "true");

            },
            "LR": function (_dx) {

                var focusedColumn;
                var originalColumn;
                var while_i = 0;
                var isScrollPanel = false;
                var containerPanelName = "";

                for (var c in this.focusedColumn) {
                    focusedColumn = jQuery.extend({}, this.focusedColumn[c], true);
                    break;
                }
                originalColumn = this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex];

                columnSelect.focusClear.call(this);
                columnSelect.clear.call(this);

                if (_dx < 0) {
                    focusedColumn.colIndex = focusedColumn.colIndex + _dx;
                    if (focusedColumn.colIndex < 0) focusedColumn.colIndex = 0;
                } else {
                    focusedColumn.colIndex = focusedColumn.colIndex + (originalColumn.colspan - 1) + _dx;
                    if (focusedColumn.colIndex > this.colGroup.length - 1) focusedColumn.colIndex = this.colGroup.length - 1;
                }

                if (typeof this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex] === "undefined") {
                    focusedColumn.rowIndex = 0;
                }
                while_i = 0;
                while (typeof this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex] === "undefined") {

                    focusedColumn.colIndex--;

                    if (focusedColumn.rowIndex <= 0 && focusedColumn.colIndex <= 0) {
                        // find fail
                        break;
                    }
                    while_i++;
                }

                focusedColumn.panelName = (function () {
                    var _panels = [], panelName = "";

                    if (this.xvar.frozenRowIndex > focusedColumn.dindex) _panels.push("top");
                    if (this.xvar.frozenColumnIndex > focusedColumn.colIndex) _panels.push("left");
                    _panels.push("body");
                    if (_panels[0] !== "top") {
                        if (this.xvar.frozenColumnIndex <= focusedColumn.colIndex) {
                            containerPanelName = _panels.join("-");
                            isScrollPanel = true;
                        }
                        _panels.push("scroll");
                    }
                    panelName = _panels.join("-");

                    return panelName;
                }).call(this);

                // 포커스 컬럼의 위치에 따라 스크롤 처리.
                (function () {

                }).call(this);

                this.focusedColumn[focusedColumn.dindex + "_" + focusedColumn.rowIndex + "_" + focusedColumn.colIndex] = focusedColumn;

                var $column = this.$.panel[focusedColumn.panelName]
                    .find('[data-ax5grid-tr-data-index="' + focusedColumn.dindex + '"]')
                    .find('[data-ax5grid-column-rowindex="' + focusedColumn.rowIndex + '"][data-ax5grid-column-colindex="' + focusedColumn.colIndex + '"]')
                    .attr('data-ax5grid-column-focused', "true");

                if (isScrollPanel) {// 스크롤 패널 이라면~
                    var newLeft = (function () {
                        if ($column.position().left + $column.outerWidth() > Math.abs(this.$.panel[focusedColumn.panelName].position().left) + this.$.panel[containerPanelName].width()) {
                            return $column.position().left + $column.outerWidth() - this.$.panel[containerPanelName].width();
                        } else if (Math.abs(this.$.panel[focusedColumn.panelName].position().left) > $column.position().left) {
                            return $column.position().left;
                        } else {
                            return;
                        }
                    }).call(this);

                    //console.log(newLeft);

                    if (typeof newLeft !== "undefined") {
                        GRID.header.scrollTo.call(this, {left: -newLeft});
                        scrollTo.call(this, {left: -newLeft});
                        GRID.scroller.resize.call(this);
                    }
                }


            },
            "INDEX": function (_dindex) {

                var focusedColumn;
                var originalColumn;
                var while_i;

                for (var c in this.focusedColumn) {
                    focusedColumn = jQuery.extend({}, this.focusedColumn[c], true);
                    break;
                }
                if (!focusedColumn) {
                    focusedColumn = {
                        rowIndex: 0,
                        colIndex: 0
                    }
                }
                originalColumn = this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex];

                columnSelect.focusClear.call(this);
                columnSelect.clear.call(this);


                if (_dindex == "end") {
                    _dindex = this.data.length - 1;
                }

                focusedColumn.dindex = _dindex;
                focusedColumn.rowIndex = 0;

                while_i = 0;
                while (typeof this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex] === "undefined") {
                    if (focusedColumn.rowIndex == 0 || while_i % 2 == ((_dy > 0) ? 0 : 1)) {
                        focusedColumn.colIndex--;
                    } else {
                        focusedColumn.rowIndex--;
                    }

                    if (focusedColumn.rowIndex <= 0 && focusedColumn.colIndex <= 0) {
                        // find fail
                        break;
                    }
                    while_i++;
                }

                focusedColumn.panelName = (function () {
                    var _panels = [],
                        panelName = "";

                    if (this.xvar.frozenRowIndex > focusedColumn.dindex) _panels.push("top");
                    if (this.xvar.frozenColumnIndex > focusedColumn.colIndex) _panels.push("left");
                    _panels.push("body");
                    if (_panels[0] !== "top") _panels.push("scroll");
                    panelName = _panels.join("-");

                    return panelName;
                }).call(this);

                // 포커스 컬럼의 위치에 따라 스크롤 처리.
                (function () {
                    if (focusedColumn.dindex + 1 > this.xvar.frozenRowIndex) {
                        if (focusedColumn.dindex < this.xvar.paintStartRowIndex) {
                            scrollTo.call(this, {top: -(focusedColumn.dindex - this.xvar.frozenRowIndex) * this.xvar.bodyTrHeight});
                            GRID.scroller.resize.call(this);
                        }
                        else if (focusedColumn.dindex + 1 > this.xvar.paintStartRowIndex + (this.xvar.paintRowCount - 2)) {
                            scrollTo.call(this, {top: -(focusedColumn.dindex - this.xvar.frozenRowIndex - this.xvar.paintRowCount + 3) * this.xvar.bodyTrHeight});
                            GRID.scroller.resize.call(this);
                        }
                    }
                }).call(this);

                this.focusedColumn[focusedColumn.dindex + "_" + focusedColumn.rowIndex + "_" + focusedColumn.colIndex] = focusedColumn;
                this.$.panel[focusedColumn.panelName]
                    .find('[data-ax5grid-tr-data-index="' + focusedColumn.dindex + '"]')
                    .find('[data-ax5grid-column-rowindex="' + focusedColumn.rowIndex + '"][data-ax5grid-column-colindex="' + focusedColumn.colIndex + '"]')
                    .attr('data-ax5grid-column-focused', "true");
            }
        };
        var processor = {
            "UP": function () {
                focus["UD"].call(this, -1);
            },
            "DOWN": function () {
                focus["UD"].call(this, 1);
            },
            "LEFT": function () {
                focus["LR"].call(this, -1);
            },
            "RIGHT": function () {
                focus["LR"].call(this, 1);
            },
            "HOME": function () {
                focus["INDEX"].call(this, 0);
            },
            "END": function () {
                focus["INDEX"].call(this, "end");
            },
            "position": function (_position) {
                focus["INDEX"].call(this, _position);
            }
        };

        if (_position in processor) {
            processor[_position].call(this);
            return this;
        } else {
            processor["position"].call(this, _position);
        }


    };

    GRID.body = {
        init: init,
        repaint: repaint,
        updateRowState: updateRowState,
        scrollTo: scrollTo,
        blur: blur,
        moveFocus: moveFocus
    };
})();
