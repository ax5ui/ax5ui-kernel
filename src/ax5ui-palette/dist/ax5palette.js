"use strict";

// ax5.ui.palette
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var PALETTE = void 0;

    UI.addClass({
        className: "palette"
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
                colors: {
                    preview: {
                        width: 24,
                        height: 24,
                        cellWidth: 30
                    },
                    label: {
                        width: 80
                    },
                    slider: {
                        trackHeight: 8,
                        amount: 30,
                        handleWidth: 18,
                        handleHeight: 18
                    },
                    list: [{ label: "red", value: "#ff0000" }, { label: "orange", value: "#ff9802" }, { label: "yellow", value: "#ffff00" }, { label: "green", value: "#00ff36" }, { label: "blue", value: "#0000ff" }, { label: "purple", value: "#ba00ff" },
                    //{label: "skyblue", value: "#84e4ff"},
                    //{label: "pink", value: "#ff77c4"},
                    { label: "black", value: "#000000" }, { label: "white", value: "#ffffff" }]
                },
                controls: {
                    height: 30
                },
                columnKeys: {}
            };
            this.xvar = {};
            this.colors = [];

            cfg = this.config;

            var onStateChanged = function onStateChanged(opts, that) {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                } else if (_this.onStateChanged) {
                    _this.onStateChanged.call(that, that);
                }

                that = null;
            };

            /**
             * get mouse position
             * @param e
             * @returns {{clientX, clientY}}
             */
            var getMousePosition = function getMousePosition(e) {
                var mouseObj = void 0,
                    originalEvent = e.originalEvent ? e.originalEvent : e;
                mouseObj = 'changedTouches' in originalEvent && originalEvent.changedTouches ? originalEvent.changedTouches[0] : originalEvent;
                // clientX, Y 쓰면 스크롤에서 문제 발생
                return {
                    clientX: mouseObj.pageX,
                    clientY: mouseObj.pageY
                };
            };

            var alignHandle = function alignHandle(item) {};

            var handleMoveEvent = {
                "on": function on() {
                    jQuery(document.body).on("mousemove.ax5palette-" + _this.instanceId, function (e) {
                        var mouseObj = getMousePosition(e),
                            da_grow = void 0;

                        mouseObj = null;
                        da_grow = null;
                    }).on("mouseup.ax5palette-" + _this.instanceId, function (e) {
                        handleMoveEvent.off();
                        U.stopEvent(e);
                    }).on("mouseleave.ax5palette-" + _this.instanceId, function (e) {
                        handleMoveEvent.off();
                        U.stopEvent(e);
                    });

                    jQuery(document.body).attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
                },
                "off": function off() {
                    self.xvar.resizerLived = false;

                    jQuery(document.body).off("mousemove.ax5palette-" + _this.instanceId).off("mouseup.ax5palette-" + _this.instanceId).off("mouseleave.ax5palette-" + _this.instanceId);

                    jQuery(document.body).removeAttr('unselectable').css('user-select', 'auto').off('selectstart');
                }
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

                //this.$["colors"].css({height: box.height - cfg.controls.height});
                //this.xvar.colorHeight = (box.height - cfg.controls.height) / cfg.colors.length;

                _this.$["controls"].css({ height: cfg.controls.height });

                /// colors.list 색상 범위 결정
                cfg.colors.list.forEach(function (c) {
                    var _color = U.color(c.value);
                    c._amount = 0;
                    if (_color.r == 0 && _color.g == 0 && _color.b == 0) {
                        c._color0value = "#" + _color.lighten(cfg.colors.slider.amount * 2).getHexValue();
                        c._color1value = "#" + _color.lighten(cfg.colors.slider.amount).getHexValue();
                        c._color2value = "#" + _color.getHexValue();
                    } else {
                        c._color0value = "#" + _color.lighten(cfg.colors.slider.amount).getHexValue();
                        c._color1value = "#" + _color.getHexValue();
                        c._color2value = "#" + _color.darken(cfg.colors.slider.amount).getHexValue();
                    }
                });

                cfg.colors.slider.handleLeft = -cfg.colors.slider.handleWidth / 2;
                cfg.colors.slider.handleTop = -cfg.colors.slider.handleHeight / 2;

                // 팔렛트 컬러 패널 초기화
                _this.$["colors"].html(PALETTE.tmpl.get("colors", cfg, cfg.columnKeys));

                _this.$["colors"].find('[data-ax5palette-color-index]').each(function () {
                    var idx = this.getAttribute("data-ax5palette-color-index");
                    var color = cfg.colors.list[idx];
                    var item = jQuery.extend({}, color);
                    item.$item = jQuery(this);
                    alignHandle(item);
                    /////
                    self.colors.push(item);
                });

                _this.$["colors"].off("mousedown").on("mousedown", '[data-panel="color-handle"]', function (e) {
                    console.log(e.target);
                });
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
        return "\n{{#colors}}\n{{#list}}\n<div data-ax5palette-color=\"{{label}}\" data-ax5palette-color-index=\"{{@i}}\">\n    <div data-panel=\"color-preview\" style=\"padding:{{preview.cellPadding}}px;width:{{preview.cellWidth}}px;\">\n        <div data-panel=\"color-box\" style=\"width:{{preview.width}}px;height:{{preview.height}}px;\"><div data-panel=\"color\" style=\"background-color:{{value}};\"></div></div>\n    </div>\n    <div data-panel=\"color-label\" style=\"width:{{label.width}}px;\">{{label}}</div>\n    <div data-panel=\"color-slider\">\n        <div data-panel=\"color-track\" style=\"height:{{slider.trackHeight}}px;background: linear-gradient(90deg, {{_color0value}}, {{_color1value}}, {{_color2value}}); \">\n            <div data-panel=\"color-handle\">\n                <div data-panel=\"color-handle-after\" style=\"width:{{slider.handleWidth}}px;height:{{slider.handleWidth}}px;left:{{slider.handleLeft}}px;top:{{slider.handleLeft}}px;\"></div>\n            </div>\n        </div>\n    </div>\n</div>\n{{/list}}\n{{/colors}}\n";
    };

    PALETTE.tmpl = {
        "frame": tmpl_frame,
        "colors": tmpl_colors,

        get: function get(tmplName, data, columnKeys) {
            return ax5.mustache.render(PALETTE.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();