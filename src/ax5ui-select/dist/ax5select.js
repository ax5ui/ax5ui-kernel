'use strict';

/*
 * Copyright (c) 2016. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

// ax5.ui.select
(function (root, _SUPER_) {

    /**
     * @class ax5.ui.select
     * @classdesc
     * @version 0.4.5
     * @author tom@axisj.com
     * @example
     * ```
     * var myselect = new ax5.ui.select();
     * ```
     */
    var U = ax5.util;

    //== UI Class
    var axClass = function axClass() {
        var self = this,
            cfg;

        if (_SUPER_) _SUPER_.call(this); // 부모호출

        this.queue = [];
        this.config = {
            clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
            theme: 'default',
            title: '',
            animateTime: 250
        };

        this.activeSelectOptionGroup = null;
        this.activeSelectQueueIndex = -1;
        this.openTimer = null;
        this.closeTimer = null;

        cfg = this.config;

        var onStateChanged = function onStateChanged(opts, that) {
            if (opts && opts.onStateChanged) {
                opts.onStateChanged.call(that, that);
            } else if (this.onStateChanged) {
                this.onStateChanged.call(that, that);
            }
            return true;
        },
            getOptionGroupTmpl = function getOptionGroupTmpl() {
            return '\n                <div class="ax5-ui-select-option-group {{theme}}" id="{{id}}">\n                    <div class="ax-select-body">\n                        <div class="ax-select-option-group-content" data-select-els="content" style="width:{{contentWidth}}px;"></div>\n                    </div>\n                    <div class="ax-select-arrow"></div>\n                </div>\n                ';
        },
            getTmpl = function getTmpl() {
            return '\n                <a class="form-control ax5-ui-select-display {{theme}}" id="{{id}}">\n                    <div class="ax5-ui-select-display-table">\n                        <div data-ax5-select-display="label">L</div>\n                        <div data-ax5-select-display="addon" data-ax5-select-opened="false">\n                            {{#icons}}\n                            <span class="addon-icon-closed">{{clesed}}</span>\n                            <span class="addon-icon-opened">{{opened}}</span>\n                            {{/icons}}\n                            {{^icons}}\n                            <span class="addon-icon-closed"><span class="addon-icon-arrow"></span></span>\n                            <span class="addon-icon-opened"><span class="addon-icon-arrow"></span></span>\n                            {{/icons}}\n                        </div>\n                    </div>\n                </a>\n                ';
        },
            alignSelectDisplay = function alignSelectDisplay() {
            var i = this.queue.length;
            while (i--) {
                if (this.queue[i].$display) {
                    this.queue[i].$display.css({
                        width: this.queue[i].select.outerWidth(),
                        height: this.queue[i].select.outerHeight()
                    });
                }
            }
            return this;
        },
            alignSelect = function alignSelect(append) {
            if (!this.activeSelect) return this;

            var opts = this.queue[this.activeSelectQueueIndex],
                pos = {},
                dim = {};

            if (append) jQuery(document.body).append(this.activeSelect);

            pos = opts.$target.offset();
            dim = {
                width: opts.$target.outerWidth(),
                height: opts.$target.outerHeight()
            };

            // picker css(width, left, top) & direction 결정
            if (!opts.direction || opts.direction === "" || opts.direction === "auto") {
                // set direction
                opts.direction = "top";
            }

            if (append) {
                this.activeSelect.addClass("direction-" + opts.direction);
            }
            this.activeSelect.css(function () {
                if (opts.direction == "top") {
                    return {
                        left: pos.left + dim.width / 2 - this.activeSelect.outerWidth() / 2,
                        top: pos.top + dim.height + 12
                    };
                } else if (opts.direction == "bottom") {
                    return {
                        left: pos.left + dim.width / 2 - this.activeSelect.outerWidth() / 2,
                        top: pos.top - this.activeSelect.outerHeight() - 12
                    };
                } else if (opts.direction == "left") {
                    return {
                        left: pos.left + dim.width + 12,
                        top: pos.top - dim.height / 2
                    };
                } else if (opts.direction == "right") {
                    return {
                        left: pos.left - this.activeSelect.outerWidth() - 12,
                        top: pos.top - dim.height / 2
                    };
                }
            }.call(this));
        },
            onBodyClick = function onBodyClick(e, target) {
            if (!this.activeSelect) return this;

            var opts = this.queue[this.activeSelectQueueIndex];

            target = U.findParentNode(e.target, function (target) {
                if (target.getAttribute("data-picker-els")) {
                    return true;
                } else if (opts.$target.get(0) == target) {
                    return true;
                }
            });
            if (!target) {
                //console.log("i'm not picker");
                this.close();
                return this;
            }
            //console.log("i'm picker");
            return this;
        },
            onBodyKeyup = function onBodyKeyup(e) {
            if (e.keyCode == ax5.info.eventKeys.ESC) {
                this.close();
            }
        },
            bindSelectTarget = function () {
            var selectEvent = {
                'click': function click(opts, optIdx, e) {
                    self.open(opts, optIdx);
                }
            };

            return function (opts, optIdx) {

                if (!opts.$display) {
                    opts.$display = jQuery(ax5.mustache.render(getTmpl.call(this, opts, optIdx), opts));
                    opts.$target.append(opts.$display);
                    alignSelectDisplay.call(this);

                    opts.$display.unbind('click.ax5select').bind('click.ax5select', selectEvent.click.bind(this, this.queue[optIdx], optIdx));
                }

                opts = null;
                optIdx = null;
                return this;
            };
        }();
        /// private end

        /**
         * Preferences of select UI
         * @method ax5.ui.select.setConfig
         * @param {Object} config - 클래스 속성값
         * @returns {ax5.ui.select}
         * @example
         * ```
         * ```
         */
        this.init = function () {
            this.onStateChanged = cfg.onStateChanged;
            jQuery(window).bind("resize.ax5select", function () {
                alignSelectDisplay.call(this);
            }.bind(this));
        };

        /**
         * bind select
         * @method ax5.ui.select.bind
         * @param {Object} opts
         * @param {String} [opts.id]
         * @param {Element} opts.target
         * @param {Object[]} opts.options
         * @returns {ax5.ui.select}
         */
        this.bind = function (opts) {
            var selectConfig = {},
                optIdx;

            opts = jQuery.extend(true, selectConfig, cfg, opts);
            if (!opts.target) {
                console.log(ax5.info.getError("ax5select", "401", "bind"));
                return this;
            }
            opts.$target = jQuery(opts.target);
            if (!opts.id) opts.id = opts.$target.data("ax5-select");
            if (!opts.id) {
                opts.id = 'ax5-select-' + ax5.getGuid();
                opts.$target.data("ax5-select", opts.id);
            }
            opts.select = opts.$target.find('select');
            optIdx = U.search(this.queue, function () {
                return this.id == opts.id;
            });

            if (optIdx === -1) {
                this.queue.push(opts);
                bindSelectTarget.call(this, opts, this.queue.length - 1);
            } else {
                jQuery.extend(true, this.queue[optIdx], opts);
                bindSelectTarget.call(this, this.queue[optIdx], optIdx);
            }

            selectConfig = null;
            optIdx = null;
            return this;
        };

        /**
         * open the optionBox of select
         * @method ax5.ui.select.open
         * @param {(Object|String)} opts
         * @param {Number} [optIdx]
         * @param {Number} [tryCount]
         * @returns {ax5.ui.select}
         */
        this.open = function () {

            var setSelectContent = {
                'sync': function sync() {}
            };

            return function (opts, optIdx, tryCount) {

                /**
                 * open select from the outside
                 */
                if (U.isString(opts) && typeof optIdx == "undefined") {
                    optIdx = ax5.util.search(this.queue, function () {
                        return this.id == opts;
                    });
                    opts = this.queue[optIdx];
                    if (optIdx == -1) {
                        console.log(ax5.info.getError("ax5select", "402", "open"));
                        return this;
                    }
                }

                /**
                 다른 피커가 있는 경우와 다른 피커를 닫고 다시 오픈 명령이 내려진 경우에 대한 예외 처리 구문
                 */
                if (this.openTimer) clearTimeout(this.openTimer);
                if (this.activeSelect) {
                    if (this.activeSelectQueueIndex == optIdx) {
                        return this;
                    }

                    if (tryCount > 2) return this;
                    this.close();
                    this.openTimer = setTimeout(function () {
                        this.open(opts, optIdx, (tryCount || 0) + 1);
                    }.bind(this), cfg.animateTime);
                    return this;
                }

                this.activeSelectOptionGroup = jQuery(ax5.mustache.render(getOptionGroupTmpl.call(this, opts, optIdx), opts));
                this.activeSelectQueueIndex = optIdx;
                opts.optionGroupContent = setSelectContent['sync'].call(this, opts, optIdx);

                alignSelect.call(this, "append");
                jQuery(window).bind("resize.ax5select", function () {
                    alignSelect.call(this);
                }.bind(this));

                // bind key event
                jQuery(window).bind("keyup.ax5select", function (e) {
                    e = e || window.event;
                    onBodyKeyup.call(this, e);
                    U.stopEvent(e);
                }.bind(this));

                jQuery(window).bind("click.ax5select", function (e) {
                    e = e || window.event;
                    onBodyClick.call(this, e);
                    U.stopEvent(e);
                }.bind(this));

                onStateChanged.call(this, opts, {
                    self: this,
                    state: "open",
                    boundObject: opts
                });

                return this;
            };
        }();

        /**
         * @method ax5.ui.select.update
         * @param {(Object|String)} opts
         * @returns {ax5.ui.select}
         */
        this.update = function () {

            return this;
        };

        /**
         * @method ax5.ui.select.close
         * @returns {ax5.ui.select}
         */
        this.close = function (opts) {
            if (this.closeTimer) clearTimeout(this.closeTimer);
            if (!this.activeSelect) return this;

            opts = this.queue[this.activeSelectQueueIndex];

            this.activeSelect.addClass("destroy");
            jQuery(window).unbind("resize.ax5select");
            jQuery(window).unbind("click.ax5select");
            jQuery(window).unbind("keyup.ax5select");

            this.closeTimer = setTimeout(function () {
                if (this.activeSelect) this.activeSelect.remove();
                this.activeSelect = null;
                this.activeSelectQueueIndex = -1;

                onStateChanged.call(this, opts, {
                    self: this,
                    state: "close"
                });
            }.bind(this), cfg.animateTime);

            return this;
        };

        // 클래스 생성자
        this.main = function () {
            if (arguments && U.isObject(arguments[0])) {
                this.setConfig(arguments[0]);
            } else {
                this.init();
            }
        }.apply(this, arguments);
    };
    //== UI Class

    root.select = function () {
        if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
        return axClass;
    }(); // ax5.ui에 연결
})(ax5.ui, ax5.ui.root);

ax5.ui.select_instance = new ax5.ui.select();

$.fn.ax5select = function () {
    return function (config) {
        if (typeof config == "undefined") config = {};
        $.each(this, function () {
            var defaultConfig = {
                target: this
            };
            config = $.extend(true, config, defaultConfig);
            ax5.ui.select_instance.bind(config);
        });
        return this;
    };
}();