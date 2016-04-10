'use strict';

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

        this.activeSelect = null;
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
            onClick = function onClick() {},
            bindSelectTarget = function () {
            var selectEvent = {
                'click': function click(opts, optIdx, e) {
                    self.open(opts, optIdx);
                }
            };

            return function (opts, optIdx) {
                var _select;

                if (!opts.content) {
                    console.log(ax5.info.getError("ax5select", "501", "bind"));
                    return this;
                }

                _select = opts.target.tagName.toUpperCase() == "INPUT" ? opts.$target : opts.$target.find('input[type="text"]');
                _select.unbind('click.ax5picker').bind('click.ax5picker', selectEvent.click.bind(this, this.queue[optIdx], optIdx));

                _select = null;
                opts = null;
                optIdx = null;
                return this;
            };
        }(),
            getTmpl = function getTmpl(opts, optIdx) {
            return '\n                <div class="ax5-ui-select {{theme}}" id="{{id}}" data-select-els="root">\n                    <div class="ax-select-body">\n                        <div class="ax-select-contents" data-select-els="contents" style="width:{{contentWidth}}px;"></div>\n                    </div>\n                    <div class="ax-select-arrow"></div>\n                </div>\n                ';
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
        };
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
        };

        this.bind = function (opts) {
            var selectConfig = {},
                optIdx;

            jQuery.extend(true, selectConfig, cfg);
            if (opts) jQuery.extend(true, selectConfig, opts);
            opts = selectConfig;

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
            optIdx = U.search(this.queue, function () {
                return this.id == opts.id;
            });

            if (optIdx === -1) {
                this.queue.push(opts);
                bindSelectTarget.call(this, opts, this.queue.length - 1);
            } else {
                this.queue[optIdx] = opts;
                bindSelectTarget.call(this, this.queue[optIdx], optIdx);
            }

            selectConfig = null;
            optIdx = null;
            return this;
        };

        this.open = function () {

            var setSelectContent = {};

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

                this.activeSelect = jQuery(ax5.mustache.render(getTmpl.call(this, opts, optIdx), opts));
                this.activeSelectQueueIndex = optIdx;
                setSelectContent.call(this, opts, optIdx);

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
         * @method ax5.ui.picker.close
         * @returns {ax5.ui.picker} this
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