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
            height: 400,
            columnMinWidth: 100
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

            console.log(this.colGroup);

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

            // columns의 데이터로 body데이터를 만들고
            modules.body.init.call(this);
            // body를 출력합니다.
            modules.body.repaint.call(this);
        };

        /**
         * align grid size
         * @method ax5grid.align
         * @returns {ax5grid}
         */
        this.align = function () {

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
        var dividedBodyRowObj = root.util.divideTableByFrozenColumnIndex(this.bodyRowTable, this.config.frozenColumnIndex);
        var leftBodyRowData = this.leftBodyRowData = dividedBodyRowObj.leftData;
        var bodyRowData = this.bodyRowData = dividedBodyRowObj.rightData;

        var data = this.data;
        // todo : 현재 화면에 출력된 범위를 연산하여 data를 결정.

        var SS = [];
        SS.push('<table border="0" cellpadding="0" cellspacing="0">');
        SS.push('<colgroup>');
        for (var cgi = 0, cgl = this.headerColGroup.length; cgi < cgl; cgi++) {
            SS.push('<col style="width:' + this.headerColGroup[cgi]._realWidth + ';"  />');
        }
        SS.push('</colgroup>');

        for (var di = 0, dl = data.length; di < dl; di++) {
            for (var tri = 0, trl = bodyRowData.rows.length; tri < trl; tri++) {
                SS.push('<tr>');
                for (var ci = 0, cl = bodyRowData.rows[tri].cols.length; ci < cl; ci++) {
                    var col = bodyRowData.rows[tri].cols[ci];
                    SS.push('<td colspan="' + col.colspan + '" rowspan="' + col.rowspan + '">');
                    SS.push(data[di][col.key] || "&nbsp;");
                    SS.push('</td>');
                }
                SS.push('</tr>');
            }
        }
        SS.push('</table>');

        this.$.panel["body"].html(SS.join(''));
    };

    var repaintByTmpl = function repaintByTmpl() {
        var dividedBodyRowObj = root.util.divideTableByFrozenColumnIndex(this.bodyRowTable, this.config.frozenColumnIndex);
        var leftBodyRowData = this.leftBodyRowData = dividedBodyRowObj.leftData;
        var bodyRowData = this.bodyRowData = dividedBodyRowObj.rightData;

        var data = this.data;
        // todo : 현재 화면에 출력된 범위를 연산하여 data를 결정.

        var getCols = function getCols() {
            var ci = this.cols.length;
            while (ci--) {
                this.cols[ci]['@dataIndex'] = this['@dataIndex'];
            }
            return this.cols;
        };
        var getColumnValue = function getColumnValue() {
            return {
                value: data[this['@dataIndex']][this.key] || "&nbsp;"
            };
        };

        if (this.config.frozenColumnIndex > 0) {
            this.$.panel["left-body"].html(root.tmpl.get("body", {
                list: data,
                '@rows': function rows() {
                    var ri = leftBodyRowData.rows.length;
                    while (ri--) {
                        leftBodyRowData.rows[ri]['@dataIndex'] = this['@i'];
                    }
                    return leftBodyRowData.rows;
                },
                '@cols': getCols,
                '@columnValue': getColumnValue
            }));
        }

        this.$.panel["body"].html(root.tmpl.get("body", {
            list: data,
            '@rows': function rows() {
                var ri = bodyRowData.rows.length;
                while (ri--) {
                    bodyRowData.rows[ri]['@dataIndex'] = this['@i'];
                }
                return bodyRowData.rows;
            },
            '@cols': getCols,
            '@columnValue': getColumnValue
        }));
    };

    var setData = function setData() {};

    root.body = {
        init: init,
        repaint: repaint,
        repaintByTmpl: repaintByTmpl,
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

        var dividedHeaderObj = root.util.divideTableByFrozenColumnIndex(this.headerTable, this.config.frozenColumnIndex);
        this.leftHeaderData = dividedHeaderObj.leftData;
        this.headerData = dividedHeaderObj.rightData;

        this.leftHeaderColGroup = this.colGroup.slice(0, this.config.frozenColumnIndex);
        this.headerColGroup = this.colGroup.slice(this.config.frozenColumnIndex);

        var getColWidth = function getColWidth() {
            if (ax5.util.isNumber(this.width)) {
                this._realWidth = this.width + "px";
                return this._realWidth;
            } else {
                this._realWidth = undefined;
                return "";
            }
        };

        if (this.config.frozenColumnIndex > 0) {
            this.$.panel["left-header"].html(root.tmpl.get("header", {
                '@getColWidth': getColWidth,
                colGroup: this.leftHeaderColGroup,
                table: this.leftHeaderData
            }));
        }

        this.$.panel["header"].html(root.tmpl.get("header", {
            '@getColWidth': getColWidth,
            colGroup: this.headerColGroup,
            table: this.headerData
        }));

        if (this.config.rowSum) {
            this.$.panel["right-header"].html(root.tmpl.get("header", {
                '@getColWidth': getColWidth,
                table: this.rightHeaderData
            }));
        }
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

    var main = "<div data-ax5grid-container=\"root\" data-ax5grid-instance=\"{{instanceId}}\">\n            <div data-ax5grid-container=\"header\">\n                <div data-ax5grid-panel=\"aside-header\"></div>\n                <div data-ax5grid-panel=\"left-header\"></div>\n                <div data-ax5grid-panel=\"header\"></div>\n                <div data-ax5grid-panel=\"right-header\"></div>\n            </div>\n            <div data-ax5grid-container=\"body\">\n                <div data-ax5grid-panel=\"top-aside-body\"></div>\n                <div data-ax5grid-panel=\"top-left-body\"></div>\n                <div data-ax5grid-panel=\"top-body\"></div>\n                <div data-ax5grid-panel=\"top-right-body\"></div>\n                <div data-ax5grid-panel=\"aside-body\"></div>\n                <div data-ax5grid-panel=\"left-body\"></div>\n                <div data-ax5grid-panel=\"body\"></div>\n                <div data-ax5grid-panel=\"right-body\"></div>\n                <div data-ax5grid-panel=\"bottom-aside-body\"></div>\n                <div data-ax5grid-panel=\"bottom-left-body\"></div>\n                <div data-ax5grid-panel=\"bottom-body\"></div>\n                <div data-ax5grid-panel=\"bottom-right-body\"></div>\n            </div>\n        </div>";

    var header = "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n            <colgroup>\n            {{#colGroup}}<col style=\"width:{{@getColWidth}};\" />{{/colGroup}}\n            </colgroup>\n            {{#table.rows}}\n            <tr class=\"first\">\n                {{#cols}}\n                <td colspan=\"{{colspan}}\" rowspan=\"{{rowspan}}\">{{{label}}}</td>\n                {{/cols}}\n            </tr>\n            {{/table.rows}}\n        </table>\n        ";

    root.tmpl = {
        "main": main,
        "header": header,

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