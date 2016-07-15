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
            frozenRowIndex: 0
        };

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
            this.$target.html(modules.tmpl.get("main", data));

            // 그리드 패널 프레임의 각 엘리먼트를 캐쉬합시다.
            this.$ = {
                "container": {
                    "header": this.$target.find('[data-ax5grid-container="header"]'),
                    "body": this.$target.find('[data-ax5grid-container="body"]')
                },
                "panel": {
                    "aside-header": this.$target.find('[data-ax5grid-panel="aside-header"]'),
                    "left-header": this.$target.find('[data-ax5grid-panel="left-header"]'),
                    "header": this.$target.find('[data-ax5grid-panel="header"]'),
                    "right-header": this.$target.find('[data-ax5grid-panel="right-header"]'),
                    "top-aside-body": this.$target.find('[data-ax5grid-panel="top-aside-body"]'),
                    "top-left-body": this.$target.find('[data-ax5grid-panel="top-left-body"]'),
                    "top-body": this.$target.find('[data-ax5grid-panel="top-body"]'),
                    "top-right-body": this.$target.find('[data-ax5grid-panel="rop-right-body"]'),
                    "aside-body": this.$target.find('[data-ax5grid-panel="aside-body"]'),
                    "left-body": this.$target.find('[data-ax5grid-panel="left-body"]'),
                    "body": this.$target.find('[data-ax5grid-panel="body"]'),
                    "right-body": this.$target.find('[data-ax5grid-panel="right-body"]'),
                    "bottom-aside-body": this.$target.find('[data-ax5grid-panel="bottom-aside-body"]'),
                    "bottom-left-body": this.$target.find('[data-ax5grid-panel="bottom-left-body"]'),
                    "bottom-body": this.$target.find('[data-ax5grid-panel="bottom-body"]'),
                    "bottom-right-body": this.$target.find('[data-ax5grid-panel="bottom-right-body"]')
                }
            };

            return this;
        },
            initColumns = function initColumns(columns) {
            this.columns = U.deepCopy(columns);
            return this;
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

            // columns의 데이터로 header데이터를 만들고
            modules.header.init.call(this);
            // header를 출력합니다.
            modules.header.repaint.call(this);
        };

        /**
         * align grid size
         * @method ax5grid.align
         * @returns {ax5grid}
         */
        this.align = function () {

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

    var init = function init() {};

    root.body = {
        init: init
    };
})(ax5.ui.grid);

// ax5.ui.grid.layout
(function (root) {
    "use strict";

    root.data = {};
})(ax5.ui.grid);
// ax5.ui.grid.header
(function (root) {
    "use strict";

    var init = function init() {
        // 헤더 초기화
        this.headerTable = {};
        this.leftHeaderData = {};
        this.headerData = {};
        this.rightHeaderData = {};

        // 컬럼의 __id값으로 빠르게 데이터를 접근하기 위한 map | 아직 구현전. 필요성 타진 후 맵 데이터를 생성하도록 합니다.
        // this.headerMap = {};
        this.headerTable = makeHeaderTable.call(this, this.columns);
    };

    var makeHeaderTable = function makeHeaderTable(columns) {
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
                    }
                    field.colspan = colspan;
                } else {
                    console.log("hh");
                }
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

    /**
     * @method ax5grid.header.divideHeader
     * @param headerTable
     * @param frozenColumnIndex
     * @returns {{leftHeaderData: {rows: Array}, headerData: {rows: Array}}}
     */
    var divideHeader = function divideHeader(headerTable, frozenColumnIndex) {
        var tempTable_l = { rows: [] };
        var tempTable_r = { rows: [] };
        for (var r = 0, rl = headerTable.rows.length; r < rl; r++) {
            var row = headerTable.rows[r];

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
            leftHeaderData: tempTable_l,
            headerData: tempTable_r
        };
    };

    var repaint = function repaint() {
        var dividedHeaderObj = divideHeader(this.headerTable, this.config.frozenColumnIndex);
        this.leftHeaderData = dividedHeaderObj.leftHeaderData;
        this.headerData = dividedHeaderObj.headerData;

        this.$.panel["left-header"].html(root.tmpl.get("left-header", {
            table: this.leftHeaderData
        }));
        this.$.panel["header"].html(root.tmpl.get("header", {
            table: this.headerData
        }));
        this.$.panel["right-header"].html(root.tmpl.get("right-header", {
            table: this.rightHeaderData
        }));
    };

    root.header = {
        init: init,
        divideHeader: divideHeader,
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

    var main = "<div data-ax5grid-container=\"root\" data-ax5grid-instance=\"{{instanceId}}\">\n            <div data-ax5grid-container=\"header\">\n                <div data-ax5grid-panel=\"aside-header\"></div>\n                <div data-ax5grid-panel=\"left-header\"></div>\n                <div data-ax5grid-panel=\"header\"></div>\n                <div data-ax5grid-panel=\"right-header\"></div>\n            </div>\n            <div data-ax5grid-container=\"body\">\n                <div data-ax5grid-panel=\"top-aside-body\"></div>\n                <div data-ax5grid-panel=\"top-left-body\"></div>\n                <div data-ax5grid-panel=\"top-body\"></div>\n                <div data-ax5grid-panel=\"top-right-body\"></div>\n                <div data-ax5grid-panel=\"aside-body\"></div>\n                <div data-ax5grid-panel=\"left-body\"></div>\n                <div data-ax5grid-panel=\"body\"></div>\n                <div data-ax5grid-panel=\"right-body\"></div>\n                <div data-ax5grid-panel=\"bottom-aside-body\"></div>\n                <div data-ax5grid-panel=\"bottom-left-body\"></div>\n                <div data-ax5grid-panel=\"bottom-body\"></div>\n                <div data-ax5grid-panel=\"bottom-right-body\"></div>\n            </div>\n        </div>";

    var header = "<table border=\"1\" style=\"\">\n            {{#table.rows}}\n            <tr>\n                {{#cols}}\n                <td colspan=\"{{colspan}}\" rowspan=\"{{rowspan}}\">{{{label}}}</td>\n                {{/cols}}\n            </tr>\n            {{/table.rows}}\n        </table>\n        ";

    var leftHeader = "<table border=\"1\" style=\"\">\n            {{#table.rows}}\n            <tr>\n                {{#cols}}\n                <td colspan=\"{{colspan}}\" rowspan=\"{{rowspan}}\">{{{label}}}</td>\n                {{/cols}}\n            </tr>\n            {{/table.rows}}\n        </table>\n        ";

    var rightHeader = "";

    var body = "";

    root.tmpl = {
        "main": main,
        "header": header,
        "left-header": leftHeader,
        "right-header": rightHeader,
        "body": body,
        get: function get(tmplName, data) {
            return ax5.mustache.render(root.tmpl[tmplName], data);
        }
    };
})(ax5.ui.grid);