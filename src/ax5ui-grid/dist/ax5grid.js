"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

// ax5.ui.grid
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var GRID;

    UI.addClass({
        className: "grid",
        version: "0.0.12"
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

            this.instanceId = ax5.getGuid();
            this.config = {
                theme: 'default',
                animateTime: 250,

                // 틀고정 속성
                frozenColumnIndex: 0,
                frozenRowIndex: 0,
                showLineNumber: false,
                showRowSelector: false,
                multipleSelect: false,

                height: 0,
                columnMinWidth: 100,
                lineNumberColumnWidth: 30,
                rowSelectorColumnWidth: 25,
                sortable: false,

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
                rightSum: false,
                footSum: false,
                page: {
                    height: 25,
                    display: true,
                    navigationItemCount: 5
                },
                scroller: {
                    size: 15,
                    barMinSize: 15
                },

                columnKeys: {
                    selected: '_SELECTED'
                }
            };
            this.xvar = {
                bodyTrHeight: 0, // 한줄의 높이
                scrollContentWidth: 0, // 스크롤 될 내용물의 너비 (스크롤 될 내용물 : panel['body-scroll'] 안에 컬럼이 있는)
                scrollContentHeight: 0 // 스크롤 된 내용물의 높이
            };
            // 그리드 데이터셋
            this.columns = []; // config.columns에서 복제된 오브젝트
            this.colGroup = []; // columns를 table태그로 출력하기 좋게 변환한 오브젝트
            this.footSum = [];
            this.list = []; // 그리드의 데이터
            this.page = {}; // 그리드의 페이지 정보
            this.sortInfo = {};
            this.focusedColumn = {};
            this.selectedColumn = {};
            this.bodyRowTable = {};
            this.leftBodyRowData = {};
            this.bodyRowData = {};
            this.rightBodyRowData = {};
            this.bodyRowMap = {};
            this.leftHeaderData = {};
            this.headerData = {};
            this.rightHeaderData = {};

            cfg = this.config;

            var onStateChanged = function onStateChanged(opts, that) {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                } else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }
                return true;
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
                        "hidden": this.$target.find('[data-ax5grid-container="hidden"]'),
                        "root": this.$target.find('[data-ax5grid-container="root"]'),
                        "header": this.$target.find('[data-ax5grid-container="header"]'),
                        "body": this.$target.find('[data-ax5grid-container="body"]'),
                        "page": this.$target.find('[data-ax5grid-container="page"]'),
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
                    },
                    "page": {
                        "navigation": this.$target.find('[data-ax5grid-page="navigation"]'),
                        "status": this.$target.find('[data-ax5grid-page="status"]')
                    },
                    "form": {
                        "clipboard": this.$target.find('[data-ax5grid-form="clipboard"]')
                    },
                    "resizer": {
                        "vertical": this.$target.find('[data-ax5grid-resizer="vertical"]'),
                        "horizontal": this.$target.find('[data-ax5grid-resizer="horizontal"]')
                    }
                };

                this.$["container"]["root"].css({ height: this.gridConfig.height });

                return this;
            },
                initColumns = function initColumns(columns) {
                this.columns = U.deepCopy(columns);
                this.headerTable = GRID.util.makeHeaderTable.call(this, this.columns);

                this.xvar.frozenColumnIndex = cfg.frozenColumnIndex > this.columns.length ? this.columns.length : cfg.frozenColumnIndex;

                this.bodyRowTable = GRID.util.makeBodyRowTable.call(this, this.columns);
                this.bodyRowMap = GRID.util.makeBodyRowMap.call(this, this.bodyRowTable);
                // 바디에 표현될 한줄의 높이를 계산합니다.
                this.xvar.bodyTrHeight = this.bodyRowTable.rows.length * this.config.body.columnHeight;

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
                onResetColumns = function onResetColumns() {
                initColumns.call(this, this.config.columns);
                resetColGroupWidth.call(this);
                alignGrid.call(this, true);
                GRID.header.repaint.call(this);
                GRID.body.repaint.call(this, true);
                GRID.scroller.resize.call(this);
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
                initFootSum = function initFootSum(footSum) {
                if (U.isArray(footSum)) {
                    this.footSum = footSum;
                    this.footSumTagle = GRID.util.makeFootSumTable.call(this, this.footSum);
                } else {
                    this.footSum = [];
                    this.footSumTagle = [];
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
                }(this.xvar.bodyTrHeight);

                var footSumHeight = function (bodyTrHeight) {
                    return this.footSum.length * bodyTrHeight;
                }.call(this, this.xvar.bodyTrHeight);

                var headerHeight = this.headerTable.rows.length * cfg.header.columnHeight;
                var pageHeight = cfg.page.display ? cfg.page.height : 0;

                // 데이터의 길이가 body보다 높을때. 수직 스크롤러 활성화
                var verticalScrollerWidth, horizontalScrollerHeight;

                (function () {
                    verticalScrollerWidth = CT_HEIGHT - headerHeight - pageHeight < this.list.length * this.xvar.bodyTrHeight ? this.config.scroller.size : 0;
                    // 남은 너비가 colGroup의 너비보다 넓을때. 수평 스크롤 활성화.
                    horizontalScrollerHeight = function () {
                        var totalColGroupWidth = 0;
                        // aside 빼고 너비
                        // 수직 스크롤이 있으면 또 빼고 비교
                        var bodyWidth = CT_WIDTH - asidePanelWidth - verticalScrollerWidth;
                        for (var i = 0, l = this.colGroup.length; i < l; i++) {
                            totalColGroupWidth += this.colGroup[i]._width;
                        }
                        return totalColGroupWidth > bodyWidth ? this.config.scroller.size : 0;
                    }.call(this);

                    if (horizontalScrollerHeight > 0) {
                        verticalScrollerWidth = CT_HEIGHT - headerHeight - pageHeight - horizontalScrollerHeight < this.list.length * this.xvar.bodyTrHeight ? this.config.scroller.size : 0;
                    }
                }).call(this);

                // 수평 너비 결정
                CT_INNER_WIDTH = CT_WIDTH - verticalScrollerWidth;
                // 수직 스크롤러의 높이 결정.
                CT_INNER_HEIGHT = CT_HEIGHT - pageHeight - horizontalScrollerHeight;

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
                            if (containerType !== "page") {
                                if (cfg.frozenColumnIndex === 0) {
                                    css["left"] = asidePanelWidth;
                                } else {
                                    css["left"] = frozenPanelWidth + asidePanelWidth;
                                }
                                css["width"] = CT_INNER_WIDTH - asidePanelWidth - frozenPanelWidth - rightPanelWidth;
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
                    } else if (containerType === "page") {
                        if (pageHeight == 0) {
                            isHide = true;
                        } else {
                            css["height"] = pageHeight;
                        }
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
                                css["bottom"] = scrollerHeight + pageHeight;
                            } else {
                                isHide = true;
                            }
                            break;
                        case "horizontal":
                            if (scrollerHeight > 0) {
                                css["width"] = CT_INNER_WIDTH;
                                css["height"] = scrollerHeight;
                                css["right"] = scrollerWidth;
                                css["bottom"] = pageHeight;
                            } else {
                                isHide = true;
                            }
                            break;
                        case "corner":
                            if (scrollerWidth > 0 && scrollerHeight > 0) {
                                css["width"] = scrollerWidth;
                                css["height"] = scrollerHeight;
                                css["bottom"] = pageHeight;
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

                panelDisplayProcess.call(this, this.$["container"]["page"], "", "", "page");
            },
                sortColumns = function sortColumns(_sortInfo) {
                GRID.header.repaint.call(this);
                GRID.data.sort.call(this, _sortInfo);
                GRID.body.repaint.call(this, true);
                GRID.scroller.resize.call(this);
            };

            /// private end

            /**
             * Preferences of grid UI
             * @method ax5grid.setConfig
             * @param {Object} config - 클래스 속성값
             * @param {Element} config.target
             * @param {Number} [config.frozenColumnIndex=0]
             * @param {Number} [config.frozenRowIndex=0]
             * @param {Boolean} [config.showLineNumber=false]
             * @param {Boolean} [config.showRowSelector=false]
             * @param {Boolean} [config.multipleSelect=false]
             * @param {Number} [config.columnMinWidth=100]
             * @param {Number} [config.lineNumberColumnWidth=30]
             * @param {Number} [config.rowSelectorColumnWidth=25]
             * @param {Boolean} [config.sortable=false]
             * @param {Boolean} [config.multiSort=false]
             * @param {Boolean} [config.remoteSort=false]
             * @param {Object} [config.header]
             * @param {Number} [config.header.columnHeight=25]
             * @param {Number} [config.header.columnPadding=3]
             * @param {Number} [config.header.columnBorderWidth=1]
             * @param {Object} [config.body]
             * @param {Number} [config.body.columnHeight=25]
             * @param {Number} [config.body.columnPadding=3]
             * @param {Number} [config.body.columnBorderWidth=1]
             * @param {Object} [config.page]
             * @param {Number} [config.page.height=25]
             * @param {Boolean} [config.page.display=true]
             * @param {Number} [config.page.navigationItemCount=5]
             * @param {Object} [config.scroller]
             * @param {Number} [config.scroller.size=15]
             * @param {Number} [config.scroller.barMinSize=15]
             * @param {Object} [config.columnKeys]
             * @param {String} [config.columnKeys.selected="_SELECTED"]
             * @param {Object} config.columns
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
                if (!this.gridConfig.height) {
                    this.gridConfig.height = this.$target.height();
                }

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

                // footSum데이터를 분석하여 미리 처리해야 하는 데이터를 정리
                initFootSum.call(this, grid.footSum);

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

                jQuery(document.body).on("click.ax5grid-" + this.instanceId, function (e) {
                    var target = U.findParentNode(e.target, { "data-ax5grid-container": "root" });
                    if (target) {
                        self.focused = true;
                    } else {
                        self.focused = false;
                        GRID.body.blur.call(self);
                    }
                });

                var ctrlKeys = {
                    "33": "KEY_PAGEUP",
                    "34": "KEY_PAGEDOWN",
                    "35": "KEY_END",
                    "36": "KEY_HOME",
                    "37": "KEY_LEFT",
                    "38": "KEY_UP",
                    "39": "KEY_RIGHT",
                    "40": "KEY_DOWN"
                };
                jQuery(window).on("keydown.ax5grid-" + this.instanceId, function (e) {
                    if (self.focused) {
                        if (e.metaKey || e.ctrlKey) {
                            if (e.which == 67) {
                                // c
                                //console.log("copy");
                                self.copySelect();
                            }
                        } else {
                            if (ctrlKeys[e.which]) {
                                self.keyDown(ctrlKeys[e.which], e);
                            }
                        }
                    }
                });
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

            /**
             * @method ax5grid.keyDown
             * @param {String} keyName
             * @param {Event||Object} data
             * @return {ax5grid}
             */
            this.keyDown = function () {
                var processor = {
                    "KEY_UP": function KEY_UP() {
                        GRID.body.moveFocus.call(this, "UP");
                    },
                    "KEY_DOWN": function KEY_DOWN() {
                        GRID.body.moveFocus.call(this, "DOWN");
                    },
                    "KEY_LEFT": function KEY_LEFT() {
                        GRID.body.moveFocus.call(this, "LEFT");
                    },
                    "KEY_RIGHT": function KEY_RIGHT() {
                        GRID.body.moveFocus.call(this, "RIGHT");
                    },
                    "KEY_HOME": function KEY_HOME() {
                        GRID.body.moveFocus.call(this, "HOME");
                    },
                    "KEY_END": function KEY_END() {
                        GRID.body.moveFocus.call(this, "END");
                    }
                };
                return function (_act, _data) {
                    if (_act in processor) processor[_act].call(this, _data);
                    return this;
                };
            }();

            /**
             * @method ax5grid.copySelect
             * @returns {Boolean} copysuccess
             */
            this.copySelect = function () {
                var copysuccess;
                var $clipBoard = this.$["form"]["clipboard"];
                var copyTextArray = [];
                var copyText = "";

                var _rowIndex, _colIndex, _dindex;
                var _di = 0;
                for (var c in this.selectedColumn) {
                    var _column = this.selectedColumn[c];
                    if (_column) {
                        if (typeof _dindex === "undefined") {
                            _dindex = _column.dindex;
                            _rowIndex = _column.rowIndex;
                            _colIndex = _column.rowIndex;
                        }

                        if (_dindex != _column.dindex || _rowIndex != _column.rowIndex) {
                            _di++;
                        }

                        if (!copyTextArray[_di]) {
                            copyTextArray[_di] = [];
                        }
                        var originalColumn = this.bodyRowMap[_column.rowIndex + "_" + _column.colIndex];
                        if (originalColumn) {
                            copyTextArray[_di].push(this.list[_column.dindex][originalColumn.key]);
                        } else {
                            copyTextArray[_di].push("");
                        }

                        _dindex = _column.dindex;
                        _rowIndex = _column.rowIndex;
                    }
                }

                copyTextArray.forEach(function (r) {
                    copyText += r.join('\t') + "\n";
                });

                $clipBoard.get(0).innerText = copyText;
                $clipBoard.select();

                try {
                    copysuccess = document.execCommand("copy");
                } catch (e) {
                    copysuccess = false;
                }
                return copysuccess;
            };

            /**
             * @method ax5grid.setData
             * @param {Array} data
             * @returns {ax5grid}
             */
            this.setData = function (data) {
                GRID.data.set.call(this, data);
                alignGrid.call(this);
                GRID.body.scrollTo.call(this, { top: 0 });
                GRID.body.repaint.call(this);
                GRID.scroller.resize.call(this);
                GRID.page.navigationUpdate.call(this);
                return this;
            };

            /**
             * @method ax5grid.setHeight
             * @param {Number} _height
             * @returns {ax5grid}
             */
            this.setHeight = function (_height) {
                //console.log(this.$target);

                if (_height == "100%") {
                    _height = this.$target.offsetParent().innerHeight();
                }
                this.$target.css({ height: _height });
                this.$["container"]["root"].css({ height: _height });
                alignGrid.call(this);
                GRID.body.repaint.call(this, "reset");
                GRID.scroller.resize.call(this);
                return this;
            };

            /**
             * @method ax5grid.align
             * @returns {ax5grid}
             */
            this.align = function () {
                alignGrid.call(this);
                return this;
            };

            /**
             * @method ax5grid.addRow
             * @param {Object} _row
             * @param {Number|String} [_dindex=last]
             * @returns {ax5grid}
             */
            this.addRow = function (_row, _dindex) {
                GRID.data.add.call(this, _row, _dindex);
                alignGrid.call(this);
                GRID.body.repaint.call(this, "reset");
                GRID.body.moveFocus.call(this, "END");
                GRID.scroller.resize.call(this);
                return this;
            };

            /**
             * @method ax5grid.removeRow
             * @param {Number|String} [_dindex=last]
             * @returns {ax5grid}
             */
            this.removeRow = function (_dindex) {
                GRID.data.remove.call(this, _dindex);
                alignGrid.call(this);
                GRID.body.repaint.call(this, "reset");
                GRID.body.moveFocus.call(this, "END");
                GRID.scroller.resize.call(this);
                return this;
            };

            /**
             * @method ax5grid.updateRow
             * @param {Object} _row
             * @param {Number} _dindex
             * @returns {ax5grid}
             */
            this.updateRow = function (_row, _dindex) {
                GRID.data.update.call(this, _row, _dindex);
                alignGrid.call(this);
                GRID.body.repaint.call(this, "reset");
                GRID.body.moveFocus.call(this, _dindex);
                GRID.scroller.resize.call(this);
                return this;
            };

            /**
             * @method ax5grid.addColumn
             * @param {Object} _column
             * @param {Number|String} [_cindex=last]
             * @returns {ax5grid}
             */
            this.addColumn = function () {
                var processor = {
                    "first": function first(_column) {
                        this.config.columns = [].concat(_column).concat(this.config.columns);
                    },
                    "last": function last(_column) {
                        this.config.columns = this.config.columns.concat([].concat(_column));
                    }
                };

                return function (_column, _cindex) {
                    if (typeof _column === "undefined") throw '_column must not be null';
                    if (typeof _cindex === "undefined") _cindex = "last";
                    if (_cindex in processor) {
                        processor[_cindex].call(this, _column);
                    } else {
                        if (!U.isNumber(_cindex)) {
                            throw 'invalid argument _cindex';
                        }
                        this.config.columns.splice(_cindex, [].concat(_column));
                    }
                    onResetColumns.call(this); // 컬럼이 변경되었을 때.
                    return this;
                };
            }();

            /**
             * @method ax5grid.removeCloumn
             * @param {Number|String} [_cindex=last]
             * @returns {ax5grid}
             */
            this.removeColumn = function () {
                var processor = {
                    "first": function first(_cindex) {
                        this.config.columns.splice(_cindex, 1);
                    },
                    "last": function last() {
                        this.config.columns.splice(this.config.columns.length - 1, 1);
                    }
                };
                return function (_cindex) {
                    if (typeof _cindex === "undefined") _cindex = "last";
                    if (_cindex in processor) {
                        processor[_cindex].call(this, _cindex);
                    } else {
                        if (!U.isNumber(_cindex)) {
                            throw 'invalid argument _cindex';
                        }
                        //
                        this.config.columns.splice(_cindex, 1);
                    }
                    onResetColumns.call(this); // 컬럼이 변경되었을 때.
                    return this;
                };
            }();

            /**
             * @method ax5grid.updateColumn
             * @param {Object} _column
             * @param {Number} _cindex
             * @returns {ax5grid}
             */
            this.updateColumn = function (_column, _cindex) {
                if (!U.isNumber(_cindex)) {
                    throw 'invalid argument _cindex';
                }
                //
                this.config.columns.splice(_cindex, 1, _column);
                onResetColumns.call(this); // 컬럼이 변경되었을 때.
                return this;
            };

            /**
             * @method ax5grid.setColumnWidth
             * @param _width
             * @param _cindex
             */
            this.setColumnWidth = function (_width, _cindex) {
                this.colGroup[this.xvar.columnResizerIndex]._width = _width;

                // 컬럼너비 변경사항 적용.
                GRID.header.repaint.call(this);
                GRID.body.repaint.call(this, true);
                GRID.scroller.resize.call(this);
                alignGrid.call(this);
                return this;
            };

            /**
             * @method ax5grid.getColumnSort
             * @returns {Object} sortInfo
             */
            this.getColumnSort = function () {

                return {};
            };

            /**
             * @method ax5grid.setColumnSort
             * @param {Object} sortInfo
             * @param {Object} sortInfo.key
             * @param {Number} sortInfo.key.seq - seq of sortOrder
             * @param {String} sortInfo.key.orderBy - "desc"|"asc"
             * @returns {ax5grid}
             * ```js
             * ax5grid.setColumnSort({a:{seq:0, orderBy:"desc"}, b:{seq:1, orderBy:"asc"}});
             * ```
             */
            this.setColumnSort = function (_sortInfo) {
                if (typeof _sortInfo !== "undefined") {
                    this.sortInfo = _sortInfo;
                    GRID.header.applySortStatus.call(this, _sortInfo);
                }

                sortColumns.call(this, this.sortInfo);
                return this;
            };

            /**
             * @method ax5grid.select
             * @param {Number||Object} _selectObject
             * @param {Number} _selectObject.index - index of row
             * @param {Number} _selectObject.rowIndex - rowIndex of columns
             * @param {Number} _selectObject.conIndex - colIndex of columns
             * @returns {ax5grid}
             */
            this.select = function (_selectObject) {
                if (U.isNumber(_selectObject)) {
                    var dindex = _selectObject;

                    if (!this.config.multipleSelect) {
                        GRID.body.updateRowState.call(this, ["selectedClear"]);
                        GRID.data.clearSelect.call(this);
                    }
                    GRID.data.select.call(this, dindex);
                    GRID.body.updateRowState.call(this, ["selected"], dindex);
                }

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

// todo : cell selected -- ok
// todo : cell multi selected -- ok
// todo : cell selected focus move by keyboard -- ok & scroll body -- ok
// todo : clipboard copy -- ok
// todo : page -- ok
// todo : paging -- ok
// todo : setStatus : loading, empty, etcs
// todo : row add / remove / update -- ok
// todo : body.onClick / select -- ok & multipleSelect : TF -- ok
// todo : column add / remove / update -- ok
// todo : cell formatter -- ok
// todo : column resize -- ok

// todo : sortable -- ok
// todo : grid footsum
// todo : grid body group
// todo : cell inline edit

// todo : filter
// todo : body menu
// todo : column reorder

// ax5.ui.grid.body
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var columnSelect = {
        focusClear: function focusClear() {
            var self = this;
            for (var c in self.focusedColumn) {
                var _column = self.focusedColumn[c];
                if (_column) {
                    self.$.panel[_column.panelName].find('[data-ax5grid-tr-data-index="' + _column.dindex + '"]').find('[data-ax5grid-column-rowindex="' + _column.rowIndex + '"][data-ax5grid-column-colindex="' + _column.colIndex + '"]').removeAttr('data-ax5grid-column-focused');
                }
            }
            self.focusedColumn = {};
        },
        clear: function clear() {
            var self = this;
            for (var c in self.selectedColumn) {
                var _column = self.selectedColumn[c];
                if (_column) {
                    self.$.panel[_column.panelName].find('[data-ax5grid-tr-data-index="' + _column.dindex + '"]').find('[data-ax5grid-column-rowindex="' + _column.rowIndex + '"][data-ax5grid-column-colindex="' + _column.colIndex + '"]').removeAttr('data-ax5grid-column-selected');
                }
            }
            self.selectedColumn = {};
        },
        init: function init(column) {
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
            self.selectedColumn[column.dindex + "_" + column.colIndex + "_" + column.rowIndex] = function (data) {
                if (data) {
                    return false;
                } else {
                    return {
                        panelName: column.panelName,
                        dindex: column.dindex,
                        rowIndex: column.rowIndex,
                        colIndex: column.colIndex,
                        colspan: column.colspan
                    };
                }
            }(self.selectedColumn[column.dindex + "_" + column.colIndex + "_" + column.rowIndex]);

            this.$.panel[column.panelName].find('[data-ax5grid-tr-data-index="' + column.dindex + '"]').find('[data-ax5grid-column-rowindex="' + column.rowIndex + '"][data-ax5grid-column-colindex="' + column.colIndex + '"]').attr('data-ax5grid-column-focused', "true").attr('data-ax5grid-column-selected', "true");
        },
        update: function update(column) {
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
                    self.$.panel[_column.panelName].find('[data-ax5grid-tr-data-index="' + _column.dindex + '"]').find('[data-ax5grid-column-rowindex="' + _column.rowIndex + '"][data-ax5grid-column-colindex="' + _column.colIndex + '"]').attr('data-ax5grid-column-selected', 'true');
                }
            }
        }
    };

    var columnSelector = {
        "on": function on(cell) {
            var self = this;
            columnSelect.init.call(self, cell);

            this.$["container"]["body"].on("mousemove.ax5grid-" + this.instanceId, '[data-ax5grid-column-attr="default"]', function () {
                if (this.getAttribute("data-ax5grid-column-rowIndex")) {
                    columnSelect.update.call(self, {
                        panelName: this.getAttribute("data-ax5grid-panel-name"),
                        dindex: Number(this.getAttribute("data-ax5grid-data-index")),
                        rowIndex: Number(this.getAttribute("data-ax5grid-column-rowIndex")),
                        colIndex: Number(this.getAttribute("data-ax5grid-column-colIndex")),
                        colspan: Number(this.getAttribute("colspan"))
                    });
                }
            }).on("mouseup.ax5grid-" + this.instanceId, function () {
                columnSelector.off.call(self);
            }).on("mouseleave.ax5grid-" + this.instanceId, function () {
                columnSelector.off.call(self);
            });

            jQuery(document.body).attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
        },
        "off": function off() {

            this.$["container"]["body"].off("mousemove.ax5grid-" + this.instanceId).off("mouseup.ax5grid-" + this.instanceId).off("mouseleave.ax5grid-" + this.instanceId);

            jQuery(document.body).removeAttr('unselectable').css('user-select', 'auto').off('selectstart');
        }
    };

    var updateRowState = function updateRowState(states, dindex, data) {
        var self = this;
        var cfg = this.config;

        var processor = {
            "selected": function selected(dindex) {
                var i = this.$.livePanelKeys.length;
                while (i--) {
                    this.$.panel[this.$.livePanelKeys[i]].find('[data-ax5grid-tr-data-index="' + dindex + '"]').attr("data-ax5grid-selected", this.list[dindex][cfg.columnKeys.selected]);
                }
            },
            "selectedClear": function selectedClear() {
                var si = this.selectedDataIndexs.length;
                while (si--) {
                    var dindex = this.selectedDataIndexs[si];
                    var i = this.$.livePanelKeys.length;
                    while (i--) {
                        this.$.panel[this.$.livePanelKeys[i]].find('[data-ax5grid-tr-data-index="' + dindex + '"]').attr("data-ax5grid-selected", false);
                        this.list[dindex][cfg.columnKeys.selected] = false;
                    }
                }
            }
        };
        states.forEach(function (state) {
            if (!processor[state]) throw 'invaild state name';
            processor[state].call(self, dindex, data);
        });
    };

    var init = function init() {
        var self = this;

        this.$["container"]["body"].on("click", '[data-ax5grid-column-attr]', function () {
            var panelName, attr, row, col, dindex, rowIndex, colIndex;
            var targetClick = {
                "default": function _default(_column) {
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
                "rowSelector": function rowSelector(_column) {
                    GRID.data.select.call(self, _column.dindex);
                    updateRowState.call(self, ["selected"], _column.dindex);
                },
                "lineNumber": function lineNumber(_column) {}
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
        this.$["container"]["body"].on("mousedown", '[data-ax5grid-column-attr="default"]', function (e) {
            if (this.getAttribute("data-ax5grid-column-rowIndex")) {
                columnSelector.on.call(self, {
                    panelName: this.getAttribute("data-ax5grid-panel-name"),
                    dindex: Number(this.getAttribute("data-ax5grid-data-index")),
                    rowIndex: Number(this.getAttribute("data-ax5grid-column-rowIndex")),
                    colIndex: Number(this.getAttribute("data-ax5grid-column-colIndex")),
                    colspan: Number(this.getAttribute("colspan"))
                });
            }
        }).on("dragstart", function (e) {
            U.stopEvent(e);
            return false;
        });
    };

    var repaint = function repaint(_reset) {
        var cfg = this.config;
        var list = this.list;
        if (_reset) {
            this.xvar.paintStartRowIndex = undefined;
        }
        var paintStartRowIndex = Math.floor(Math.abs(this.$.panel["body-scroll"].position().top) / this.xvar.bodyTrHeight) + this.xvar.frozenRowIndex;
        if (this.xvar.dataRowCount === list.length && this.xvar.paintStartRowIndex === paintStartRowIndex) return this; // 스크롤 포지션 변경 여부에 따라 프로세스 진행여부 결정
        var isFirstPaint = typeof this.xvar.paintStartRowIndex === "undefined";
        var dividedBodyRowObj = GRID.util.divideTableByFrozenColumnIndex(this.bodyRowTable, this.xvar.frozenColumnIndex);
        var asideBodyRowData = this.asideBodyRowData = function (dataTable) {
            var data = { rows: [] };
            for (var i = 0, l = dataTable.rows.length; i < l; i++) {
                data.rows[i] = { cols: [] };
                if (i === 0) {
                    var col = {
                        label: "",
                        colspan: 1,
                        rowspan: dataTable.rows.length,
                        colIndex: null
                    },
                        _col = {};

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
        }.call(this, this.bodyRowTable);
        var leftBodyRowData = this.leftBodyRowData = dividedBodyRowObj.leftData;
        var bodyRowData = this.bodyRowData = dividedBodyRowObj.rightData;
        var paintRowCount = Math.ceil(this.$.panel["body"].height() / this.xvar.bodyTrHeight) + 1;
        this.xvar.scrollContentHeight = this.xvar.bodyTrHeight * (this.list.length - this.xvar.frozenRowIndex);
        this.$.livePanelKeys = [];

        // body-scroll 의 포지션에 의존적이므로..
        var repaintBody = function repaintBody(_elTargetKey, _colGroup, _bodyRow, _list, _scrollConfig) {
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
            var col, cellHeight;
            var isScrolled = function () {
                // repaint 함수가 스크롤되는지 여부
                if (typeof _scrollConfig === "undefined" || typeof _scrollConfig['paintStartRowIndex'] === "undefined") {
                    _scrollConfig = {
                        paintStartRowIndex: 0,
                        paintRowCount: _list.length
                    };
                    return false;
                } else {
                    return true;
                }
            }();
            var getFieldValue = function getFieldValue(_list, _index, _key, _formatter) {
                if (_key === "__d-index__") {
                    return _index + 1;
                } else if (_key === "__d-checkbox__") {
                    return '<div class="checkBox"></div>';
                } else {
                    if (_formatter) {
                        var that = {
                            key: _key,
                            value: _list[_key],
                            item: _list,
                            index: _index,
                            list: list
                        };
                        if (U.isFunction(_formatter)) {
                            return _formatter.call(that);
                        } else {
                            return GRID.formatter[_formatter].call(that);
                        }
                    } else {
                        return _list[_key] || "&nbsp;";
                    }
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
                len = _list.length;
                if (_scrollConfig.paintRowCount + _scrollConfig.paintStartRowIndex < len) {
                    len = _scrollConfig.paintRowCount + _scrollConfig.paintStartRowIndex;
                }
                return len;
            }(); di < dl; di++) {
                for (tri = 0, trl = _bodyRow.rows.length; tri < trl; tri++) {

                    SS.push('<tr class="tr-' + di % 4 + '" data-ax5grid-tr-data-index="' + di + '" data-ax5grid-selected="' + (_list[di][cfg.columnKeys.selected] || "false") + '">');
                    for (ci = 0, cl = _bodyRow.rows[tri].cols.length; ci < cl; ci++) {
                        col = _bodyRow.rows[tri].cols[ci];
                        cellHeight = cfg.body.columnHeight * col.rowspan - cfg.body.columnBorderWidth;

                        SS.push('<td ', 'data-ax5grid-panel-name="' + _elTargetKey + '" ', 'data-ax5grid-data-index="' + di + '" ', 'data-ax5grid-column-row="' + tri + '" ', 'data-ax5grid-column-col="' + ci + '" ', 'data-ax5grid-column-rowIndex="' + col.rowIndex + '" ', 'data-ax5grid-column-colIndex="' + col.colIndex + '" ', 'data-ax5grid-column-attr="' + (col.columnAttr || "default") + '" ', function (_focusedColumn, _selectedColumn) {
                            var attrs = "";
                            if (_focusedColumn) {
                                attrs += 'data-ax5grid-column-focused="true" ';
                            }
                            if (_selectedColumn) {
                                attrs += 'data-ax5grid-column-selected="true" ';
                            }
                            return attrs;
                        }(this.focusedColumn[di + "_" + col.colIndex + "_" + col.rowIndex], this.selectedColumn[di + "_" + col.colIndex + "_" + col.rowIndex]), 'colspan="' + col.colspan + '" ', 'rowspan="' + col.rowspan + '" ', 'class="' + function (_col) {
                            var tdCSS_class = "";
                            if (_col.styleClass) {
                                if (U.isFunction(_col.styleClass)) {
                                    tdCSS_class += _col.styleClass.call({
                                        column: _col,
                                        key: _col.key,
                                        item: _list[di],
                                        index: di
                                    }) + " ";
                                } else {
                                    tdCSS_class += _col.styleClass + " ";
                                }
                            }
                            if (cfg.body.columnBorderWidth) tdCSS_class += "hasBorder ";
                            if (ci == cl - 1) tdCSS_class += "isLastColumn ";
                            return tdCSS_class;
                        }.call(this, col) + '" ', 'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                        SS.push(function () {
                            var lineHeight = cfg.body.columnHeight - cfg.body.columnPadding * 2 - cfg.body.columnBorderWidth;
                            if (col.multiLine) {
                                return '<span data-ax5grid-cellHolder="multiLine" style="height:' + cellHeight + 'px;line-height: ' + lineHeight + 'px;">';
                            } else {
                                return '<span data-ax5grid-cellHolder="" style="height: ' + (cfg.body.columnHeight - cfg.body.columnBorderWidth) + 'px;line-height: ' + lineHeight + 'px;">';
                            }
                        }(), getFieldValue.call(this, _list[di], di, col.key, col.formatter), '</span>');

                        SS.push('</td>');
                    }
                    SS.push('<td ', 'data-ax5grid-column-row="null" ', 'data-ax5grid-column-col="null" ', 'data-ax5grid-data-index="' + di + '" ', 'data-ax5grid-column-attr="' + "default" + '" ', 'style="height: ' + cfg.body.columnHeight + 'px;min-height: 1px;" ', '></td>');
                    SS.push('</tr>');
                }
            }
            SS.push('</table>');

            if (isScrolled) {
                _elTarget.css({ paddingTop: (_scrollConfig.paintStartRowIndex - this.xvar.frozenRowIndex) * _scrollConfig.bodyTrHeight });
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
                repaintBody.call(this, "top-aside-body", this.asideColGroup, asideBodyRowData, list.slice(0, this.xvar.frozenRowIndex));
            }

            repaintBody.call(this, "aside-body-scroll", this.asideColGroup, asideBodyRowData, list, scrollConfig);

            if (cfg.footSum) {
                // 바닥 합계
                repaintBody.call(this, "bottom-aside-body", this.asideColGroup, asideBodyRowData, list);
            }
        }

        // left
        if (this.xvar.frozenColumnIndex > 0) {
            if (this.xvar.frozenRowIndex > 0) {
                // 상단 행고정
                repaintBody.call(this, "top-left-body", this.leftHeaderColGroup, leftBodyRowData, list.slice(0, this.xvar.frozenRowIndex));
            }
            repaintBody.call(this, "left-body-scroll", this.leftHeaderColGroup, leftBodyRowData, list, scrollConfig);

            if (cfg.footSum) {}
        }

        // body
        if (this.xvar.frozenRowIndex > 0) {
            // 상단 행고정
            repaintBody.call(this, "top-body-scroll", this.headerColGroup, bodyRowData, list.slice(0, this.xvar.frozenRowIndex));
        }
        repaintBody.call(this, "body-scroll", this.headerColGroup, bodyRowData, list, scrollConfig);
        if (cfg.footSum) {}

        // right
        if (cfg.rightSum) {
            // todo : right 표현 정리
        }

        this.xvar.paintStartRowIndex = paintStartRowIndex;
        this.xvar.paintRowCount = paintRowCount;
        this.xvar.dataRowCount = list.length;

        GRID.page.statusUpdate.call(this);
    };

    var scrollTo = function scrollTo(css, noRepaint) {
        var cfg = this.config;

        if (cfg.asidePanelWidth > 0 && "top" in css) {
            this.$.panel["aside-body-scroll"].css({ top: css.top });
        }
        if (this.xvar.frozenColumnIndex > 0 && "top" in css) {
            this.$.panel["left-body-scroll"].css({ top: css.top });
        }
        if (this.xvar.frozenRowIndex > 0 && "left" in css) {
            this.$.panel["top-body-scroll"].css({ left: css.left });
        }
        this.$.panel["body-scroll"].css(css);

        if (!noRepaint && "top" in css) {
            repaint.call(this);
        }
    };

    var blur = function blur() {
        columnSelect.focusClear.call(this);
        columnSelect.clear.call(this);
    };

    var moveFocus = function moveFocus(_position) {
        var focus = {
            "UD": function UD(_dy) {
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
                        if (focusedColumn.dindex > this.list.length - 1) focusedColumn.dindex = this.list.length - 1;
                    } else {
                        focusedColumn.rowIndex = focusedColumn.rowIndex + _dy;
                    }
                } else {
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
                    if (focusedColumn.rowIndex == 0 || while_i % 2 == (_dy > 0 ? 0 : 1)) {
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

                focusedColumn.panelName = function () {
                    var _panels = [],
                        panelName = "";

                    if (this.xvar.frozenRowIndex > focusedColumn.dindex) _panels.push("top");
                    if (this.xvar.frozenColumnIndex > focusedColumn.colIndex) _panels.push("left");
                    _panels.push("body");
                    if (_panels[0] !== "top") _panels.push("scroll");
                    panelName = _panels.join("-");

                    return panelName;
                }.call(this);

                // 포커스 컬럼의 위치에 따라 스크롤 처리.
                (function () {
                    if (focusedColumn.dindex + 1 > this.xvar.frozenRowIndex) {
                        if (focusedColumn.dindex < this.xvar.paintStartRowIndex) {
                            scrollTo.call(this, { top: -(focusedColumn.dindex - this.xvar.frozenRowIndex) * this.xvar.bodyTrHeight });
                            GRID.scroller.resize.call(this);
                        } else if (focusedColumn.dindex + 1 > this.xvar.paintStartRowIndex + (this.xvar.paintRowCount - 2)) {
                            scrollTo.call(this, { top: -(focusedColumn.dindex - this.xvar.frozenRowIndex - this.xvar.paintRowCount + 3) * this.xvar.bodyTrHeight });
                            GRID.scroller.resize.call(this);
                        }
                    }
                }).call(this);

                this.focusedColumn[focusedColumn.dindex + "_" + focusedColumn.rowIndex + "_" + focusedColumn.colIndex] = focusedColumn;
                this.$.panel[focusedColumn.panelName].find('[data-ax5grid-tr-data-index="' + focusedColumn.dindex + '"]').find('[data-ax5grid-column-rowindex="' + focusedColumn.rowIndex + '"][data-ax5grid-column-colindex="' + focusedColumn.colIndex + '"]').attr('data-ax5grid-column-focused', "true");
            },
            "LR": function LR(_dx) {

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

                focusedColumn.panelName = function () {
                    var _panels = [],
                        panelName = "";

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
                }.call(this);

                // 포커스 컬럼의 위치에 따라 스크롤 처리.
                (function () {}).call(this);

                this.focusedColumn[focusedColumn.dindex + "_" + focusedColumn.rowIndex + "_" + focusedColumn.colIndex] = focusedColumn;

                var $column = this.$.panel[focusedColumn.panelName].find('[data-ax5grid-tr-data-index="' + focusedColumn.dindex + '"]').find('[data-ax5grid-column-rowindex="' + focusedColumn.rowIndex + '"][data-ax5grid-column-colindex="' + focusedColumn.colIndex + '"]').attr('data-ax5grid-column-focused', "true");

                if (isScrollPanel) {
                    // 스크롤 패널 이라면~
                    var newLeft = function () {
                        if ($column.position().left + $column.outerWidth() > Math.abs(this.$.panel[focusedColumn.panelName].position().left) + this.$.panel[containerPanelName].width()) {
                            return $column.position().left + $column.outerWidth() - this.$.panel[containerPanelName].width();
                        } else if (Math.abs(this.$.panel[focusedColumn.panelName].position().left) > $column.position().left) {
                            return $column.position().left;
                        } else {
                            return;
                        }
                    }.call(this);

                    //console.log(newLeft);

                    if (typeof newLeft !== "undefined") {
                        GRID.header.scrollTo.call(this, { left: -newLeft });
                        scrollTo.call(this, { left: -newLeft });
                        GRID.scroller.resize.call(this);
                    }
                }
            },
            "INDEX": function INDEX(_dindex) {

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
                    };
                }
                originalColumn = this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex];

                columnSelect.focusClear.call(this);
                columnSelect.clear.call(this);

                if (_dindex == "end") {
                    _dindex = this.list.length - 1;
                }

                focusedColumn.dindex = _dindex;
                focusedColumn.rowIndex = 0;

                while_i = 0;
                while (typeof this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex] === "undefined") {
                    if (focusedColumn.rowIndex == 0 || while_i % 2 == (_dy > 0 ? 0 : 1)) {
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

                focusedColumn.panelName = function () {
                    var _panels = [],
                        panelName = "";

                    if (this.xvar.frozenRowIndex > focusedColumn.dindex) _panels.push("top");
                    if (this.xvar.frozenColumnIndex > focusedColumn.colIndex) _panels.push("left");
                    _panels.push("body");
                    if (_panels[0] !== "top") _panels.push("scroll");
                    panelName = _panels.join("-");

                    return panelName;
                }.call(this);

                // 포커스 컬럼의 위치에 따라 스크롤 처리.
                (function () {
                    if (focusedColumn.dindex + 1 > this.xvar.frozenRowIndex) {
                        if (focusedColumn.dindex < this.xvar.paintStartRowIndex) {
                            scrollTo.call(this, { top: -(focusedColumn.dindex - this.xvar.frozenRowIndex) * this.xvar.bodyTrHeight });
                            GRID.scroller.resize.call(this);
                        } else if (focusedColumn.dindex + 1 > this.xvar.paintStartRowIndex + (this.xvar.paintRowCount - 2)) {
                            scrollTo.call(this, { top: -(focusedColumn.dindex - this.xvar.frozenRowIndex - this.xvar.paintRowCount + 3) * this.xvar.bodyTrHeight });
                            GRID.scroller.resize.call(this);
                        }
                    }
                }).call(this);

                this.focusedColumn[focusedColumn.dindex + "_" + focusedColumn.rowIndex + "_" + focusedColumn.colIndex] = focusedColumn;
                this.$.panel[focusedColumn.panelName].find('[data-ax5grid-tr-data-index="' + focusedColumn.dindex + '"]').find('[data-ax5grid-column-rowindex="' + focusedColumn.rowIndex + '"][data-ax5grid-column-colindex="' + focusedColumn.colIndex + '"]').attr('data-ax5grid-column-focused', "true");
            }
        };
        var processor = {
            "UP": function UP() {
                focus["UD"].call(this, -1);
            },
            "DOWN": function DOWN() {
                focus["UD"].call(this, 1);
            },
            "LEFT": function LEFT() {
                focus["LR"].call(this, -1);
            },
            "RIGHT": function RIGHT() {
                focus["LR"].call(this, 1);
            },
            "HOME": function HOME() {
                focus["INDEX"].call(this, 0);
            },
            "END": function END() {
                focus["INDEX"].call(this, "end");
            },
            "position": function position(_position) {
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

// ax5.ui.grid.collector
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;
    var sum = function sum() {
        //return U.number(this.value, {"money":true});
    };
    var avg = function avg() {
        //return U.number(this.value, {"money":true});
    };

    GRID.collector = {
        sum: sum,
        avg: avg
    };
})();
// ax5.ui.grid.layout
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var init = function init() {};

    var set = function set(data) {
        var self = this;
        var initData = function initData(_list) {
            // selected 데이터 초기화
            self.selectedDataIndexs = [];
            var i = 0,
                l = _list.length;
            var returnList = [];
            for (; i < l; i++) {
                if (_list[i][self.config.columnKeys.selected]) {
                    self.selectedDataIndexs.push(i);
                }
                returnList.push(jQuery.extend({}, _list[i]));
            }
            return returnList;
        };

        if (U.isArray(data)) {
            this.page = null;
            this.list = initData(data);
        } else if ("page" in data) {
            this.page = jQuery.extend({}, data.page);
            this.list = initData(data.list);
        }

        this.xvar.frozenRowIndex = this.config.frozenRowIndex > this.list.length ? this.list.length : this.config.frozenRowIndex;
        this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        GRID.page.navigationUpdate.call(this);
        return this;
    };

    var get = function get() {};

    var add = function add(_row, _dindex) {
        var processor = {
            "first": function first() {
                this.list = [].concat(_row).concat(this.list);
            },
            "last": function last() {
                this.list = this.list.concat([].concat(_row));
            }
        };

        if (typeof _dindex === "undefined") _dindex = "last";
        if (_dindex in processor) {
            processor[_dindex].call(this, _row);
        } else {
            if (!U.isNumber(_dindex)) {
                throw 'invalid argument _dindex';
            }
            //
            this.list.splice(_dindex, [].concat(_row));
        }

        this.xvar.frozenRowIndex = this.config.frozenRowIndex > this.list.length ? this.list.length : this.config.frozenRowIndex;
        this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        GRID.page.navigationUpdate.call(this);
        return this;
    };

    var remove = function remove(_dindex) {
        var processor = {
            "first": function first() {
                this.list.splice(_dindex, 1);
            },
            "last": function last() {
                this.list.splice(this.list.length - 1, 1);
            }
        };

        if (typeof _dindex === "undefined") _dindex = "last";
        if (_dindex in processor) {
            processor[_dindex].call(this, _dindex);
        } else {
            if (!U.isNumber(_dindex)) {
                throw 'invalid argument _dindex';
            }
            //
            this.list.splice(_dindex, 1);
        }

        this.xvar.frozenRowIndex = this.config.frozenRowIndex > this.list.length ? this.list.length : this.config.frozenRowIndex;
        this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        GRID.page.navigationUpdate.call(this);
        return this;
    };

    var update = function update(_row, _dindex) {
        if (!U.isNumber(_dindex)) {
            throw 'invalid argument _dindex';
        }
        //
        this.list.splice(_dindex, 1, _row);
    };

    var setValue = function setValue() {};

    var clearSelect = function clearSelect() {
        this.selectedDataIndexs = [];
    };

    var select = function select(_dindex, _selected) {
        var cfg = this.config;
        if (typeof _selected === "undefined") {
            if (this.list[_dindex][cfg.columnKeys.selected] = !this.list[_dindex][cfg.columnKeys.selected]) {
                this.selectedDataIndexs.push(_dindex);
            }
        } else {
            if (this.list[_dindex][cfg.columnKeys.selected] = _selected) {
                this.selectedDataIndexs.push(_dindex);
            }
        }
        return this.list[_dindex][cfg.columnKeys.selected];
    };

    var sort = function sort(_sortInfo) {
        var self = this;
        var sortInfoArray = [];

        for (var k in _sortInfo) {
            sortInfoArray[_sortInfo[k].seq] = { key: k, order: _sortInfo[k].orderBy };
        }
        sortInfoArray = U.filter(sortInfoArray, function () {
            return typeof this !== "undefined";
        });

        var i = 0,
            l = sortInfoArray.length,
            _a_val,
            _b_val;

        this.list.sort(function (_a, _b) {
            i = 0;
            for (; i < l; i++) {
                _a_val = _a[sortInfoArray[i].key];
                _b_val = _b[sortInfoArray[i].key];
                if ((typeof _a_val === "undefined" ? "undefined" : _typeof(_a_val)) !== (typeof _b_val === "undefined" ? "undefined" : _typeof(_b_val))) {
                    _a_val = '' + _a_val;
                    _b_val = '' + _b_val;
                }

                if (_a_val < _b_val) {
                    return sortInfoArray[i].order === "asc" ? -1 : 1;
                } else if (_a_val > _b_val) {
                    return sortInfoArray[i].order === "asc" ? 1 : -1;
                }
            }
        });

        this.xvar.frozenRowIndex = this.config.frozenRowIndex > this.list.length ? this.list.length : this.config.frozenRowIndex;
        this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        GRID.page.navigationUpdate.call(this);
        return this;
    };

    GRID.data = {
        init: init,
        set: set,
        get: get,
        setValue: setValue,
        clearSelect: clearSelect,
        select: select,
        add: add,
        remove: remove,
        update: update,
        sort: sort
    };
})();
// ax5.ui.grid.formatter
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;
    var money = function money() {
        return U.number(this.value, { "money": true });
    };

    GRID.formatter = {
        money: money
    };
})();
// ax5.ui.grid.header
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var columnResizerEvent = {
        "on": function on(_columnResizer, _colIndex) {
            var self = this;
            var $columnResizer = $(_columnResizer);
            var columnResizerPositionLeft = $columnResizer.offset().left;
            var gridTargetOffsetLeft = self.$["container"]["root"].offset().left;
            self.xvar.columnResizerIndex = _colIndex;
            var resizeRange = {
                min: -self.colGroup[_colIndex]._width + 2,
                max: self.colGroup[_colIndex + 1] ? self.colGroup[_colIndex + 1]._width : self.$["container"]["root"].width() - 2
            };
            //console.log(resizeRange);

            jQuery(document.body).bind(GRID.util.ENM["mousemove"] + ".ax5grid-" + this.instanceId, function (e) {
                var mouseObj = GRID.util.getMousePosition(e);
                self.xvar.__da = mouseObj.clientX - self.xvar.mousePosition.clientX;

                if (resizeRange.min > self.xvar.__da) {
                    self.xvar.__da = resizeRange.min;
                } else if (resizeRange.max < self.xvar.__da) {
                    self.xvar.__da = resizeRange.max;
                }

                if (!self.xvar.columnResizerLived) {
                    self.$["resizer"]["horizontal"].addClass("live");
                }
                self.xvar.columnResizerLived = true;
                self.$["resizer"]["horizontal"].css({
                    left: columnResizerPositionLeft + self.xvar.__da - gridTargetOffsetLeft
                });
            }).bind(GRID.util.ENM["mouseup"] + ".ax5grid-" + this.instanceId, function (e) {
                columnResizerEvent.off.call(self);
                U.stopEvent(e);
            }).bind("mouseleave.ax5grid-" + this.instanceId, function (e) {
                columnResizerEvent.off.call(self);
                U.stopEvent(e);
            });

            jQuery(document.body).attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
        },
        "off": function off() {
            this.$["resizer"]["horizontal"].removeClass("live");
            this.xvar.columnResizerLived = false;
            this.setColumnWidth(this.colGroup[this.xvar.columnResizerIndex]._width + this.xvar.__da, this.xvar.columnResizerIndex);

            jQuery(document.body).unbind(GRID.util.ENM["mousemove"] + ".ax5grid-" + this.instanceId).unbind(GRID.util.ENM["mouseup"] + ".ax5grid-" + this.instanceId).unbind("mouseleave.ax5grid-" + this.instanceId);

            jQuery(document.body).removeAttr('unselectable').css('user-select', 'auto').off('selectstart');
        }
    };

    var init = function init() {
        // 헤더 초기화
        var self = this;

        this.$["container"]["header"].on("click", '[data-ax5grid-column-attr]', function (e) {
            var key = this.getAttribute("data-ax5grid-column-key");
            var colIndex = this.getAttribute("data-ax5grid-column-colindex");
            var rowIndex = this.getAttribute("data-ax5grid-column-rowindex");
            var col = self.colGroup[colIndex];
            if (key && col) {
                if (self.config.sortable || col.sortable) {
                    //console.log(col.sort, col.key);
                    toggleSort.call(self, col.key);
                }
            }
        });
        this.$["container"]["header"].on("mousedown", '[data-ax5grid-column-resizer]', function (e) {
            var colIndex = this.getAttribute("data-ax5grid-column-resizer");
            self.xvar.mousePosition = GRID.util.getMousePosition(e);
            columnResizerEvent.on.call(self, this, Number(colIndex));
            U.stopEvent(e);
        }).on("dragstart", function (e) {
            U.stopEvent(e);
            return false;
        });
    };

    var repaint = function repaint() {
        var cfg = this.config;
        var colGroup = this.colGroup;
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
        this.leftHeaderColGroup = colGroup.slice(0, this.config.frozenColumnIndex);
        this.headerColGroup = colGroup.slice(this.config.frozenColumnIndex);

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

                    SS.push('<td ', 'data-ax5grid-column-attr="' + (col.columnAttr || "default") + '" ', 'data-ax5grid-column-row="' + tri + '" ', 'data-ax5grid-column-col="' + ci + '" ', function () {
                        return typeof col.key !== "undefined" ? 'data-ax5grid-column-key="' + col.key + '" ' : '';
                    }(), 'data-ax5grid-column-colindex="' + col.colIndex + '" ', 'data-ax5grid-column-rowindex="' + col.rowIndex + '" ', 'colspan="' + col.colspan + '" ', 'rowspan="' + col.rowspan + '" ', 'class="' + function (_col) {
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
                    }.call(this, col) + '" ', 'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                    SS.push(function () {
                        var lineHeight = cfg.header.columnHeight - cfg.header.columnPadding * 2 - cfg.header.columnBorderWidth;
                        return '<span data-ax5grid-cellHolder="" style="height: ' + (cfg.header.columnHeight - cfg.header.columnBorderWidth) + 'px;line-height: ' + lineHeight + 'px;">';
                    }(), function () {
                        var _SS = "";
                        if (!U.isNothing(col.key) && !U.isNothing(col.colIndex) && cfg.sortable || col.sortable) {
                            _SS += '<span data-ax5grid-column-sort="' + col.colIndex + '" data-ax5grid-column-sort-order="' + (colGroup[col.colIndex].sort || "") + '" />';
                        }
                        return _SS;
                    }(), col.label || "&nbsp;", '</span>');

                    if (!U.isNothing(col.colIndex)) {
                        if (cfg.enableFilter) {

                            SS.push('<span data-ax5grid-column-filter="' + col.colIndex + '" data-ax5grid-column-filter-value=""  />');
                        }
                    }

                    SS.push('</td>');
                }
                SS.push('<td ', 'data-ax5grid-column-row="null" ', 'data-ax5grid-column-col="null" ', 'style="height: ' + cfg.header.columnHeight + 'px;min-height: 1px;" ', '></td>');
                SS.push('</tr>');
            }
            SS.push('</table>');
            _elTarget.html(SS.join(''));

            /// append column-resizer
            (function () {
                var resizerHeight = cfg.header.columnHeight * _bodyRow.rows.length - cfg.header.columnBorderWidth;
                var resizerLeft = 0;
                var AS = [];
                for (var cgi = 0, cgl = _colGroup.length; cgi < cgl; cgi++) {
                    var col = _colGroup[cgi];
                    if (!U.isNothing(col.colIndex)) {
                        //_colGroup[cgi]._width
                        resizerLeft += col._width;
                        AS.push('<div data-ax5grid-column-resizer="' + col.colIndex + '" style="height:' + resizerHeight + 'px;left: ' + (resizerLeft - 4) + 'px;"  />');
                    }
                }
                _elTarget.append(AS);
            }).call(this);

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
        return this;
    };

    var toggleSort = function toggleSort(_key) {
        var sortOrder = "";
        var sortInfo = {};
        var seq = 0;

        for (var i = 0, l = this.colGroup.length; i < l; i++) {
            if (this.colGroup[i].key == _key) {
                if (sortOrder == "") {
                    if (typeof this.colGroup[i].sort === "undefined") {
                        sortOrder = "desc";
                    } else if (this.colGroup[i].sort === "desc") {
                        sortOrder = "asc";
                    } else {
                        sortOrder = undefined;
                    }
                }
                this.colGroup[i].sort = sortOrder;
            } else if (!this.config.multiSort) {
                this.colGroup[i].sort = undefined;
            }

            if (typeof this.colGroup[i].sort !== "undefined") {
                if (!sortInfo[this.colGroup[i].key]) {
                    sortInfo[this.colGroup[i].key] = {
                        seq: seq++,
                        orderBy: this.colGroup[i].sort
                    };
                }
            }
        }

        this.sortInfo = sortInfo;
        this.setColumnSort();
        return this;
    };

    var applySortStatus = function applySortStatus(_sortInfo) {
        for (var i = 0, l = this.colGroup.length; i < l; i++) {
            for (var _key in _sortInfo) {
                if (this.colGroup[i].key == _key) {
                    this.colGroup[i].sort = _sortInfo[_key].orderBy;
                }
            }
        }
        return this;
    };

    GRID.header = {
        init: init,
        repaint: repaint,
        scrollTo: scrollTo,
        toggleSort: toggleSort,
        applySortStatus: applySortStatus
    };
})();
// ax5.ui.grid.page
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var onclickPageMove = function onclickPageMove(_act) {
        var callBack = function callBack(_pageNo) {
            if (this.page.currentPage != _pageNo) {
                this.page.selectPage = _pageNo;
                if (this.config.page.onChange) {
                    this.config.page.onChange.call({
                        self: this,
                        page: this.page,
                        data: this.data
                    });
                }
            }
        };
        var processor = {
            "first": function first() {
                callBack.call(this, 0);
            },
            "prev": function prev() {
                var pageNo = this.page.currentPage - 1;
                if (pageNo < 0) pageNo = 0;
                callBack.call(this, pageNo);
            },
            "next": function next() {
                var pageNo = this.page.currentPage + 1;
                if (pageNo > this.page.totalPages - 1) pageNo = this.page.totalPages - 1;
                callBack.call(this, pageNo);
            },
            "last": function last() {
                callBack.call(this, this.page.totalPages - 1);
            }
        };

        if (_act in processor) {
            processor[_act].call(this);
        } else {
            callBack.call(this, _act - 1);
        }
    };

    var navigationUpdate = function navigationUpdate() {
        var self = this;
        if (this.page) {
            var page = {
                currentPage: this.page.currentPage,
                pageSize: this.page.pageSize,
                totalElements: this.page.totalElements,
                totalPages: this.page.totalPages,
                firstIcon: this.config.page.firstIcon,
                prevIcon: this.config.page.prevIcon || "«",
                nextIcon: this.config.page.nextIcon || "»",
                lastIcon: this.config.page.lastIcon
            };
            var navigationItemCount = this.config.page.navigationItemCount;

            page["@paging"] = function () {
                var returns = [];

                var startI = page.currentPage - Math.floor(navigationItemCount / 2);
                if (startI < 0) startI = 0;
                var endI = page.currentPage + navigationItemCount;
                if (endI > page.totalPages) endI = page.totalPages;

                if (endI - startI > navigationItemCount) {
                    endI = startI + navigationItemCount;
                }

                if (endI - startI < navigationItemCount) {
                    startI = endI - navigationItemCount;
                }
                if (startI < 0) startI = 0;

                for (var p = startI, l = endI; p < l; p++) {
                    returns.push({ 'pageNo': p + 1, 'selected': page.currentPage == p });
                }
                return returns;
            }();

            this.$["page"]["navigation"].html(GRID.tmpl.get("page_navigation", page));
            this.$["page"]["navigation"].find("[data-ax5grid-page-move]").on("click", function () {
                var act = this.getAttribute("data-ax5grid-page-move");
                onclickPageMove.call(self, act);
            });
        } else {
            this.$["page"]["navigation"].empty();
        }
    };

    var statusUpdate = function statusUpdate() {
        var fromRowIndex = this.xvar.paintStartRowIndex;
        var toRowIndex = this.xvar.paintStartRowIndex + this.xvar.paintRowCount - 1;
        //var totalElements = (this.page && this.page.totalElements) ? this.page.totalElements : this.xvar.dataRowCount;
        var totalElements = this.xvar.dataRowCount;
        if (toRowIndex > totalElements) {
            toRowIndex = totalElements;
        }

        this.$["page"]["status"].html(GRID.tmpl.get("page_status", {
            fromRowIndex: U.number(fromRowIndex + 1, { "money": true }),
            toRowIndex: U.number(toRowIndex, { "money": true }),
            totalElements: U.number(totalElements, { "money": true })
        }));
    };

    GRID.page = {
        navigationUpdate: navigationUpdate,
        statusUpdate: statusUpdate
    };
})();
// ax5.ui.grid.scroller
(function () {

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

                GRID.body.scrollTo.call(this, scrollPositon);
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
                GRID.body.scrollTo.call(this, scrollPositon);
            }

            return -left;
        }
    };
    var scrollBarMover = {
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
            GRID.body.scrollTo.call(self, scrollPositon);
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
                GRID.body.scrollTo.call(self, scrollPositon);
            }).bind(GRID.util.ENM["mouseup"] + ".ax5grid-" + this.instanceId, function (e) {
                scrollBarMover.off.call(self);
            }).bind("mouseleave.ax5grid-" + this.instanceId, function (e) {
                scrollBarMover.off.call(self);
            });

            jQuery(document.body).attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
        },
        "off": function off() {
            jQuery(document.body).unbind(GRID.util.ENM["mousemove"] + ".ax5grid-" + this.instanceId).unbind(GRID.util.ENM["mouseup"] + ".ax5grid-" + this.instanceId).unbind("mouseleave.ax5grid-" + this.instanceId);

            jQuery(document.body).removeAttr('unselectable').css('user-select', 'auto').off('selectstart');
        }
    };
    var scrollContentMover = {
        "wheel": function wheel(delta) {
            var self = this,
                _body_scroll_position = self.$["panel"]["body-scroll"].position(),
                _panel_height = self.$["panel"]["body"].height(),
                _panel_width = self.$["panel"]["body"].width(),
                _content_height = self.xvar.scrollContentHeight,
                _content_width = self.xvar.scrollContentWidth;

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
        },
        "on": function on() {
            var self = this,
                _body_scroll_position = self.$["panel"]["body-scroll"].position(),
                _panel_height = self.$["panel"]["body"].height(),
                _panel_width = self.$["panel"]["body"].width(),
                _content_height = self.xvar.scrollContentHeight,
                _content_width = self.xvar.scrollContentWidth,
                getContentPosition = function getContentPosition(e) {
                var mouseObj = GRID.util.getMousePosition(e);
                var newLeft, newTop;

                self.xvar.__x_da = mouseObj.clientX - self.xvar.mousePosition.clientX;
                self.xvar.__y_da = mouseObj.clientY - self.xvar.mousePosition.clientY;

                newLeft = _body_scroll_position.left + self.xvar.__x_da;
                newTop = _body_scroll_position.top + self.xvar.__y_da;

                // newTop이 범위를 넘었는지 체크
                if (newTop >= 0) {
                    newTop = 0;
                } else if (newTop <= _panel_height - _content_height) {
                    newTop = _panel_height - _content_height;
                    if (newTop >= 0) newTop = 0;
                }

                // newLeft이 범위를 넘었는지 체크
                if (newLeft >= 0) {
                    newLeft = 0;
                } else if (newLeft <= _panel_width - _content_width) {
                    newLeft = _panel_width - _content_width;
                    if (newLeft >= 0) newLeft = 0;
                }

                return {
                    left: newLeft, top: newTop
                };
            };

            this.xvar.__x_da = 0; // 이동량 변수 초기화 (계산이 잘못 될까바)
            this.xvar.__y_da = 0; // 이동량 변수 초기화 (계산이 잘못 될까바)

            jQuery(document.body).bind("touchmove" + ".ax5grid-" + this.instanceId, function (e) {
                var css = getContentPosition(e);
                GRID.header.scrollTo.call(self, { left: css.left });
                GRID.body.scrollTo.call(self, css, "noRepaint");
                resize.call(self);
                U.stopEvent(e);
            }).bind("touchend" + ".ax5grid-" + this.instanceId, function (e) {
                var css = getContentPosition(e);
                GRID.header.scrollTo.call(self, { left: css.left });
                GRID.body.scrollTo.call(self, css);
                resize.call(self);
                U.stopEvent(e);
                scrollContentMover.off.call(self);
            });

            jQuery(document.body).attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
        },
        "off": function off() {

            jQuery(document.body).unbind("touchmove" + ".ax5grid-" + this.instanceId).unbind("touchend" + ".ax5grid-" + this.instanceId);

            jQuery(document.body).removeAttr('unselectable').css('user-select', 'auto').off('selectstart');
        }
    };

    var init = function init() {
        var self = this;
        //this.config.scroller.size
        var margin = 4;

        this.$["scroller"]["vertical-bar"].css({ width: this.config.scroller.size - (margin + 1), left: margin / 2 });
        this.$["scroller"]["horizontal-bar"].css({ height: this.config.scroller.size - (margin + 1), top: margin / 2 });

        this.$["scroller"]["vertical-bar"].bind(GRID.util.ENM["mousedown"], function (e) {
            this.xvar.mousePosition = GRID.util.getMousePosition(e);
            scrollBarMover.on.call(this, this.$["scroller"]["vertical"], this.$["scroller"]["vertical-bar"], "vertical");
        }.bind(this)).bind("dragstart", function (e) {
            U.stopEvent(e);
            return false;
        });
        this.$["scroller"]["vertical"].bind("click", function (e) {
            if (e.target && e.target.getAttribute("data-ax5grid-scroller") == "vertical") {
                scrollBarMover.click.call(this, this.$["scroller"]["vertical"], this.$["scroller"]["vertical-bar"], "vertical", e);
            }
        }.bind(this));

        this.$["scroller"]["horizontal-bar"].bind(GRID.util.ENM["mousedown"], function (e) {
            this.xvar.mousePosition = GRID.util.getMousePosition(e);
            scrollBarMover.on.call(this, this.$["scroller"]["horizontal"], this.$["scroller"]["horizontal-bar"], "horizontal");
        }.bind(this)).bind("dragstart", function (e) {
            U.stopEvent(e);
            return false;
        });
        this.$["scroller"]["horizontal"].bind("click", function (e) {
            if (e.target && e.target.getAttribute("data-ax5grid-scroller") == "horizontal") {
                scrollBarMover.click.call(this, this.$["scroller"]["horizontal"], this.$["scroller"]["horizontal-bar"], "horizontal", e);
            }
        }.bind(this));

        this.$["container"]["body"].bind('mousewheel DOMMouseScroll', function (e) {
            var E = e.originalEvent;
            var delta = { x: 0, y: 0 };
            if (E.detail) {
                delta.y = E.detail * 10;
            } else {
                if (typeof E.deltaY === "undefined") {
                    delta.y = -E.wheelDelta;
                    delta.x = 0;
                } else {
                    delta.y = E.deltaY;
                    delta.x = E.deltaX;
                }
            }

            if (scrollContentMover.wheel.call(this, delta)) {
                U.stopEvent(e);
            }
        }.bind(this));

        if (document.addEventListener && ax5.info.supportTouch) {
            this.$["container"]["body"].on("touchstart", '[data-ax5grid-panel]', function (e) {
                self.xvar.mousePosition = GRID.util.getMousePosition(e);
                scrollContentMover.on.call(self);
            });
        }
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
// ax5.ui.grid.tmpl
(function () {

    var GRID = ax5.ui.grid;
    var main = "<div data-ax5grid-container=\"root\" data-ax5grid-instance=\"{{instanceId}}\">\n            <div data-ax5grid-container=\"hidden\">\n                <textarea data-ax5grid-form=\"clipboard\"></textarea>\n            </div>\n            <div data-ax5grid-container=\"header\">\n                <div data-ax5grid-panel=\"aside-header\"></div>\n                <div data-ax5grid-panel=\"left-header\"></div>\n                <div data-ax5grid-panel=\"header\">\n                    <div data-ax5grid-panel-scroll=\"header\"></div>\n                </div>\n                <div data-ax5grid-panel=\"right-header\"></div>\n            </div>\n            <div data-ax5grid-container=\"body\">\n                <div data-ax5grid-panel=\"top-aside-body\"></div>\n                <div data-ax5grid-panel=\"top-left-body\"></div>\n                <div data-ax5grid-panel=\"top-body\">\n                    <div data-ax5grid-panel-scroll=\"top-body\"></div>\n                </div>\n                <div data-ax5grid-panel=\"top-right-body\"></div>\n                <div data-ax5grid-panel=\"aside-body\">\n                    <div data-ax5grid-panel-scroll=\"aside-body\"></div>\n                </div>\n                <div data-ax5grid-panel=\"left-body\">\n                    <div data-ax5grid-panel-scroll=\"left-body\"></div>\n                </div>\n                <div data-ax5grid-panel=\"body\">\n                    <div data-ax5grid-panel-scroll=\"body\"></div>\n                </div>\n                <div data-ax5grid-panel=\"right-body\">\n                  <div data-ax5grid-panel-scroll=\"right-body\"></div>\n                </div>\n                <div data-ax5grid-panel=\"bottom-aside-body\"></div>\n                <div data-ax5grid-panel=\"bottom-left-body\"></div>\n                <div data-ax5grid-panel=\"bottom-body\">\n                    <div data-ax5grid-panel-scroll=\"bottom-body\"></div>\n                </div>\n                <div data-ax5grid-panel=\"bottom-right-body\"></div>\n            </div>\n            <div data-ax5grid-container=\"page\">\n                <div data-ax5grid-page=\"holder\">\n                    <div data-ax5grid-page=\"navigation\"></div>\n                    <div data-ax5grid-page=\"status\"></div>\n                </div>\n            </div>\n            <div data-ax5grid-container=\"scroller\">\n                <div data-ax5grid-scroller=\"vertical\">\n                    <div data-ax5grid-scroller=\"vertical-bar\"></div>    \n                </div>\n                <div data-ax5grid-scroller=\"horizontal\">\n                    <div data-ax5grid-scroller=\"horizontal-bar\"></div>\n                </div>\n                <div data-ax5grid-scroller=\"corner\"></div>\n            </div>\n            <div data-ax5grid-resizer=\"vertical\"></div>\n            <div data-ax5grid-resizer=\"horizontal\"></div>\n        </div>";

    var page_navigation = "<div data-ax5grid-page-navigation=\"holder\">\n            <div data-ax5grid-page-navigation=\"cell\">    \n                {{#firstIcon}}<button data-ax5grid-page-move=\"first\">{{{firstIcon}}}</button>{{/firstIcon}}\n                <button data-ax5grid-page-move=\"prev\">{{{prevIcon}}}</button>\n            </div>\n            <div data-ax5grid-page-navigation=\"cell-paging\">\n                {{#@paging}}\n                <button data-ax5grid-page-move=\"{{pageNo}}\" data-ax5grid-page-selected=\"{{selected}}\">{{pageNo}}</button>\n                {{/@paging}}\n            </div>\n            <div data-ax5grid-page-navigation=\"cell\">\n                <button data-ax5grid-page-move=\"next\">{{{nextIcon}}}</button>\n                {{#lastIcon}}<button data-ax5grid-page-move=\"last\">{{{lastIcon}}}</button>{{/lastIcon}}\n            </div>\n        </div>";

    var page_status = "<span>{{fromRowIndex}} - {{toRowIndex}} of {{totalElements}}</span>";

    GRID.tmpl = {
        "main": main,
        "page_navigation": page_navigation,
        "page_status": page_status,

        get: function get(tmplName, data) {
            return ax5.mustache.render(GRID.tmpl[tmplName], data);
        }
    };
})();
// ax5.ui.grid.util
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;

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
        var mouseObj,
            originalEvent = e.originalEvent ? e.originalEvent : e;
        mouseObj = 'changedTouches' in originalEvent ? originalEvent.changedTouches[0] : originalEvent;
        // clientX, Y 쓰면 스크롤에서 문제 발생
        return {
            clientX: mouseObj.pageX,
            clientY: mouseObj.pageY
        };
    };

    var ENM = {
        "mousedown": ax5.info.supportTouch ? "touchstart" : "mousedown",
        "mousemove": ax5.info.supportTouch ? "touchmove" : "mousemove",
        "mouseup": ax5.info.supportTouch ? "touchend" : "mouseup"
    };

    var makeHeaderTable = function makeHeaderTable(columns) {
        var columns = U.deepCopy(columns);
        var cfg = this.config;
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

        // set rowspan
        for (var r = 0, rl = table.rows.length; r < rl; r++) {
            for (var c = 0, cl = table.rows[r].cols.length; c < cl; c++) {
                if (!('columns' in table.rows[r].cols[c])) {
                    table.rows[r].cols[c].rowspan = rl - r;
                }
            }
        }

        return table;
    };

    var makeBodyRowTable = function makeBodyRowTable(columns) {
        var columns = U.deepCopy(columns);
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

        (function (table) {
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
        })(table);

        return table;
    };

    var makeBodyRowMap = function makeBodyRowMap(table) {
        var map = {};
        table.rows.forEach(function (row) {
            row.cols.forEach(function (col) {
                map[col.rowIndex + "_" + col.colIndex] = jQuery.extend({}, col);
            });
        });
        return map;
    };

    var makeFootSumTable = function makeFootSumTable(footSum) {
        var table = {
            rows: []
        };
        var colIndex = 0;

        return table;
    };

    GRID.util = {
        divideTableByFrozenColumnIndex: divideTableByFrozenColumnIndex,
        getMousePosition: getMousePosition,
        ENM: ENM,
        makeHeaderTable: makeHeaderTable,
        makeBodyRowTable: makeBodyRowTable,
        makeBodyRowMap: makeBodyRowMap,
        makeFootSumTable: makeFootSumTable
    };
})();