"use strict";

// ax5.ui.palette
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var PALETTE = void 0;

    UI.addClass({
        className: "palette",
        version: "${VERSION}"
    }, function () {

        /**
         * @class ax5palette
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```js
         * ```
         */
        return function () {
            var _this = this;

            var self = this,
                cfg = void 0;

            this.instanceId = ax5.getGuid();
            this.target = null;

            this.config = {
                clickEventName: "click",
                theme: 'default',
                animateTime: 100,
                colors: [{ label: "red", value: "#ff0000" }, { label: "orange", value: "#ff9802" }, { label: "yellow", value: "#ffff00" }, { label: "green", value: "#00ff36" }, { label: "blue", value: "#0000ff" }, { label: "purple", value: "#ba00ff" }, { label: "skyblue", value: "#84e4ff" }, { label: "pink", value: "#ff77c4" }, { label: "black", value: "#000000" }, { label: "white", value: "#ffffff" }],
                columnKeys: {}
            };

            cfg = this.config;

            var onStateChanged = function onStateChanged(opts, that) {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                } else if (_this.onStateChanged) {
                    _this.onStateChanged.call(that, that);
                }

                that = null;
            };

            var repaint = function repaint() {
                var box = {
                    width: _this.$target.innerWidth(),
                    height: _this.$target.innerHeight()
                };

                // 패널 프레임 초기화
                _this.$target.html(PALETTE.tmpl.get("frame", {}, cfg.columnKeys));

                // 각 패널들을 캐싱~
                _this.$ = {
                    "root": _this.$target.find('[data-ax5palette-container="root"]'),
                    "colors": _this.$target.find('[data-ax5palette-container="colors"]'),
                    "controls": _this.$target.find('[data-ax5palette-container="controls"]')
                };

                // 팔렛트 컬러 패널 초기화
                _this.$["colors"].html(PALETTE.tmpl.get("colors", {
                    colors: cfg.colors
                }, cfg.columnKeys));

                //console.log(box);
            };

            /**
             * Preferences of palette UI
             * @method ax5palette.setConfig
             * @param {Object} config
             * @param {(Element||nodelist)} config.target
             * @returns {ax5palette}
             * @example
             * ```js
             * ```
             */
            //== class body start
            this.init = function () {
                // after setConfig();
                this.onStateChanged = cfg.onStateChanged;
                this.onClick = cfg.onClick;

                if (!cfg.target) {
                    console.log(ax5.info.getError("ax5palette", "401", "setConfig"));
                }
                this.$target = jQuery(cfg.target);

                repaint(); // 팔렛트 그리기.
            };

            // 클래스 생성자
            this.main = function () {

                UI.palette_instance = UI.palette_instance || [];
                UI.palette_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }.apply(this, arguments);
        };
    }());

    PALETTE = ax5.ui.palette;
})();
// ax5.ui.calendar.tmpl
(function () {

    var PALETTE = ax5.ui.palette;

    var tmpl_frame = function tmpl_frame(columnKeys) {
        return "\n<div data-ax5palette-container=\"root\">\n    <div data-ax5palette-container=\"colors\"></div>\n    <div data-ax5palette-container=\"controls\"></div>\n</div>\n";
    };

    var tmpl_colors = function tmpl_colors(columnKeys) {
        return "\n{{#colors}}\n<div data-ax5palette-color=\"{{label}}\">\n    <div data-panel=\"color-preview\" style=\"background:{{value}};\"></div>\n    <div data-panel=\"color-label\">{{label}}</div>\n    <div data-panel=\"color-slider\">\n        <div data-panel=\"color-track\">\n            <div data-panel=\"color-handle\"></div>\n        </div>\n    </div>\n</div>\n{{/colors}}\n";
    };

    PALETTE.tmpl = {
        "frame": tmpl_frame,
        "colors": tmpl_colors,

        get: function get(tmplName, data, columnKeys) {
            return ax5.mustache.render(PALETTE.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();