"use strict";

// ax5.ui.grid
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var GRID;

    UI.addClass({
        className: "grid",
        version: "0.0.5"
    }, function () {
        /**
         * @class ax5grid
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```
         * var myGrid = new ax5.ui.grid();
         * ```
         */
        var ax5grid = function ax5grid() {
            var self = this,
                cfg;

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
                lineNumberColumnWidth: 30,
                rowSelectorColumnWidth: 30,

                header: {
                    columnHeight: 23,
                    columnPadding: 3,
                    columnBorderWidth: 1
                },
                body: {
                    columnHeight: 23,
                    columnPadding: 3,
                    columnBorderWidth: 1
                },
                scroller: {
                    size: 15,
                    barMinSize: 15
                }
            };
            this.xvar = {
                bodyTrHeight: 0, // 한줄의 높이
                scrollContentWidth: 0, // 스크롤 될 내용물의 너비 (스크롤 될 내용물 : panel['body-scroll'] 안에 컬럼이 있는)
                scrollContentHeight: 0 // 스크롤 된 내용물의 높이
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

                this.$target.html(GRID.tmpl.get("main", data));

                // 그리드 패널 프레임의 각 엘리먼트를 캐쉬합시다.
                this.$ = {
                    "container": {
                        "root": this.$target.find('[data-ax5grid-container="root"]'),
                        "header": this.$target.find('[data-ax5grid-container="header"]'),
                        "body": this.$target.find('[data-ax5grid-container="body"]'),
                        "scroller": this.$target.find('[data-ax5grid-container="scroller"]')
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
                    },
                    "scroller": {
                        "vertical": this.$target.find('[data-ax5grid-scroller="vertical"]'),
                        "vertical-bar": this.$target.find('[data-ax5grid-scroller="vertical-bar"]'),
                        "horizontal": this.$target.find('[data-ax5grid-scroller="horizontal"]'),
                        "horizontal-bar": this.$target.find('[data-ax5grid-scroller="horizontal-bar"]'),
                        "corner": this.$target.find('[data-ax5grid-scroller="corner"]')
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
                // isFirst : 그리드 정렬 메소드가 처음 호출 되었는지 판단 하하는 아규먼트
                var CT_WIDTH = this.$["container"]["root"].width();
                var CT_HEIGHT = this.$["container"]["root"].height();
                var CT_INNER_WIDTH = CT_WIDTH;
                var CT_INNER_HEIGHT = CT_HEIGHT;

                var asidePanelWidth = cfg.asidePanelWidth = function () {
                    var width = 0;
                    if (cfg.showLineNumber) width += cfg.lineNumberColumnWidth;
                    if (cfg.showRowSelector) width += cfg.rowSelectorColumnWidth;
                    return width;
                }();
                var frozenPanelWidth = cfg.frozenPanelWidth = function (colGroup, endIndex) {
                    var width = 0;
                    for (var i = 0, l = endIndex; i < l; i++) {
                        width += colGroup[i]._width;
                    }
                    return width;
                }(this.colGroup, cfg.frozenColumnIndex);
                var rightPanelWidth = 0; // todo : 우측 함계컬럼 넘비 계산
                var frozenRowHeight = function (bodyTrHeight) {
                    return cfg.frozenRowIndex * bodyTrHeight;
                }(this.xvar.bodyTrHeight); // todo : 고정행 높이 계산하기
                var footSumHeight = 0;

                var headerHeight = this.headerTable.rows.length * cfg.header.columnHeight;
                /// todo : 그리드 스크롤러 표시여부 결정 스크롤러 표시 여부에 따라 그리드 각 패널들의 크기 조정
                // 데이터의 길이가 body보다 높을때. 수직 스크롤러 활성화
                var verticalScrollerWidth = function () {
                    return CT_HEIGHT - headerHeight < this.data.length * this.xvar.bodyTrHeight ? this.config.scroller.size : 0;
                }.call(this);
                // 남은 너비가 colGroup의 너비보다 넓을때. 수평 스크롤 활성화.
                var horizontalScrollerHeight = function () {
                    var totalColGroupWidth = 0;
                    // aside 빼고 너비
                    // 수직 스크롤이 있으면 또 빼고 비교
                    var bodyWidth = CT_WIDTH - asidePanelWidth - verticalScrollerWidth;
                    for (var i = 0, l = this.colGroup.length; i < l; i++) {
                        totalColGroupWidth += this.colGroup[i]._width;
                    }
                    return totalColGroupWidth > bodyWidth ? this.config.scroller.size : 0;
                }.call(this);

                // 수평 너비 결정
                CT_INNER_WIDTH = CT_WIDTH - verticalScrollerWidth;
                // 수직 스크롤러의 높이 결정.
                CT_INNER_HEIGHT = CT_HEIGHT - horizontalScrollerHeight;

                var bodyHeight = CT_INNER_HEIGHT - headerHeight;

                var panelDisplayProcess = function panelDisplayProcess(panel, vPosition, hPosition, containerType) {
                    var css = {};
                    var isHide = false;

                    switch (hPosition) {
                        case "aside":
                            if (asidePanelWidth === 0) {
                                isHide = true;
                            } else {
                                css["left"] = 0;
                                css["width"] = asidePanelWidth;
                            }
                            break;
                        case "left":
                            if (cfg.frozenColumnIndex === 0) {
                                isHide = true;
                            } else {
                                css["left"] = asidePanelWidth;
                                css["width"] = frozenPanelWidth;
                            }
                            break;
                        case "right":
                            if (!cfg.rightSum) {
                                isHide = true;
                            } else {}
                            break;
                        default:
                            if (cfg.frozenColumnIndex === 0) {
                                css["left"] = asidePanelWidth;
                            } else {
                                css["left"] = frozenPanelWidth + asidePanelWidth;
                            }
                            css["width"] = CT_INNER_WIDTH - asidePanelWidth - frozenPanelWidth - rightPanelWidth;
                            break;
                    }

                    if (isHide) {
                        // 프로세스 중지
                        return this;
                    }

                    if (containerType === "body") {
                        switch (vPosition) {
                            case "top":
                                if (cfg.frozenRowIndex == 0) {
                                    isHide = true;
                                } else {
                                    css["top"] = 0;
                                    css["height"] = frozenRowHeight;
                                }
                                break;
                            case "bottom":
                                if (!cfg.footSum) {
                                    isHide = true;
                                } else {
                                    css["top"] = bodyHeight - footSumHeight;
                                    css["height"] = footSumHeight; // footSum height
                                }
                                break;
                            default:

                                css["top"] = frozenRowHeight;
                                css["height"] = bodyHeight - frozenRowHeight - footSumHeight;

                                break;
                        }
                    } else if (containerType === "header") {
                        css["height"] = headerHeight;
                    }

                    if (isHide) {
                        panel.hide();
                        // 프로세스 중지
                        return this;
                    }

                    panel.css(css);
                    return this;
                };
                var scrollerDisplayProcess = function scrollerDisplayProcess(panel, scrollerWidth, scrollerHeight, containerType) {
                    var css = {};
                    var isHide = false;

                    switch (containerType) {
                        case "vertical":
                            if (scrollerWidth > 0) {
                                css["width"] = scrollerWidth;
                                css["height"] = CT_INNER_HEIGHT;
                                css["bottom"] = scrollerHeight;
                            } else {
                                isHide = true;
                            }
                            break;
                        case "horizontal":
                            if (scrollerHeight > 0) {
                                css["width"] = CT_INNER_WIDTH;
                                css["height"] = scrollerHeight;
                                css["right"] = scrollerWidth;
                            } else {
                                isHide = true;
                            }
                            break;
                        case "corner":
                            if (scrollerWidth > 0 && scrollerHeight > 0) {
                                css["width"] = scrollerWidth;
                                css["height"] = scrollerHeight;
                            } else {
                                isHide = true;
                            }
                            break;
                    }

                    if (isHide) {
                        panel.hide();
                        // 프로세스 중지
                        return this;
                    }

                    panel.show().css(css);
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

                scrollerDisplayProcess.call(this, this.$["scroller"]["vertical"], verticalScrollerWidth, horizontalScrollerHeight, "vertical");
                scrollerDisplayProcess.call(this, this.$["scroller"]["horizontal"], verticalScrollerWidth, horizontalScrollerHeight, "horizontal");
                scrollerDisplayProcess.call(this, this.$["scroller"]["corner"], verticalScrollerWidth, horizontalScrollerHeight, "corner");
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
                GRID.header.init.call(this);
                // header를 출력합니다.
                GRID.header.repaint.call(this);

                // columns의 데이터로 body데이터를 만들고
                GRID.body.init.call(this);
                // body를 출력합니다.
                GRID.body.repaint.call(this);

                // scroller
                GRID.scroller.init.call(this);
                GRID.scroller.resize.call(this);

                jQuery(window).bind("resize.ax5grid-" + this.instanceId, function () {
                    alignGrid.call(this);
                    GRID.scroller.resize.call(this);
                }.bind(this));
                return this;
            };

            /**
             * align grid size
             * @method ax5grid.align
             * @returns {ax5grid}
             */
            this.align = function () {
                alignGrid.call(this);
                GRID.scroller.resize.call(this);
                return this;
            };

            this.setData = function (data) {
                GRID.data.set.call(this, data);
                alignGrid.call(this);
                GRID.body.repaint.call(this);
                GRID.scroller.resize.call(this);
                return this;
            };

            // 클래스 생성자
            this.main = function () {
                UI.grid_instance = UI.grid_instance || [];
                UI.grid_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }.apply(this, arguments);
        };
        return ax5grid;
    }());

    GRID = ax5.ui.grid;
})();
// ax5.ui.grid.body
(function () {
    "use strict";

    var GRID = ax5.ui.grid;
    var U = ax5.util;

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
        this.xvar.bodyTrHeight = this.bodyRowTable.rows.length * this.config.body.columnHeight;
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
        var dividedBodyRowObj = GRID.util.divideTableByFrozenColumnIndex(this.bodyRowTable, this.config.frozenColumnIndex);
        var asideBodyRowData = this.asideBodyRowData = function (dataTable) {
            var data = { rows: [] };
            for (var i = 0, l = dataTable.rows.length; i < l; i++) {
                data.rows[i] = { cols: [] };
                if (i === 0) {
                    var col = {
                        width: cfg.asideColumnWidth,
                        _width: cfg.asideColumnWidth,
                        label: "",
                        colspan: 1,
                        rowspan: dataTable.rows.length,
                        colIndex: null
                    },
                        _col = {};

                    if (cfg.showLineNumber) {
                        _col = jQuery.extend({}, col, { label: "&nbsp;", key: "__d-index__" });
                        data.rows[i].cols.push(_col);
                    }
                    if (cfg.showRowSelector) {
                        _col = jQuery.extend({}, col, { label: "", key: "__d-checkbox__" });
                        data.rows[i].cols.push(_col);
                    }
                }
            }

            return data;
        }.call(this, this.bodyRowTable);
        var leftBodyRowData = this.leftBodyRowData = dividedBodyRowObj.leftData;
        var bodyRowData = this.bodyRowData = dividedBodyRowObj.rightData;

        var data = this.data;
        var paintRowCount = Math.ceil(this.$.panel["body"].height() / this.xvar.bodyTrHeight) + 1;
        var paintStartRowIndex = Math.floor(Math.abs(this.$.panel["body-scroll"].position().top) / this.xvar.bodyTrHeight) + cfg.frozenRowIndex;

        this.xvar.scrollContentHeight = this.xvar.bodyTrHeight * (this.data.length - cfg.frozenRowIndex);
        if (this.xvar.dataRowCount === data.length && this.xvar.paintStartRowIndex === paintStartRowIndex) return this;

        // body-scroll 의 포지션에 의존적이므로..
        var repaintBody = function repaintBody(_elTarget, _colGroup, _bodyRow, _data, _scrollConfig) {
            var SS = [];
            var cgi, cgl;
            var di, dl;
            var tri, trl;
            var ci, cl;
            var col, cellHeight, tdCSS_class;
            var isScrolled = function () {
                if (typeof _scrollConfig === "undefined" || typeof _scrollConfig['paintStartRowIndex'] === "undefined") {
                    _scrollConfig = {
                        paintStartRowIndex: 0,
                        paintRowCount: _data.length
                    };
                    return false;
                } else {
                    return true;
                }
            }();

            var getFieldValue = function getFieldValue(data, index, key) {
                if (key === "__d-index__") {
                    return index + 1;
                } else if (key === "__d-checkbox__") {
                    return "C";
                } else {
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

            for (di = _scrollConfig.paintStartRowIndex, dl = function () {
                var len;
                len = _data.length;
                if (_scrollConfig.paintRowCount + _scrollConfig.paintStartRowIndex < len) {
                    len = _scrollConfig.paintRowCount + _scrollConfig.paintStartRowIndex;
                }
                return len;
            }(); di < dl; di++) {
                for (tri = 0, trl = _bodyRow.rows.length; tri < trl; tri++) {
                    SS.push('<tr class="tr-' + di % 4 + '" data-ax5grid-data-index="' + di + '">');
                    for (ci = 0, cl = _bodyRow.rows[tri].cols.length; ci < cl; ci++) {
                        col = _bodyRow.rows[tri].cols[ci];
                        cellHeight = cfg.body.columnHeight * col.rowspan - cfg.body.columnBorderWidth;
                        tdCSS_class = "";
                        if (cfg.body.columnBorderWidth) tdCSS_class += "hasBorder ";
                        if (ci == cl - 1) tdCSS_class += "isLastColumn ";

                        SS.push('<td ', 'data-ax5grid-column-row="' + tri + '" ', 'data-ax5grid-column-col="' + ci + '" ', 'data-ax5grid-data-index="' + di + '" ', 'colspan="' + col.colspan + '" rowspan="' + col.rowspan + '" ', 'class="' + tdCSS_class + '" ', 'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                        SS.push(function () {
                            var lineHeight = cfg.body.columnHeight - cfg.body.columnPadding * 2 - cfg.body.columnBorderWidth;
                            if (col.multiLine) {
                                return '<span data-ax5grid-cellHolder="multiLine" style="height:' + cellHeight + 'px;line-height: ' + lineHeight + 'px;">';
                            } else {
                                return '<span data-ax5grid-cellHolder="" style="height: ' + (cfg.body.columnHeight - cfg.body.columnBorderWidth) + 'px;line-height: ' + lineHeight + 'px;">';
                            }
                        }(), getFieldValue.call(this, _data[di], di, col.key), '</span>');

                        SS.push('</td>');
                    }
                    SS.push('<td ', 'data-ax5grid-column-row="null" ', 'data-ax5grid-column-col="null" ', 'data-ax5grid-data-index="' + di + '" ', 'style="height: ' + cfg.body.columnHeight + 'px;min-height: 1px;" ', '></td>');
                    SS.push('</tr>');
                }
            }
            SS.push('</table>');

            if (isScrolled) {
                _elTarget.css({ paddingTop: (_scrollConfig.paintStartRowIndex - cfg.frozenRowIndex) * _scrollConfig.bodyTrHeight });
            }
            _elTarget.html(SS.join(''));
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
                repaintBody(this.$.panel["top-aside-body"], this.asideColGroup, asideBodyRowData, data.slice(0, cfg.frozenRowIndex));
            }

            repaintBody(this.$.panel["aside-body-scroll"], this.asideColGroup, asideBodyRowData, data, scrollConfig);

            if (cfg.footSum) {
                // 바닥 합계
                repaintBody(this.$.panel["bottom-aside-body"], this.asideColGroup, asideBodyRowData, data);
            }
        }

        // left
        if (cfg.frozenColumnIndex > 0) {
            if (cfg.frozenRowIndex > 0) {
                // 상단 행고정
                repaintBody(this.$.panel["top-left-body"], this.leftHeaderColGroup, leftBodyRowData, data.slice(0, cfg.frozenRowIndex));
            }
            repaintBody(this.$.panel["left-body-scroll"], this.leftHeaderColGroup, leftBodyRowData, data, scrollConfig);
            if (cfg.footSum) {}
        }

        // body
        if (cfg.frozenRowIndex > 0) {
            // 상단 행고정
            repaintBody(this.$.panel["top-body-scroll"], this.headerColGroup, bodyRowData, data.slice(0, cfg.frozenRowIndex));
        }
        repaintBody(this.$.panel["body-scroll"], this.headerColGroup, bodyRowData, data, scrollConfig);
        if (cfg.footSum) {}

        // right
        if (cfg.rightSum) {
            // todo : right 표현 정리
        }

        this.xvar.paintStartRowIndex = paintStartRowIndex;
        this.xvar.dataRowCount = data.length;
    };

    var scrollTo = function scrollTo(css, type) {
        var cfg = this.config;

        if (typeof type === "undefined") {

            if (cfg.asidePanelWidth > 0) {
                this.$.panel["aside-body-scroll"].css({ top: css.top });
            }
            if (cfg.frozenColumnIndex > 0) {
                this.$.panel["left-body-scroll"].css({ top: css.top });
            }
            if (cfg.frozenRowIndex > 0) {
                this.$.panel["top-body-scroll"].css({ left: css.left });
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

    var setData = function setData() {};

    GRID.body = {
        init: init,
        repaint: repaint,
        setData: setData,
        scrollTo: scrollTo
    };
})();
// ax5.ui.grid.layout
(function () {
    "use strict";

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var init = function init() {};

    var set = function set(data) {
        this.data = U.deepCopy(data);
        return this;
    };

    var get = function get() {};

    GRID.data = {
        init: init,
        set: set,
        get: get
    };
})();
// ax5.ui.grid.header
(function () {
    "use strict";

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var init = function init() {
        // 헤더 초기화
        this.leftHeaderData = {};
        this.headerData = {};
        this.rightHeaderData = {};
    };

    var repaint = function repaint() {
        var cfg = this.config;
        var dividedHeaderObj = GRID.util.divideTableByFrozenColumnIndex(this.headerTable, this.config.frozenColumnIndex);
        var asideHeaderData = this.asideHeaderData = function (dataTable) {
            var colGroup = [];
            var data = { rows: [] };
            for (var i = 0, l = dataTable.rows.length; i < l; i++) {
                data.rows[i] = { cols: [] };
                if (i === 0) {
                    var col = {
                        label: "",
                        colspan: 1,
                        rowspan: dataTable.rows.length,
                        key: "__dindex__",
                        colIndex: null
                    },
                        _col = {};

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
        }.call(this, this.headerTable);
        var leftHeaderData = this.leftHeaderData = dividedHeaderObj.leftData;
        var headerData = this.headerData = dividedHeaderObj.rightData;

        // this.asideColGroup : asideHeaderData에서 처리 함.
        this.leftHeaderColGroup = this.colGroup.slice(0, this.config.frozenColumnIndex);
        this.headerColGroup = this.colGroup.slice(this.config.frozenColumnIndex);

        var repaintHeader = function repaintHeader(_elTarget, _colGroup, _bodyRow) {
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

            return tableWidth;
        };

        if (cfg.asidePanelWidth > 0) {
            repaintHeader(this.$.panel["aside-header"], this.asideColGroup, asideHeaderData);
        }

        if (cfg.frozenColumnIndex > 0) {
            repaintHeader(this.$.panel["left-header"], this.leftHeaderColGroup, leftHeaderData);
        }
        this.xvar.scrollContentWidth = repaintHeader(this.$.panel["header-scroll"], this.headerColGroup, headerData);

        if (cfg.rightSum) {}
    };

    var scrollTo = function scrollTo(css) {
        this.$.panel["header-scroll"].css(css);
    };

    GRID.header = {
        init: init,
        repaint: repaint,
        scrollTo: scrollTo
    };
})();
// ax5.ui.grid.scroller
(function () {
    "use strict";

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var convertScrollPosition = {
        "vertical": function vertical(css, _var) {
            var _content_height = _var._content_height - _var._panel_height;
            var _scroller_height = _var._vertical_scroller_height - _var.verticalScrollBarHeight;
            var top = _content_height * css.top / _scroller_height;
            if (top < 0) top = 0;else if (_content_height < top) {
                top = _content_height;
            }
            return {
                top: -top
            };
        },
        "horizontal": function horizontal(css, _var) {
            var _content_width = _var._content_width - _var._panel_width;
            var _scroller_width = _var._horizontal_scroller_width - _var.horizontalScrollBarWidth;
            var left = _content_width * css.left / _scroller_width;
            if (left < 0) left = 0;else if (_content_width < left) {
                left = _content_width;
            }
            return {
                left: -left
            };
        }
    };
    var convertScrollBarPosition = {
        "vertical": function vertical(_top, _var) {
            var type = "vertical";
            var _content_height = _var._content_height - _var._panel_height;
            var _scroller_height = _var._vertical_scroller_height - _var.verticalScrollBarHeight;
            var top = _scroller_height * _top / _content_height;

            if (-top > _scroller_height) {
                top = -_scroller_height;

                var scrollPositon = convertScrollPosition[type].call(this, { top: -top }, {
                    _content_width: _var._content_width,
                    _content_height: _var._content_height,
                    _panel_width: _var._panel_width,
                    _panel_height: _var._panel_height,
                    _horizontal_scroller_width: _var._horizontal_scroller_width,
                    _vertical_scroller_height: _var._vertical_scroller_height,
                    verticalScrollBarHeight: _var.verticalScrollBarHeight,
                    horizontalScrollBarWidth: _var.horizontalScrollBarWidth
                });

                GRID.body.scrollTo.call(this, scrollPositon, type);
            }

            return -top;
        },
        "horizontal": function horizontal(_left, _var) {
            var type = "horizontal";
            var _content_width = _var._content_width - _var._panel_width;
            var _scroller_width = _var._horizontal_scroller_width - _var.horizontalScrollBarWidth;
            var left = _scroller_width * _left / _content_width;

            if (-left > _scroller_width) {
                left = -_scroller_width;
                var scrollPositon = convertScrollPosition[type].call(this, { left: -left }, {
                    _content_width: _var._content_width,
                    _content_height: _var._content_height,
                    _panel_width: _var._panel_width,
                    _panel_height: _var._panel_height,
                    _horizontal_scroller_width: _var._horizontal_scroller_width,
                    _vertical_scroller_height: _var._vertical_scroller_height,
                    verticalScrollBarHeight: _var.verticalScrollBarHeight,
                    horizontalScrollBarWidth: _var.horizontalScrollBarWidth
                });

                GRID.header.scrollTo.call(this, scrollPositon);
                GRID.body.scrollTo.call(this, scrollPositon, type);
            }

            return -left;
        }
    };
    var scrollMover = {
        "click": function click(track, bar, type, e) {

            var self = this,
                trackOffset = track.offset(),
                barBox = {
                width: bar.width(), height: bar.height()
            },
                trackBox = {
                width: track.innerWidth(), height: track.innerHeight()
            },
                _vertical_scroller_height = self.$["scroller"]["vertical"].innerHeight(),
                _panel_height = self.$["panel"]["body"].height(),
                _horizontal_scroller_width = self.$["scroller"]["horizontal"].innerWidth(),
                _panel_width = self.$["panel"]["body"].width(),
                _content_height = self.xvar.scrollContentHeight,
                _content_width = self.xvar.scrollContentWidth,
                verticalScrollBarHeight = self.$["scroller"]["vertical-bar"].height(),
                horizontalScrollBarWidth = self.$["scroller"]["horizontal-bar"].width(),
                getScrollerPosition = {
                "vertical": function vertical(e) {
                    var mouseObj = GRID.util.getMousePosition(e);
                    // track을 벗어 나지 안도록 범위 체크
                    var newTop = mouseObj.clientY - trackOffset.top;
                    if (newTop < 0) {
                        newTop = 0;
                    } else if (newTop + barBox.height > trackBox.height) {
                        newTop = trackBox.height - barBox.height;
                    }
                    return { top: newTop };
                },
                "horizontal": function horizontal(e) {
                    var mouseObj = GRID.util.getMousePosition(e);
                    // track을 벗어 나지 안도록 범위 체크
                    var newLeft = mouseObj.clientX - trackOffset.left;
                    if (newLeft < 0) {
                        newLeft = 0;
                    } else if (newLeft + barBox.width > trackBox.width) {
                        newLeft = trackBox.width - barBox.width;
                    }
                    return { left: newLeft };
                }
            };

            var css = getScrollerPosition[type](e);
            bar.css(css);

            var scrollPositon = convertScrollPosition[type].call(self, css, {
                _content_width: _content_width,
                _content_height: _content_height,
                _panel_width: _panel_width,
                _panel_height: _panel_height,
                _horizontal_scroller_width: _horizontal_scroller_width,
                _vertical_scroller_height: _vertical_scroller_height,
                verticalScrollBarHeight: verticalScrollBarHeight,
                horizontalScrollBarWidth: horizontalScrollBarWidth
            });
            if (type === "horizontal") GRID.header.scrollTo.call(self, scrollPositon);
            GRID.body.scrollTo.call(self, scrollPositon, type);
        },
        "on": function on(track, bar, type) {
            var self = this,
                barOffset = bar.position(),
                barBox = {
                width: bar.width(), height: bar.height()
            },
                trackBox = {
                width: track.innerWidth(), height: track.innerHeight()
            },
                _vertical_scroller_height = self.$["scroller"]["vertical"].innerHeight(),
                _panel_height = self.$["panel"]["body"].height(),
                _horizontal_scroller_width = self.$["scroller"]["horizontal"].innerWidth(),
                _panel_width = self.$["panel"]["body"].width(),
                _content_height = self.xvar.scrollContentHeight,
                _content_width = self.xvar.scrollContentWidth,
                verticalScrollBarHeight = self.$["scroller"]["vertical-bar"].height(),
                horizontalScrollBarWidth = self.$["scroller"]["horizontal-bar"].width(),
                getScrollerPosition = {
                "vertical": function vertical(e) {
                    var mouseObj = GRID.util.getMousePosition(e);
                    self.xvar.__da = mouseObj.clientY - self.xvar.mousePosition.clientY;
                    // track을 벗어 나지 안도록 범위 체크
                    var newTop = barOffset.top + self.xvar.__da;
                    if (newTop < 0) {
                        newTop = 0;
                    } else if (newTop + barBox.height > trackBox.height) {
                        newTop = trackBox.height - barBox.height;
                    }
                    return { top: newTop };
                },
                "horizontal": function horizontal(e) {
                    var mouseObj = GRID.util.getMousePosition(e);
                    self.xvar.__da = mouseObj.clientX - self.xvar.mousePosition.clientX;
                    // track을 벗어 나지 안도록 범위 체크
                    var newLeft = barOffset.left + self.xvar.__da;
                    if (newLeft < 0) {
                        newLeft = 0;
                    } else if (newLeft + barBox.width > trackBox.width) {
                        newLeft = trackBox.width - barBox.width;
                    }
                    return { left: newLeft };
                }
            };

            self.xvar.__da = 0; // 이동량 변수 초기화 (계산이 잘못 될까바)

            jQuery(document.body).bind(GRID.util.ENM["mousemove"] + ".ax5grid-" + this.instanceId, function (e) {
                var css = getScrollerPosition[type](e);
                bar.css(css);

                var scrollPositon = convertScrollPosition[type].call(self, css, {
                    _content_width: _content_width,
                    _content_height: _content_height,
                    _panel_width: _panel_width,
                    _panel_height: _panel_height,
                    _horizontal_scroller_width: _horizontal_scroller_width,
                    _vertical_scroller_height: _vertical_scroller_height,
                    verticalScrollBarHeight: verticalScrollBarHeight,
                    horizontalScrollBarWidth: horizontalScrollBarWidth
                });

                if (type === "horizontal") GRID.header.scrollTo.call(self, scrollPositon);
                GRID.body.scrollTo.call(self, scrollPositon, type);
            }).bind(GRID.util.ENM["mouseup"] + ".ax5grid-" + this.instanceId, function (e) {
                scrollMover.off.call(self);
            }).bind("mouseleave.ax5grid-" + this.instanceId, function (e) {
                scrollMover.off.call(self);
            });

            jQuery(document.body).attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
        },
        "off": function off() {
            jQuery(document.body).unbind(GRID.util.ENM["mousemove"] + ".ax5grid-" + this.instanceId).unbind(GRID.util.ENM["mouseup"] + ".ax5grid-" + this.instanceId).unbind("mouseleave.ax5grid-" + this.instanceId);

            jQuery(document.body).removeAttr('unselectable').css('user-select', 'auto').off('selectstart');
        },
        "wheel": function wheel(delta) {
            var self = this,
                _panel_height = self.$["panel"]["body"].height(),
                _panel_width = self.$["panel"]["body"].width(),
                _content_height = self.xvar.scrollContentHeight,
                _content_width = self.xvar.scrollContentWidth;

            var _body_scroll_position = self.$["panel"]["body-scroll"].position();
            var newLeft, newTop;
            var _top_is_end = false;
            var _left_is_end = false;

            newLeft = _body_scroll_position.left - delta.x;
            newTop = _body_scroll_position.top - delta.y;

            // newTop이 범위를 넘었는지 체크
            if (newTop >= 0) {
                newTop = 0;
                _top_is_end = true;
            } else if (newTop <= _panel_height - _content_height) {
                newTop = _panel_height - _content_height;
                if (newTop >= 0) newTop = 0;
                _top_is_end = true;
            } else {
                if (delta.y == 0) _top_is_end = true;
            }

            // newLeft이 범위를 넘었는지 체크
            if (newLeft >= 0) {
                newLeft = 0;
                _left_is_end = true;
            } else if (newLeft <= _panel_width - _content_width) {
                newLeft = _panel_width - _content_width;
                if (newLeft >= 0) newLeft = 0;
                _left_is_end = true;
            } else {
                if (delta.x == 0) _left_is_end = true;
            }

            //self.$["panel"]["body-scroll"].css({left: newLeft, top: newTop});
            GRID.header.scrollTo.call(this, { left: newLeft });
            GRID.body.scrollTo.call(this, { left: newLeft, top: newTop });
            resize.call(this);

            return !_top_is_end || !_left_is_end;
        }
    };

    var init = function init() {

        //this.config.scroller.size
        var margin = 4;

        this.$["scroller"]["vertical-bar"].css({ width: this.config.scroller.size - (margin + 1), left: margin / 2 });
        this.$["scroller"]["horizontal-bar"].css({ height: this.config.scroller.size - (margin + 1), top: margin / 2 });

        this.$["scroller"]["vertical-bar"].bind(GRID.util.ENM["mousedown"], function (e) {
            this.xvar.mousePosition = GRID.util.getMousePosition(e);
            scrollMover.on.call(this, this.$["scroller"]["vertical"], this.$["scroller"]["vertical-bar"], "vertical");
        }.bind(this)).bind("dragstart", function (e) {
            U.stopEvent(e);
            return false;
        });
        this.$["scroller"]["vertical"].bind("click", function (e) {
            if (e.target && e.target.getAttribute("data-ax5grid-scroller") == "vertical") {
                scrollMover.click.call(this, this.$["scroller"]["vertical"], this.$["scroller"]["vertical-bar"], "vertical", e);
            }
        }.bind(this));

        this.$["scroller"]["horizontal-bar"].bind(GRID.util.ENM["mousedown"], function (e) {
            this.xvar.mousePosition = GRID.util.getMousePosition(e);
            scrollMover.on.call(this, this.$["scroller"]["horizontal"], this.$["scroller"]["horizontal-bar"], "horizontal");
        }.bind(this)).bind("dragstart", function (e) {
            U.stopEvent(e);
            return false;
        });
        this.$["scroller"]["horizontal"].bind("click", function (e) {
            if (e.target && e.target.getAttribute("data-ax5grid-scroller") == "horizontal") {
                scrollMover.click.call(this, this.$["scroller"]["horizontal"], this.$["scroller"]["horizontal-bar"], "horizontal", e);
            }
        }.bind(this));

        this.$["container"]["body"].bind('mousewheel DOMMouseScroll', function (e) {
            var E = e.originalEvent;
            var delta = { x: 0, y: 0 };
            if (E.detail) {
                delta.y = E.detail * 10;
            } else {
                if (typeof E.deltaY === "undefined") {
                    delta.y = E.wheelDelta;
                    delta.x = 0;
                } else {
                    delta.y = E.deltaY;
                    delta.x = E.deltaX;
                }
            }

            if (scrollMover.wheel.call(this, delta)) {
                U.stopEvent(e);
            }
        }.bind(this));
    };

    var resize = function resize() {
        var _vertical_scroller_height = this.$["scroller"]["vertical"].height(),
            _horizontal_scroller_width = this.$["scroller"]["horizontal"].width(),
            _panel_height = this.$["panel"]["body"].height(),
            _panel_width = this.$["panel"]["body"].width(),
            _content_height = this.xvar.scrollContentHeight,
            _content_width = this.xvar.scrollContentWidth,
            verticalScrollBarHeight = _panel_height * _vertical_scroller_height / _content_height,
            horizontalScrollBarWidth = _panel_width * _horizontal_scroller_width / _content_width;

        if (verticalScrollBarHeight < this.config.scroller.barMinSize) verticalScrollBarHeight = this.config.scroller.barMinSize;
        if (horizontalScrollBarWidth < this.config.scroller.barMinSize) horizontalScrollBarWidth = this.config.scroller.barMinSize;

        this.$["scroller"]["vertical-bar"].css({
            top: convertScrollBarPosition.vertical.call(this, this.$.panel["body-scroll"].position().top, {
                _content_width: _content_width,
                _content_height: _content_height,
                _panel_width: _panel_width,
                _panel_height: _panel_height,
                _horizontal_scroller_width: _horizontal_scroller_width,
                _vertical_scroller_height: _vertical_scroller_height,
                verticalScrollBarHeight: verticalScrollBarHeight,
                horizontalScrollBarWidth: horizontalScrollBarWidth
            }),
            height: verticalScrollBarHeight
        });
        this.$["scroller"]["horizontal-bar"].css({
            left: convertScrollBarPosition.horizontal.call(this, this.$.panel["body-scroll"].position().left, {
                _content_width: _content_width,
                _content_height: _content_height,
                _panel_width: _panel_width,
                _panel_height: _panel_height,
                _horizontal_scroller_width: _horizontal_scroller_width,
                _vertical_scroller_height: _vertical_scroller_height,
                verticalScrollBarHeight: verticalScrollBarHeight,
                horizontalScrollBarWidth: horizontalScrollBarWidth
            }),
            width: horizontalScrollBarWidth
        });

        _vertical_scroller_height = null;
        _horizontal_scroller_width = null;
        _panel_height = null;
        _panel_width = null;
        _content_height = null;
        _content_width = null;
        verticalScrollBarHeight = null;
        horizontalScrollBarWidth = null;
    };

    GRID.scroller = {
        init: init,
        resize: resize
    };
})();

// todo : aside checkbox
// ax5.ui.grid.tmpl
(function () {
    "use strict";

    var GRID = ax5.ui.grid;
    var main = "<div data-ax5grid-container=\"root\" data-ax5grid-instance=\"{{instanceId}}\">\n            <div data-ax5grid-container=\"header\">\n                <div data-ax5grid-panel=\"aside-header\"></div>\n                <div data-ax5grid-panel=\"left-header\"></div>\n                <div data-ax5grid-panel=\"header\">\n                    <div data-ax5grid-panel-scroll=\"header\"></div>\n                </div>\n                <div data-ax5grid-panel=\"right-header\"></div>\n            </div>\n            <div data-ax5grid-container=\"body\">\n                <div data-ax5grid-panel=\"top-aside-body\"></div>\n                <div data-ax5grid-panel=\"top-left-body\"></div>\n                <div data-ax5grid-panel=\"top-body\">\n                    <div data-ax5grid-panel-scroll=\"top-body\"></div>\n                </div>\n                <div data-ax5grid-panel=\"top-right-body\"></div>\n                <div data-ax5grid-panel=\"aside-body\">\n                    <div data-ax5grid-panel-scroll=\"aside-body\"></div>\n                </div>\n                <div data-ax5grid-panel=\"left-body\">\n                    <div data-ax5grid-panel-scroll=\"left-body\"></div>\n                </div>\n                <div data-ax5grid-panel=\"body\">\n                    <div data-ax5grid-panel-scroll=\"body\"></div>\n                </div>\n                <div data-ax5grid-panel=\"right-body\">\n                  <div data-ax5grid-panel-scroll=\"right-body\"></div>\n                </div>\n                <div data-ax5grid-panel=\"bottom-aside-body\"></div>\n                <div data-ax5grid-panel=\"bottom-left-body\"></div>\n                <div data-ax5grid-panel=\"bottom-body\">\n                    <div data-ax5grid-panel-scroll=\"bottom-body\"></div>\n                </div>\n                <div data-ax5grid-panel=\"bottom-right-body\"></div>\n            </div>\n            <div data-ax5grid-container=\"scroller\">\n                <div data-ax5grid-scroller=\"vertical\">\n                    <div data-ax5grid-scroller=\"vertical-bar\"></div>    \n                </div>\n                <div data-ax5grid-scroller=\"horizontal\">\n                    <div data-ax5grid-scroller=\"horizontal-bar\"></div>\n                </div>\n                <div data-ax5grid-scroller=\"corner\"></div>\n            </div>\n        </div>";

    GRID.tmpl = {
        "main": main,

        get: function get(tmplName, data) {
            return ax5.mustache.render(GRID.tmpl[tmplName], data);
        }
    };
})();

// ax5.ui.grid.util
(function () {
    "use strict";

    var GRID = ax5.ui.grid;
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

    var getMousePosition = function getMousePosition(e) {
        var mouseObj = 'changedTouches' in e.originalEvent ? e.originalEvent.changedTouches[0] : e;

        return {
            clientX: mouseObj.clientX,
            clientY: mouseObj.clientY
        };
    };

    var ENM = {
        "mousedown": ax5.info.supportTouch ? "touchstart" : "mousedown",
        "mousemove": ax5.info.supportTouch ? "touchmove" : "mousemove",
        "mouseup": ax5.info.supportTouch ? "touchend" : "mouseup"
    };

    GRID.util = {
        divideTableByFrozenColumnIndex: divideTableByFrozenColumnIndex,
        getMousePosition: getMousePosition,
        ENM: ENM
    };
})();