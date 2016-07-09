"use strict";

// ax5.ui.grid
(function (root, _SUPER_) {

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
            title: '',
            animateTime: 250
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
            this.$target.html(root.grid.tmpl.get("main", data));

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
            this.columns = jQuery.extend({}, columns);
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

            // columns의 데이터로 header데이터를 만들고 header를 출력합니다.
            root.grid.header.init.call(this);
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

    root.grid = function () {
        if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
        return axClass;
    }(); // ax5.ui에 연결
})(ax5.ui, ax5.ui.root);

/*
 * Copyright (c) 2016. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

// ax5.ui.grid.body
(function (root) {
    "use strict";

    var init = function init() {};

    root.body = {
        init: init
    };
})(ax5.ui.grid);

/*
 * Copyright (c) 2016. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

// ax5.ui.grid.layout
(function (root) {
    "use strict";

    root.data = {};
})(ax5.ui.grid);

/*
 * Copyright (c) 2016. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

// ax5.ui.grid.header
(function (root) {
    "use strict";

    var init = function init() {
        console.log(this.columns);
    };

    root.header = {
        init: init
    };
})(ax5.ui.grid);

/*
 * Copyright (c) 2016. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

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

    var main = "\n        <div data-ax5grid-container=\"root\" data-ax5grid-instance=\"{{instanceId}}\">\n            <div data-ax5grid-container=\"header\">\n                <div data-ax5grid-panel=\"aside-header\"></div>\n                <div data-ax5grid-panel=\"left-header\"></div>\n                <div data-ax5grid-panel=\"header\"></div>\n                <div data-ax5grid-panel=\"right-header\"></div>\n            </div>\n            <div data-ax5grid-container=\"body\">\n                <div data-ax5grid-panel=\"top-aside-body\"></div>\n                <div data-ax5grid-panel=\"top-left-body\"></div>\n                <div data-ax5grid-panel=\"top-body\"></div>\n                <div data-ax5grid-panel=\"top-right-body\"></div>\n                <div data-ax5grid-panel=\"aside-body\"></div>\n                <div data-ax5grid-panel=\"left-body\"></div>\n                <div data-ax5grid-panel=\"body\"></div>\n                <div data-ax5grid-panel=\"right-body\"></div>\n                <div data-ax5grid-panel=\"bottom-aside-body\"></div>\n                <div data-ax5grid-panel=\"bottom-left-body\"></div>\n                <div data-ax5grid-panel=\"bottom-body\"></div>\n                <div data-ax5grid-panel=\"bottom-right-body\"></div>\n            </div>\n        </div>\n    ";

    var header = "";

    var body = "";

    root.tmpl = {
        main: main,
        header: header,
        body: body,
        get: function get(tmplName, data) {
            return ax5.mustache.render(root.tmpl[tmplName], data);
        }
    };
})(ax5.ui.grid);