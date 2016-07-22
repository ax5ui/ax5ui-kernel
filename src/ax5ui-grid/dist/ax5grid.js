"use strict";

// ax5.ui.grid
(function (root, _SUPER_) {
    "use strict";

    /**
     * @class ax5grid
     * @classdesc
     * @version 0.0.2
     * @author tom@axisj.com
     * @example
     * ```
     * var myGrid = new ax5.ui.grid();
     * ```
     */

    var modules;
    var U = ax5.util;

    //== UI Class
    var axClass = function axClass() {
        var self = this,
            cfg;

        if (_SUPER_) _SUPER_.call(this); // 부모호출

        this.name = "ax5grid";
        this.version = "0.0.2";

        this.config = {
            clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
            theme: 'default',
            animateTime: 250,

            // 틀고정 속성
            frozenColumnIndex: 0,
            frozenRowIndex: 0,
            rightSum: false,
            footSum: false,
            showLineNumber: false,
            showRowSelector: false,

            height: 400,
            columnMinWidth: 100,
            asideColumnWidth: 30,

            header: {
                columnHeight: 23,
                columnPadding: 3,
                columnBorderWidth: 1
            },
            body: {
                columnHeight: 23,
                columnPadding: 3,
                columnBorderWidth: 1
            }
        };

        // 그리드 데이터셋
        this.colGroup = [];
        this.data = [];

        cfg = this.config;

        var onStateChanged = function onStateChanged(opts, that) {
            if (opts && opts.onStateChanged) {
                opts.onStateChanged.call(that, that);
            } else if (this.onStateChanged) {
                this.onStateChanged.call(that, that);
            }
            return true;
        },
            makeHeaderTable = function makeHeaderTable(columns) {
            var table = {
                rows: []
            };
            var colIndex = 0;
            var maekRows = function maekRows(_columns, depth, parentField) {
                var row = { cols: [] };
                var i = 0,
                    l = _columns.length;

                for (; i < l; i++) {
                    var field = _columns[i];
                    var colspan = 1;

                    if (!field.hidden) {
                        field.colspan = 1;
                        field.rowspan = 1;

                        field.rowIndex = depth;
                        field.colIndex = function () {
                            if (!parentField) {
                                return colIndex++;
                            } else {
                                colIndex = parentField.colIndex + i + 1;
                                return parentField.colIndex + i;
                            }
                        }();

                        row.cols.push(field);

                        if ('columns' in field) {
                            colspan = maekRows(field.columns, depth + 1, field);
                        } else {
                            field.width = 'width' in field ? field.width : cfg.columnMinWidth;
                        }
                        field.colspan = colspan;
                    } else {}
                }

                if (row.cols.length > 0) {
                    if (!table.rows[depth]) {
                        table.rows[depth] = { cols: [] };
                    }
                    table.rows[depth].cols = table.rows[depth].cols.concat(row.cols);
                    return row.cols.length - 1 + colspan;
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
        },
            initGrid = function initGrid() {
            // 그리드 템플릿에 전달하고자 하는 데이터를 정리합시다.
            var data = {
                instanceId: this.id
            };

            this.$target.html(modules.tmpl.get("main", data));

            // 그리드 패널 프레임의 각 엘리먼트를 캐쉬합시다.
            this.$ = {
                "container": {
                    "root": this.$target.find('[data-ax5grid-container="root"]'),
                    "header": this.$target.find('[data-ax5grid-container="header"]'),
                    "body": this.$target.find('[data-ax5grid-container="body"]')
                },
                "panel": {
                    "aside-header": this.$target.find('[data-ax5grid-panel="aside-header"]'),
                    "left-header": this.$target.find('[data-ax5grid-panel="left-header"]'),
                    "header": this.$target.find('[data-ax5grid-panel="header"]'),
                    "header-scroll": this.$target.find('[data-ax5grid-panel-scroll="header"]'),
                    "right-header": this.$target.find('[data-ax5grid-panel="right-header"]'),
                    "top-aside-body": this.$target.find('[data-ax5grid-panel="top-aside-body"]'),
                    "top-left-body": this.$target.find('[data-ax5grid-panel="top-left-body"]'),
                    "top-body": this.$target.find('[data-ax5grid-panel="top-body"]'),
                    "top-body-scroll": this.$target.find('[data-ax5grid-panel-scroll="top-body"]'),
                    "top-right-body": this.$target.find('[data-ax5grid-panel="top-right-body"]'),
                    "aside-body": this.$target.find('[data-ax5grid-panel="aside-body"]'),
                    "aside-body-scroll": this.$target.find('[data-ax5grid-panel-scroll="aside-body"]'),
                    "left-body": this.$target.find('[data-ax5grid-panel="left-body"]'),
                    "left-body-scroll": this.$target.find('[data-ax5grid-panel-scroll="left-body"]'),
                    "body": this.$target.find('[data-ax5grid-panel="body"]'),
                    "body-scroll": this.$target.find('[data-ax5grid-panel-scroll="body"]'),
                    "right-body": this.$target.find('[data-ax5grid-panel="right-body"]'),
                    "right-body-scroll": this.$target.find('[data-ax5grid-panel-scroll="right-body"]'),
                    "bottom-aside-body": this.$target.find('[data-ax5grid-panel="bottom-aside-body"]'),
                    "bottom-left-body": this.$target.find('[data-ax5grid-panel="bottom-left-body"]'),
                    "bottom-body": this.$target.find('[data-ax5grid-panel="bottom-body"]'),
                    "bottom-body-scroll": this.$target.find('[data-ax5grid-panel-scroll="bottom-body"]'),
                    "bottom-right-body": this.$target.find('[data-ax5grid-panel="bottom-right-body"]')
                }
            };

            this.$["container"]["root"].css({ height: cfg.height });

            return this;
        },
            initColumns = function initColumns(columns) {
            this.columns = U.deepCopy(columns);
            this.headerTable = makeHeaderTable.call(this, this.columns);

            var colGroupMap = {};
            for (var r = 0, rl = this.headerTable.rows.length; r < rl; r++) {
                var row = this.headerTable.rows[r];
                for (var c = 0, cl = row.cols.length; c < cl; c++) {
                    colGroupMap[row.cols[c].colIndex] = jQuery.extend({}, row.cols[c]);
                }
            }

            this.colGroup = [];
            for (var k in colGroupMap) {
                this.colGroup.push(colGroupMap[k]);
            }

            return this;
        },
            resetColGroupWidth = function resetColGroupWidth() {
            /// !! 그리드 target의 크기가 변경되면 이 함수를 호출하려 this.colGroup의 _width 값을 재 계산 하여야 함. [tom]
            var CT_WIDTH = this.$["container"]["root"].width();
            var totalWidth = 0;
            var computedWidth;
            var autoWidthColgroupIndexs = [];
            var colGroup = this.colGroup;
            var i, l;

            for (i = 0, l = colGroup.length; i < l; i++) {
                if (U.isNumber(colGroup[i].width)) {
                    totalWidth += colGroup[i]._width = colGroup[i].width;
                } else if (colGroup[i].width === "*") {
                    autoWidthColgroupIndexs.push(i);
                } else if (U.right(colGroup[i].width, 1) === "%") {
                    totalWidth += colGroup[i]._width = CT_WIDTH * U.left(colGroup[i].width, "%") / 100;
                }
            }
            if (autoWidthColgroupIndexs.length > 0) {
                computedWidth = (CT_WIDTH - totalWidth) / autoWidthColgroupIndexs.length;
                for (i = 0, l = autoWidthColgroupIndexs.length; i < l; i++) {
                    colGroup[autoWidthColgroupIndexs[i]]._width = computedWidth;
                }
            }
        },
            alignGrid = function alignGrid(isFirst) {
            var CT_WIDTH = this.$["container"]["root"].width();
            var CT_HEIGHT = this.$["container"]["root"].height();
            var asideColumnWidth = function () {
                var width = 0;
                if (cfg.showLineNumber) width += cfg.asideColumnWidth;
                if (cfg.showRowSelector) width += cfg.asideColumnWidth;
                return width;
            }();
            var frozenColumnWidth = function (colGroup, endIndex) {
                var width = 0;
                for (var i = 0, l = endIndex; i < l; i++) {
                    width += colGroup[i]._width;
                }
                return width;
            }(this.colGroup, cfg.frozenColumnIndex);
            var rightColumnWidth = 0; // todo : 우측 함계컬럼 넘비 계산

            var frozenRowHeight = 0; // todo : 고정행 높이 계산하기
            var footSumHeight = 0;

            var headerHeight = this.headerTable.rows.length * cfg.header.columnHeight;
            var bodyHeight = CT_HEIGHT - headerHeight;
            var panelDisplayProcess = function panelDisplayProcess(panel, vPosition, hPosition, containerType) {
                var css = {};
                var isHide = false;

                switch (hPosition) {
                    case "aside":
                        if (asideColumnWidth === 0) {
                            panel.hide();
                            isHide = true;
                        } else {
                            css["width"] = asideColumnWidth;
                        }
                        break;
                    case "left":
                        if (cfg.frozenColumnIndex === 0) {
                            panel.hide();
                            isHide = true;
                        } else {
                            css["left"] = 0;
                            css["width"] = frozenColumnWidth;
                        }
                        break;
                    case "right":
                        if (!cfg.rightSum) {
                            panel.hide();
                            isHide = true;
                        } else {}
                        break;
                    default:
                        if (cfg.frozenColumnIndex === 0) {
                            css["left"] = 0;
                            css["width"] = CT_WIDTH - rightColumnWidth;
                        } else {
                            css["left"] = frozenColumnWidth;
                            css["width"] = CT_WIDTH - rightColumnWidth - frozenColumnWidth;
                        }
                        break;
                }

                if (isHide) {
                    // 프로세스 중지
                    return this;
                }

                if (containerType === "body") {
                    switch (vPosition) {
                        case "top":
                            if (cfg.frozenRowIndex === 0) {
                                panel.hide();
                                isHide = true;
                            } else {
                                css["top"] = 0;
                                css["height"] = frozenRowHeight;
                            }
                            break;
                        case "bottom":
                            if (!cfg.footSum) {
                                panel.hide();
                                isHide = true;
                            } else {
                                css["top"] = bodyHeight - footSumHeight;
                                css["height"] = footSumHeight; // footSum height
                            }
                            break;
                        default:
                            css["top"] = 0;
                            css["height"] = bodyHeight; // footSum height
                            if (cfg.frozenRowIndex === 0) {
                                css["top"] = frozenRowHeight;
                                css["height"] = bodyHeight - frozenRowHeight; // footSum height
                            }
                            if (cfg.footSum) {
                                // 높이값 빼기
                                css["height"] -= footSumHeight;
                            }
                            break;
                    }
                } else if (containerType === "header") {
                    css["height"] = headerHeight;
                }

                if (isHide) {
                    // 프로세스 중지
                    return this;
                }

                panel.css(css);
                return this;
            };

            this.$["container"]["header"].css({ height: headerHeight });
            this.$["container"]["body"].css({ height: bodyHeight });

            // 각 패널들의 크기 표시여부를 결정합니다
            panelDisplayProcess.call(this, this.$["panel"]["aside-header"], "", "aside", "header");
            panelDisplayProcess.call(this, this.$["panel"]["left-header"], "", "left", "header");
            panelDisplayProcess.call(this, this.$["panel"]["header"], "", "", "header");
            panelDisplayProcess.call(this, this.$["panel"]["right-header"], "", "right", "header");

            panelDisplayProcess.call(this, this.$["panel"]["top-aside-body"], "top", "aside", "body");
            panelDisplayProcess.call(this, this.$["panel"]["top-left-body"], "top", "left", "body");
            panelDisplayProcess.call(this, this.$["panel"]["top-body"], "top", "", "body");
            panelDisplayProcess.call(this, this.$["panel"]["top-right-body"], "top", "right", "body");

            panelDisplayProcess.call(this, this.$["panel"]["aside-body"], "", "aside", "body");
            panelDisplayProcess.call(this, this.$["panel"]["left-body"], "", "left", "body");
            panelDisplayProcess.call(this, this.$["panel"]["body"], "", "", "body");
            panelDisplayProcess.call(this, this.$["panel"]["right-body"], "", "right", "body");

            panelDisplayProcess.call(this, this.$["panel"]["bottom-aside-body"], "bottom", "aside", "body");
            panelDisplayProcess.call(this, this.$["panel"]["bottom-left-body"], "bottom", "left", "body");
            panelDisplayProcess.call(this, this.$["panel"]["bottom-body"], "bottom", "", "body");
            panelDisplayProcess.call(this, this.$["panel"]["bottom-right-body"], "bottom", "right", "body");
        };

        /// private end

        /**
         * Preferences of grid UI
         * @method ax5grid.setConfig
         * @param {Object} config - 클래스 속성값
         * @returns {ax5grid}
         * @example
         * ```
         * ```
         */
        this.init = function (config) {
            this.onStateChanged = cfg.onStateChanged;
            this.onClick = cfg.onClick;

            var grid = this.gridConfig = jQuery.extend(true, {}, cfg, config);

            if (!grid.target) {
                console.log(ax5.info.getError("ax5grid", "401", "init"));
                return this;
            }
            this.$target = jQuery(grid.target);

            if (!this.id) this.id = this.$target.data("data-ax5grid-id");
            if (!this.id) {
                this.id = 'ax5grid-' + ax5.getGuid();
                this.$target.data("data-ax5grid-id", grid.id);
            }

            // target attribute data
            (function (data) {
                if (U.isObject(data) && !data.error) {
                    grid = jQuery.extend(true, grid, data);
                }
            })(U.parseJson(this.$target.attr("data-ax5grid-config"), true));

            ///========

            // 그리드를 그리기 위한 가장 기초적인 작업 뼈대와 틀을 준비합니다. 이 메소드는 초기화 시 한번만 호출 되게 됩니다.
            initGrid.call(this);

            // columns데이터를 분석하여 미리 처리해야하는 데이터를 정리합니다.
            initColumns.call(this, grid.columns);
            resetColGroupWidth.call(this);

            // 그리드의 각 요소의 크기를 맞춤니다.
            alignGrid.call(this, true);

            // columns의 데이터로 header데이터를 만들고
            modules.header.init.call(this);
            // header를 출력합니다.
            modules.header.repaint.call(this);

            // columns의 데이터로 body데이터를 만들고
            modules.body.init.call(this);
            // body를 출력합니다.
            modules.body.repaint.call(this);

            return this;
        };

        /**
         * align grid size
         * @method ax5grid.align
         * @returns {ax5grid}
         */
        this.align = function () {
            alignGrid.call(this);
            return this;
        };

        this.setData = function (data) {
            modules.data.set.call(this, data);
            //modules.body.repaintByTmpl.call(this);
            modules.body.repaint.call(this);
            return this;
        };

        // 클래스 생성자
        this.main = function () {

            root.grid_instance = root.grid_instance || [];
            root.grid_instance.push(this);

            if (arguments && U.isObject(arguments[0])) {
                this.setConfig(arguments[0]);
            }
        }.apply(this, arguments);
    };
    //== UI Class

    modules = root.grid = function () {
        if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
        return axClass;
    }(); // ax5.ui에 연결
})(ax5.ui, ax5.ui.root);
// ax5.ui.grid.body
(function (root) {
    "use strict";

    var init = function init() {
        // 바디 초기화
        this.bodyRowTable = {};
        this.leftBodyRowData = {};
        this.bodyRowData = {};
        this.rightBodyRowData = {};

        // this.bodyRowMap = {};
        this.bodyRowTable = makeBodyRowTable.call(this, this.columns);

        // set oneRowHeight = this.bodyTrHeight
        // 바디에 표현될 한줄의 높이를 계산합니다.
        this.bodyTrHeight = this.bodyRowTable.rows.length * this.config.body.columnHeight;
    };

    var makeBodyRowTable = function makeBodyRowTable(columns) {
        var table = {
            rows: []
        };
        var colIndex = 0;
        var maekRows = function maekRows(_columns, depth, parentField) {
            var row = { cols: [] };
            var i = 0,
                l = _columns.length;

            var selfMakeRow = function selfMakeRow(__columns) {
                var i = 0,
                    l = __columns.length;
                for (; i < l; i++) {
                    var field = __columns[i];
                    var colspan = 1;

                    if (!field.hidden) {

                        if ('key' in field) {
                            field.colspan = 1;
                            field.rowspan = 1;

                            field.rowIndex = depth;
                            field.colIndex = function () {
                                if (!parentField) {
                                    return colIndex++;
                                } else {
                                    colIndex = parentField.colIndex + i + 1;
                                    return parentField.colIndex + i;
                                }
                            }();

                            row.cols.push(field);
                            if ('columns' in field) {
                                colspan = maekRows(field.columns, depth + 1, field);
                            }
                            field.colspan = colspan;
                        } else {
                            if ('columns' in field) {
                                selfMakeRow(field.columns, depth);
                            }
                        }
                    } else {}
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
                        field.colIndex = function () {
                            if (!parentField) {
                                return colIndex++;
                            } else {
                                colIndex = parentField.colIndex + i + 1;
                                return parentField.colIndex + i;
                            }
                        }();

                        row.cols.push(field);
                        if ('columns' in field) {
                            colspan = maekRows(field.columns, depth + 1, field);
                        }
                        field.colspan = colspan;
                    } else {
                        if ('columns' in field) {
                            selfMakeRow(field.columns, depth);
                        }
                    }
                } else {}
            }

            if (row.cols.length > 0) {
                if (!table.rows[depth]) {
                    table.rows[depth] = { cols: [] };
                }
                table.rows[depth].cols = table.rows[depth].cols.concat(row.cols);
                return row.cols.length - 1 + colspan;
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

    var repaint = function repaint() {
        var cfg = this.config;
        var dividedBodyRowObj = root.util.divideTableByFrozenColumnIndex(this.bodyRowTable, this.config.frozenColumnIndex);
        var leftBodyRowData = this.leftBodyRowData = dividedBodyRowObj.leftData;
        var bodyRowData = this.bodyRowData = dividedBodyRowObj.rightData;

        var data = this.data;
        // todo : 현재 화면에 출력될 범위를 연산하여 data를 결정.

        /// body-scroll top, height를 가지고. 처리
        console.log(this.$.panel["body-scroll"].position().top, this.$.panel["body"].height());

        var repaintBody = function repaintBody(_elTarget, _colGroup, _bodyRow, _data) {
            var SS = [];
            SS.push('<table border="0" cellpadding="0" cellspacing="0">');
            SS.push('<colgroup>');
            for (var cgi = 0, cgl = _colGroup.length; cgi < cgl; cgi++) {
                SS.push('<col style="width:' + _colGroup[cgi]._width + 'px;"  />');
            }
            SS.push('<col  />');
            SS.push('</colgroup>');

            for (var di = 0, dl = _data.length; di < dl; di++) {
                for (var tri = 0, trl = _bodyRow.rows.length; tri < trl; tri++) {
                    SS.push('<tr class="tr-' + di % 4 + '">');
                    for (var ci = 0, cl = _bodyRow.rows[tri].cols.length; ci < cl; ci++) {
                        var col = _bodyRow.rows[tri].cols[ci];
                        var cellHeight = cfg.body.columnHeight * col.rowspan - cfg.body.columnBorderWidth;
                        var tdCSS_class = "";
                        if (cfg.body.columnBorderWidth) tdCSS_class += "hasBorder ";
                        if (ci == cl - 1) tdCSS_class += "isLastColumn ";

                        SS.push('<td ', 'data-ax5grid-column-row="' + tri + '" ', 'data-ax5grid-column-col="' + ci + '" ', 'colspan="' + col.colspan + '" rowspan="' + col.rowspan + '" ', 'class="' + tdCSS_class + '" ', 'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                        SS.push(function () {
                            var lineHeight = cfg.body.columnHeight - cfg.body.columnPadding * 2 - cfg.body.columnBorderWidth;
                            if (col.multiLine) {
                                return '<span data-ax5grid-cellHolder="multiLine" style="height:' + cellHeight + 'px;line-height: ' + lineHeight + 'px;">';
                            } else {
                                return '<span data-ax5grid-cellHolder="" style="height: ' + (cfg.body.columnHeight - cfg.body.columnBorderWidth) + 'px;line-height: ' + lineHeight + 'px;">';
                            }
                        }(), _data[di][col.key] || "&nbsp;", '</span>');

                        SS.push('</td>');
                    }
                    SS.push('<td ', 'data-ax5grid-column-row="null" ', 'data-ax5grid-column-col="null" ', 'data-ax5grid-data-index="' + di + '" ', 'style="height: ' + cfg.body.columnHeight + 'px;min-height: 1px;" ', '></td>');
                    SS.push('</tr>');
                }
            }
            SS.push('</table>');

            _elTarget.html(SS.join(''));
        };

        if (cfg.frozenRowIndex > 0) {
            // 상단 행고정
        }

        if (cfg.frozenColumnIndex > 0) {
            repaintBody(this.$.panel["left-body-scroll"], this.leftHeaderColGroup, leftBodyRowData, data);
        }
        repaintBody(this.$.panel["body-scroll"], this.headerColGroup, bodyRowData, data);

        if (cfg.rightSum) {}

        if (cfg.footSum) {
            // 바닥 합계
        }
    };

    var setData = function setData() {};

    root.body = {
        init: init,
        repaint: repaint,
        setData: setData
    };
})(ax5.ui.grid);
// ax5.ui.grid.layout
(function (root) {
    "use strict";

    var U = ax5.util;
    var init = function init() {};

    var set = function set(data) {
        this.data = U.deepCopy(data);
        return this;
    };

    var get = function get() {};

    root.data = {
        init: init,
        set: set,
        get: get
    };
})(ax5.ui.grid);
// ax5.ui.grid.header
(function (root) {
    "use strict";

    var init = function init() {
        // 헤더 초기화
        this.leftHeaderData = {};
        this.headerData = {};
        this.rightHeaderData = {};
    };

    var repaint = function repaint() {
        var cfg = this.config;
        var dividedHeaderObj = root.util.divideTableByFrozenColumnIndex(this.headerTable, this.config.frozenColumnIndex);
        var leftHeaderData = this.leftHeaderData = dividedHeaderObj.leftData;
        var headerData = this.headerData = dividedHeaderObj.rightData;

        this.leftHeaderColGroup = this.colGroup.slice(0, this.config.frozenColumnIndex);
        this.headerColGroup = this.colGroup.slice(this.config.frozenColumnIndex);

        var repaintHeader = function repaintHeader(_elTarget, _colGroup, _bodyRow) {
            var SS = [];
            SS.push('<table border="0" cellpadding="0" cellspacing="0">');
            SS.push('<colgroup>');
            for (var cgi = 0, cgl = _colGroup.length; cgi < cgl; cgi++) {
                SS.push('<col style="width:' + _colGroup[cgi]._width + 'px;"  />');
            }
            SS.push('<col  />');
            SS.push('</colgroup>');

            for (var tri = 0, trl = _bodyRow.rows.length; tri < trl; tri++) {
                var trCSS_class = "";
                SS.push('<tr class="' + trCSS_class + '">');
                for (var ci = 0, cl = _bodyRow.rows[tri].cols.length; ci < cl; ci++) {
                    var col = _bodyRow.rows[tri].cols[ci];
                    var cellHeight = cfg.header.columnHeight * col.rowspan - cfg.header.columnBorderWidth;
                    var tdCSS_class = "";
                    if (cfg.header.columnBorderWidth) tdCSS_class += "hasBorder ";
                    if (ci == cl - 1) tdCSS_class += "isLastColumn ";
                    SS.push('<td ', 'data-ax5grid-column-row="' + tri + '" ', 'data-ax5grid-column-col="' + ci + '" ', 'colspan="' + col.colspan + '" rowspan="' + col.rowspan + '" ', 'class="' + tdCSS_class + '" ', 'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                    SS.push(function () {
                        var lineHeight = cfg.header.columnHeight - cfg.header.columnPadding * 2 - cfg.header.columnBorderWidth;
                        if (col.multiLine) {
                            return '<span data-ax5grid-cellHolder="multiLine" style="height:' + cellHeight + 'px;line-height: ' + lineHeight + 'px;">';
                        } else {
                            return '<span data-ax5grid-cellHolder="" style="height: ' + (cfg.header.columnHeight - cfg.header.columnBorderWidth) + 'px;line-height: ' + lineHeight + 'px;">';
                        }
                    }(), col.label || "&nbsp;", '</span>');

                    SS.push('</td>');
                }
                SS.push('<td ', 'data-ax5grid-column-row="null" ', 'data-ax5grid-column-col="null" ', 'style="height: ' + cfg.header.columnHeight + 'px;min-height: 1px;" ', '></td>');
                SS.push('</tr>');
            }
            SS.push('</table>');

            _elTarget.html(SS.join(''));
        };

        if (cfg.frozenColumnIndex > 0) {
            repaintHeader(this.$.panel["left-header"], this.leftHeaderColGroup, leftHeaderData);
        }
        repaintHeader(this.$.panel["header-scroll"], this.headerColGroup, headerData);

        if (cfg.rightSum) {}
    };

    root.header = {
        init: init,
        repaint: repaint
    };
})(ax5.ui.grid);

// ax5.ui.grid.scroller
(function (root) {
    "use strict";

    var init = function init() {};

    root.scroller = {
        init: init
    };
})(ax5.ui.grid);
// ax5.ui.grid.tmpl
(function (root) {
    "use strict";

    var main = "<div data-ax5grid-container=\"root\" data-ax5grid-instance=\"{{instanceId}}\">\n            <div data-ax5grid-container=\"header\">\n                <div data-ax5grid-panel=\"aside-header\"></div>\n                <div data-ax5grid-panel=\"left-header\"></div>\n                <div data-ax5grid-panel=\"header\">\n                    <div data-ax5grid-panel-scroll=\"header\"></div>\n                </div>\n                <div data-ax5grid-panel=\"right-header\"></div>\n            </div>\n            <div data-ax5grid-container=\"body\">\n                <div data-ax5grid-panel=\"top-aside-body\"></div>\n                <div data-ax5grid-panel=\"top-left-body\"></div>\n                <div data-ax5grid-panel=\"top-body\">\n                    <div data-ax5grid-panel-scroll=\"top-body\"></div>\n                </div>\n                <div data-ax5grid-panel=\"top-right-body\"></div>\n                <div data-ax5grid-panel=\"aside-body\">\n                    <div data-ax5grid-panel-scroll=\"aside-body\"></div>\n                </div>\n                <div data-ax5grid-panel=\"left-body\">\n                    <div data-ax5grid-panel-scroll=\"left-body\"></div>\n                </div>\n                <div data-ax5grid-panel=\"body\">\n                    <div data-ax5grid-panel-scroll=\"body\"></div>\n                </div>\n                <div data-ax5grid-panel=\"right-body\">\n                  <div data-ax5grid-panel-scroll=\"right-body\"></div>\n                </div>\n                <div data-ax5grid-panel=\"bottom-aside-body\"></div>\n                <div data-ax5grid-panel=\"bottom-left-body\"></div>\n                <div data-ax5grid-panel=\"bottom-body\">\n                    <div data-ax5grid-panel-scroll=\"bottom-body\"></div>\n                </div>\n                <div data-ax5grid-panel=\"bottom-right-body\"></div>\n            </div>\n        </div>";

    root.tmpl = {
        "main": main,

        get: function get(tmplName, data) {
            return ax5.mustache.render(root.tmpl[tmplName], data);
        }
    };
})(ax5.ui.grid);

// ax5.ui.grid.util
(function (root) {
    "use strict";

    /**
     * @method ax5grid.util.divideTableByFrozenColumnIndex
     * @param table
     * @param frozenColumnIndex
     * @returns {{leftHeaderData: {rows: Array}, headerData: {rows: Array}}}
     */

    var divideTableByFrozenColumnIndex = function divideTableByFrozenColumnIndex(table, frozenColumnIndex) {
        var tempTable_l = { rows: [] };
        var tempTable_r = { rows: [] };
        for (var r = 0, rl = table.rows.length; r < rl; r++) {
            var row = table.rows[r];

            tempTable_l.rows[r] = { cols: [] };
            tempTable_r.rows[r] = { cols: [] };

            for (var c = 0, cl = row.cols.length; c < cl; c++) {
                var col = jQuery.extend({}, row.cols[c]);
                var colStartIndex = col.colIndex,
                    colEndIndex = col.colIndex + col.colspan;

                if (colStartIndex < frozenColumnIndex) {
                    if (colEndIndex <= frozenColumnIndex) {
                        // 좌측편에 변형없이 추가
                        tempTable_l.rows[r].cols.push(col);
                    } else {
                        var leftCol = jQuery.extend({}, col);
                        var rightCol = jQuery.extend({}, leftCol);
                        leftCol.colspan = frozenColumnIndex - leftCol.colIndex;
                        rightCol.colIndex = frozenColumnIndex;
                        rightCol.colspan = col.colspan - leftCol.colspan;

                        tempTable_l.rows[r].cols.push(leftCol);
                        tempTable_r.rows[r].cols.push(rightCol);
                    }
                } else {
                    // 오른편
                    tempTable_r.rows[r].cols.push(col);
                }
            }
        }

        return {
            leftData: tempTable_l,
            rightData: tempTable_r
        };
    };

    root.util = {
        divideTableByFrozenColumnIndex: divideTableByFrozenColumnIndex
    };
})(ax5.ui.grid);