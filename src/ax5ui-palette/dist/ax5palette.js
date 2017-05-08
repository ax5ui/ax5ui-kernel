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
                        amount: 32,
                        handleWidth: 18,
                        handleHeight: 18
                    },
                    list: [{ label: "red", value: "#ff0000" }, { label: "orange", value: "#ff9802" }, { label: "yellow", value: "#ffff00" }, { label: "green", value: "#00ff36" }, { label: "blue", value: "#0000ff" }, { label: "purple", value: "#ba00ff" },
                    //{label: "skyblue", value: "#84e4ff"},
                    //{label: "pink", value: "#ff77c4"},
                    { label: "black", value: "#000000" }, { label: "white", value: "#ffffff" }]
                },
                controls: {
                    height: 0
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

            var bindHandle = function bindHandle(item) {
                item.originalTrackWidth = item.$track.width();
                item.trackWidth = item.originalTrackWidth - cfg.colors.slider.handleWidth / 5;
                var handleLeft = item._amount * (item.trackWidth / 2) / cfg.colors.slider.amount + item.trackWidth / 2;
                item.$handle.css({ left: handleLeft });
                item.$item.off("mousedown").on("mousedown", '[data-panel="color-handle"]', function (e) {
                    var mouseObj = getMousePosition(e);
                    item._originalHandleClientX = mouseObj.clientX;
                    item._originalHandleLeft = item.$handle.position().left;
                    handleMoveEvent.on(item);
                }).off("click").on("click", '[data-panel="color-label"], [data-panel="color-preview"]', function (e) {
                    //jQuery(this).parent().attr();
                    if (self.onClick) {
                        self.onClick.call(item, '#' + item._selectedColor.toUpperCase());
                    }
                });
            };

            var updatePreviewColor = function updatePreviewColor(item, color) {
                //console.log(color);
                item.$preview.css({ "background-color": '#' + color });
                item.$label.html('#' + color.toUpperCase());
                item._selectedColor = color;

                if (self.onUpdateColor) {
                    self.onUpdateColor.call(item, '#' + item._selectedColor.toUpperCase());
                }
            };

            var amountToColor = function amountToColor(item, amount) {
                var processor = {
                    "black": function black(_color, _amount) {
                        return _color.lighten(cfg.colors.slider.amount / 2).darken(_amount).getHexValue();
                    },
                    "white": function white(_color, _amount) {
                        return _color.darken(cfg.colors.slider.amount / 2).darken(_amount).getHexValue();
                    },
                    "normal": function normal(_color, _amount) {
                        return _color.darken(_amount).getHexValue();
                    }
                };

                if (item._uniqColor in processor) {
                    return processor[item._uniqColor](item._color, amount);
                } else {
                    return processor["normal"](item._color, amount);
                }
            };

            var colorToAmount = function colorToAmount(item, color) {
                /// todo : 색상에 가까운 색 표현.
                var processor = {
                    "black": function black(_color, _diffColor) {
                        //return _color.lighten(cfg.colors.slider.amount / 2).darken(_amount).getHexValue();
                    },
                    "white": function white(_color, _diffColor) {
                        //return _color.darken(cfg.colors.slider.amount / 2).darken(_amount).getHexValue();
                    },
                    "normal": function normal(_color, _diffColor) {
                        //return _color.darken(_amount).getHexValue();
                    }
                };

                if (item._uniqColor in processor) {
                    return processor[item._uniqColor](item._color, color);
                } else {
                    return processor["normal"](item._color, color);
                }
            };

            var handleMoveEvent = {
                "on": function on(item) {
                    jQuery(document.body).on("mousemove.ax5palette-" + _this.instanceId, function (e) {
                        var mouseObj = getMousePosition(e),
                            da = mouseObj.clientX - item._originalHandleClientX,
                            newHandleLeft = item._originalHandleLeft + da,
                            amount = void 0;

                        newHandleLeft = newHandleLeft < 0 ? 0 : newHandleLeft > item.trackWidth ? item.trackWidth : newHandleLeft;
                        item.$handle.css({ left: newHandleLeft });
                        amount = cfg.colors.slider.amount * (newHandleLeft - item.originalTrackWidth / 2) / (item.trackWidth / 2);

                        updatePreviewColor(item, amountToColor(item, amount));

                        mouseObj = null;
                        da = null;
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
                    c._color = U.color(c.value);
                    c._selectedColor = c._color.getHexValue();
                    if (c._color.r == 0 && c._color.g == 0 && c._color.b == 0) {
                        c._amount = cfg.colors.slider.amount;
                        c._uniqColor = "black";
                        c._color0value = "#" + c._color.lighten(cfg.colors.slider.amount).getHexValue();
                        c._color1value = "#" + c._color.lighten(cfg.colors.slider.amount / 2).getHexValue();
                        c._color2value = "#" + c._color.getHexValue();
                    } else if (c._color.r == 255 && c._color.g == 255 && c._color.b == 255) {
                        c._amount = -cfg.colors.slider.amount;
                        c._uniqColor = "white";
                        c._color0value = "#" + c._color.getHexValue();
                        c._color1value = "#" + c._color.darken(cfg.colors.slider.amount / 2).getHexValue();
                        c._color2value = "#" + c._color.darken(cfg.colors.slider.amount).getHexValue();
                    } else {
                        c._amount = 0;
                        c._color0value = "#" + c._color.lighten(cfg.colors.slider.amount).getHexValue();
                        c._color1value = "#" + c._color.getHexValue();
                        c._color2value = "#" + c._color.darken(cfg.colors.slider.amount).getHexValue();
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
                    item._index = idx;
                    item.$item = jQuery(this);
                    item.$preview = item.$item.find('[data-panel="color"]');
                    item.$label = item.$item.find('[data-panel="color-label"]');
                    item.$track = item.$item.find('[data-panel="color-track"]');
                    item.$handle = item.$item.find('[data-panel="color-handle"]');
                    bindHandle(item);
                    /////
                    self.colors.push(item);
                });

                //console.log(box);
            };

            /**
             * Preferences of palette UI
             * @method ax5palette.setConfig
             * @param {Object} config
             * @param {Element} config.target
             * @param {Object} [config.colors]
             * @param {Object} [config.colors.preview]
             * @param {Number} [config.colors.preview.width=24]
             * @param {Number} [config.colors.preview.height=24]
             * @param {Number} [config.colors.preview.cellWidth=30]
             * @param {Object} [config.colors.label]
             * @param {Number} [config.colors.label.width=80]
             * @param {Object} [config.colors.slider]
             * @param {Number} [config.colors.slider.trackHeight=8]
             * @param {Number} [config.colors.slider.amount=32]
             * @param {Number} [config.colors.slider.handleWidth=18]
             * @param {Number} [config.colors.slider.handleHeight=18]
             * @param {Object[]} [config.colors.list=[red,orange,yellow,green,blue,purple,black,white]]
             * @param {String} config.colors.list[].label
             * @param {String} config.colors.list[].value
             * @param {Object} [config.controls]
             * @param {Number} [config.controls.height=0]
             * @returns {ax5palette}
             * @example
             * ```js
             * myPalette = new ax5.ui.palette({
             *  target: $('[data-ax5palette="01"]'),
             *  onClick: function (hexColor) {
             *      alert(hexColor);
             *  }
             * });
             *
             * myPalette = new ax5.ui.palette({
             *  target: $('[data-ax5palette="01"]'),
             *  colors: {
             *      list: [
             *          {label: "red", value: "#ff0000"},
             *          {label: "orange", value: "#ff9802"},
             *          {label: "yellow", value: "#ffff00"},
             *          {label: "skyblue", value: "#84e4ff"},
             *          {label: "white", value: "#ffffff"}
             *      ]
             *  }
             *  onClick: function (hexColor) {
             *  }
             * });
             * ```
             */
            //== class body start
            this.init = function () {
                // after setConfig();
                this.onStateChanged = cfg.onStateChanged;
                this.onClick = cfg.onClick;
                this.onUpdateColor = cfg.onUpdateColor;

                if (!cfg.target) {
                    console.log(ax5.info.getError("ax5palette", "401", "setConfig"));
                }
                this.$target = jQuery(cfg.target);

                setTimeout(function () {
                    repaint(); // 팔렛트 그리기.
                });
            };

            this.repaint = function () {
                repaint();
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