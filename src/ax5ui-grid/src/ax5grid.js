// ax5.ui.grid
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var GRID;

    UI.addClass({
        className: "grid",
        version: "0.0.5"
    }, (function () {
        /**
         * @class ax5grid
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```
         * var myGrid = new ax5.ui.grid();
         * ```
         */
        var ax5grid = function () {
            var
                self = this,
                cfg;

            this.config = {
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
                rowSelectorColumnWidth: 25,

                header: {
                    columnHeight: 25,
                    columnPadding: 3,
                    columnBorderWidth: 1
                },
                body: {
                    columnHeight: 25,
                    columnPadding: 3,
                    columnBorderWidth: 1
                },
                scroller: {
                    size: 15,
                    barMinSize: 15
                },

                columnKeys:{
                    selected: '_SELECTED'
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

            var
                onStateChanged = function (opts, that) {
                    if (opts && opts.onStateChanged) {
                        opts.onStateChanged.call(that, that);
                    }
                    else if (this.onStateChanged) {
                        this.onStateChanged.call(that, that);
                    }
                    return true;
                },
                makeHeaderTable = function (columns) {
                    var table = {
                        rows: []
                    };
                    var colIndex = 0;
                    var maekRows = function (_columns, depth, parentField) {
                        var row = {cols: []};
                        var i = 0, l = _columns.length;

                        for (; i < l; i++) {
                            var field = _columns[i];
                            var colspan = 1;

                            if (!field.hidden) {
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
                                } else {
                                    field.width = ('width' in field) ? field.width : cfg.columnMinWidth;
                                }
                                field.colspan = colspan;
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
                },
                initGrid = function () {
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
                        "livePanelKeys": [], // 현재 사용중인 패널들 (grid-body repaint에서 수집하여 처리)
                        "scroller": {
                            "vertical": this.$target.find('[data-ax5grid-scroller="vertical"]'),
                            "vertical-bar": this.$target.find('[data-ax5grid-scroller="vertical-bar"]'),
                            "horizontal": this.$target.find('[data-ax5grid-scroller="horizontal"]'),
                            "horizontal-bar": this.$target.find('[data-ax5grid-scroller="horizontal-bar"]'),
                            "corner": this.$target.find('[data-ax5grid-scroller="corner"]')
                        }
                    };

                    this.$["container"]["root"].css({height: cfg.height});

                    return this;
                },
                initColumns = function (columns) {
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
                resetColGroupWidth = function () {
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
                alignGrid = function (isFirst) {
                    // isFirst : 그리드 정렬 메소드가 처음 호출 되었는지 판단 하하는 아규먼트
                    var CT_WIDTH = this.$["container"]["root"].width();
                    var CT_HEIGHT = this.$["container"]["root"].height();
                    var CT_INNER_WIDTH = CT_WIDTH;
                    var CT_INNER_HEIGHT = CT_HEIGHT;

                    var asidePanelWidth = cfg.asidePanelWidth = (function () {
                        var width = 0;
                        if (cfg.showLineNumber) width += cfg.lineNumberColumnWidth;
                        if (cfg.showRowSelector) width += cfg.rowSelectorColumnWidth;
                        return width;
                    })();
                    var frozenPanelWidth = cfg.frozenPanelWidth = (function (colGroup, endIndex) {
                        var width = 0;
                        for (var i = 0, l = endIndex; i < l; i++) {
                            width += colGroup[i]._width;
                        }
                        return width;
                    })(this.colGroup, cfg.frozenColumnIndex);
                    var rightPanelWidth = 0; // todo : 우측 함계컬럼 넘비 계산
                    var frozenRowHeight = (function (bodyTrHeight) {
                        return cfg.frozenRowIndex * bodyTrHeight;
                    })(this.xvar.bodyTrHeight); // todo : 고정행 높이 계산하기
                    var footSumHeight = 0;

                    var headerHeight = this.headerTable.rows.length * cfg.header.columnHeight;
                    /// todo : 그리드 스크롤러 표시여부 결정 스크롤러 표시 여부에 따라 그리드 각 패널들의 크기 조정
                    // 데이터의 길이가 body보다 높을때. 수직 스크롤러 활성화
                    var verticalScrollerWidth = (function () {
                        return ((CT_HEIGHT - headerHeight) < this.data.length * this.xvar.bodyTrHeight) ? this.config.scroller.size : 0;
                    }).call(this);
                    // 남은 너비가 colGroup의 너비보다 넓을때. 수평 스크롤 활성화.
                    var horizontalScrollerHeight = (function () {
                        var totalColGroupWidth = 0;
                        // aside 빼고 너비
                        // 수직 스크롤이 있으면 또 빼고 비교
                        var bodyWidth = CT_WIDTH - asidePanelWidth - verticalScrollerWidth;
                        for (var i = 0, l = this.colGroup.length; i < l; i++) {
                            totalColGroupWidth += this.colGroup[i]._width;
                        }
                        return (totalColGroupWidth > bodyWidth) ? this.config.scroller.size : 0;
                    }).call(this);

                    // 수평 너비 결정
                    CT_INNER_WIDTH = CT_WIDTH - verticalScrollerWidth;
                    // 수직 스크롤러의 높이 결정.
                    CT_INNER_HEIGHT = CT_HEIGHT - horizontalScrollerHeight;

                    var bodyHeight = CT_INNER_HEIGHT - headerHeight;

                    var panelDisplayProcess = function (panel, vPosition, hPosition, containerType) {
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
                                } else {

                                }
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
                    var scrollerDisplayProcess = function (panel, scrollerWidth, scrollerHeight, containerType) {
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

                    this.$["container"]["header"].css({height: headerHeight});
                    this.$["container"]["body"].css({height: bodyHeight});

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

                jQuery(window).bind("resize.ax5grid-" + this.instanceId, (function () {
                    alignGrid.call(this);
                    GRID.scroller.resize.call(this);
                }).bind(this));
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
            this.main = (function () {
                UI.grid_instance = UI.grid_instance || [];
                UI.grid_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }).apply(this, arguments);
        };
        return ax5grid;
    })());

    GRID = ax5.ui.grid;
})();