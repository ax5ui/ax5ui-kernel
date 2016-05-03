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
            animateTime: 250,

            lang: {
                emptyOfSelected: '',
                multipleLabel: '"{{label}}"외 {{length}}건'
            },
            columnKeys: {
                optionValue: 'value',
                optionText: 'text',
                optionSelected: 'selected'
            },
            displayMargin: 14
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
            getOptionGroupTmpl = function getOptionGroupTmpl(columnKeys) {
            return '\n                <div class="ax5-ui-select-option-group {{theme}} {{size}}" data-ax5-select-option-group="{{id}}">\n                    <div class="ax-select-body">\n                        <div class="ax-select-option-group-content" data-select-els="content">\n                        {{#options}}\n                            <div class="ax-select-option-item" data-option-index="{{@i}}" data-option-value="{{' + columnKeys.optionValue + '}}" data-selected="{{' + columnKeys.optionSelected + '}}">\n                                <div class="ax-select-option-item-holder">\n                                    {{#multiple}}\n                                    <span class="ax-select-option-item-cell ax-select-option-item-checkbox">\n                                        <span class="item-checkbox-wrap useCheckBox" data-option-checkbox-index="{{@i}}" {{#' + columnKeys.optionSelected + '}}data-item-selected="true"{{/' + columnKeys.optionSelected + '}}></span>\n                                    </span>\n                                    {{/multiple}}\n                                    {{^multiple}}\n                                    \n                                    {{/multiple}}\n                                    <span class="ax-select-option-item-cell ax-select-option-item-label">{{' + columnKeys.optionText + '}}</span>\n                                </div>\n                            </div>\n                        {{/options}}\n                        </div>\n                        {{#btns}}\n                            <div class="ax-select-option-buttons">\n                            {{#btns}}\n                                {{#@each}}\n                                <button data-select-option-btn="{{@key}}" class="btn btn-default {{@value.theme}}">{{@value.label}}</button>\n                                {{/@each}}\n                            {{/btns}}\n                            </div>\n                        {{/btns}}\n                    </div>\n                    <div class="ax-select-arrow"></div> \n                </div>\n                ';
        },
            getTmpl = function getTmpl() {
            return '\n                <a class="form-control {{formSize}} ax5-ui-select-display {{theme}}" data-ax5-select-display="{{id}}">\n                    <div class="ax5-ui-select-display-table" data-select-els="display-table">\n                        <div data-ax5-select-display="label">{{label}}</div>\n                        <div data-ax5-select-display="addon" data-ax5-select-opened="false">\n                            {{#icons}}\n                            <span class="addon-icon-closed">{{clesed}}</span>\n                            <span class="addon-icon-opened">{{opened}}</span>\n                            {{/icons}}\n                            {{^icons}}\n                            <span class="addon-icon-closed"><span class="addon-icon-arrow"></span></span>\n                            <span class="addon-icon-opened"><span class="addon-icon-arrow"></span></span>\n                            {{/icons}}\n                        </div>\n                    </div>\n                </a>\n                ';
        },
            alignSelectDisplay = function alignSelectDisplay() {
            var i = this.queue.length,
                w;
            while (i--) {
                if (this.queue[i].$display) {

                    this.queue[i].$display.css({ width: "auto" });
                    w = Math.max(this.queue[i].select.outerWidth(), this.queue[i].$display.find('[data-select-els="display-table"]').outerWidth());
                    this.queue[i].$display.css({
                        width: w + cfg.displayMargin,
                        height: this.queue[i].select.outerHeight()
                    });
                }
            }
            return this;
        },
            alignSelectOptionGroup = function alignSelectOptionGroup(append) {
            if (!this.activeSelectOptionGroup) return this;

            var opts = this.queue[this.activeSelectQueueIndex],
                pos = {},
                dim = {};

            if (append) jQuery(document.body).append(this.activeSelectOptionGroup);

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
                this.activeSelectOptionGroup.addClass("direction-" + opts.direction);
            }
            this.activeSelectOptionGroup.css(function () {
                if (opts.direction == "top") {
                    return {
                        left: pos.left,
                        top: pos.top + dim.height + 1,
                        width: dim.width
                    };
                } else if (opts.direction == "bottom") {
                    return {
                        left: pos.left,
                        top: pos.top - this.activeSelectOptionGroup.outerHeight() - 1,
                        width: dim.width
                    };
                }
            }.call(this));
        },
            onBodyClick = function onBodyClick(e, target) {
            if (!this.activeSelectOptionGroup) return this;

            var opts = this.queue[this.activeSelectQueueIndex],
                clickEl = "display";

            target = U.findParentNode(e.target, function (target) {
                if (target.getAttribute("data-option-value")) {
                    clickEl = "optionItem";
                    return true;
                } else if (opts.$target.get(0) == target) {
                    clickEl = "display";
                    return true;
                }
            });
            if (!target) {
                this.close();
                return this;
            } else if (clickEl != "display") {
                this.val(opts.id, { index: target.getAttribute("data-option-index") });
                if (!opts.multiple) this.close();
            }

            return this;
        },
            onBodyKeyup = function onBodyKeyup(e) {
            if (e.keyCode == ax5.info.eventKeys.ESC) {
                this.close();
            }
        },
            getLabel = function getLabel(opts, optIdx) {
            var labels = [];
            if (U.isArray(opts.selected) && opts.selected.length > 0) {
                opts.selected.forEach(function (n) {
                    if (n.selected) labels.push(n[cfg.columnKeys.optionText]);
                });
            } else {
                if (!opts.multiple && opts.options[0]) labels[0] = opts.options[0][cfg.columnKeys.optionText];else labels[0] = "";
            }

            return function () {
                if (opts.multiple && labels.length > 1) {
                    var data = {
                        label: labels[0],
                        length: labels.length - 1
                    };
                    return ax5.mustache.render(cfg.lang.multipleLabel, data);
                } else {
                    return labels[0];
                }
            }();
        },
            bindSelectTarget = function () {
            var selectEvent = {
                'click': function click(opts, optIdx, e) {
                    self.open(opts, optIdx);
                }
            };
            return function (opts, optIdx) {
                var data = {};

                if (!opts.$display) {
                    syncSelectOptions.call(this, opts, optIdx, opts.options);
                    data.id = opts.id;
                    data.label = getLabel.call(this, opts, optIdx);
                    data.formSize = function () {
                        if (opts.select.hasClass("input-lg")) return "input-lg";
                        if (opts.select.hasClass("input-sm")) return "input-sm";
                    }();

                    opts.$display = jQuery(ax5.mustache.render(getTmpl.call(this, opts, optIdx), data));
                    opts.$target.append(opts.$display);
                    alignSelectDisplay.call(this);

                    opts.$display.unbind('click.ax5select').bind('click.ax5select', selectEvent.click.bind(this, this.queue[optIdx], optIdx));
                }

                data = null;
                opts = null;
                optIdx = null;
                return this;
            };
        }(),
            syncSelectOptions = function () {
            var setSelected = function setSelected(opts, optIdx, O) {
                if (!O) {
                    opts.selected = [];
                } else {
                    if (opts.multiple) opts.selected.push(jQuery.extend({}, O));else opts.selected[0] = jQuery.extend({}, O);
                }
            };

            return function (opts, optIdx, options) {
                var po, elementOptions, newOptions;
                setSelected(opts, optIdx, false); // opts.selected 초기화

                if (options) {
                    opts.options = [].concat(options);

                    // select options 태그 생성
                    po = [];
                    opts.options.forEach(function (O, OIndex) {
                        O['@index'] = OIndex;
                        po.push('<option value="' + O[cfg.columnKeys.optionValue] + '" ' + (O[cfg.columnKeys.optionSelected] ? ' selected="selected"' : '') + '>' + O[cfg.columnKeys.optionText] + '</option>');
                        if (O[cfg.columnKeys.optionSelected]) {
                            setSelected(opts, optIdx, O);
                        }
                    });
                    opts.select.html(po.join(''));
                } else {
                    elementOptions = U.toArray(opts.select.get(0).options);
                    // select option 스크립트 생성
                    newOptions = [];
                    elementOptions.forEach(function (O, OIndex) {
                        var option = {};
                        option[cfg.columnKeys.optionValue] = O.value;
                        option[cfg.columnKeys.optionText] = O.text;
                        option[cfg.columnKeys.optionSelected] = O.selected;
                        option['@index'] = OIndex;
                        if (O.selected) setSelected(opts, optIdx, option);
                        newOptions.push(option);
                        option = null;
                    });
                    opts.options = newOptions;
                }

                po = null;
                elementOptions = null;
                newOptions = null;
                return opts.options;
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
            opts.multiple = opts.select.attr("multiple");
            opts.size = opts.select.attr("data-size");

            // target attribute data
            (function (data) {
                if (U.isObject(data) && !data.error) {
                    opts = jQuery.extend(true, opts, data);
                }
            })(U.parseJson(opts.$target.attr("data-ax5select"), true));

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

            return function (opts, optIdx, tryCount) {
                var data = {},
                    focusTop,
                    selectedOptionEl;

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
                if (this.activeSelectOptionGroup) {
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

                data.id = opts.id;
                data.theme = opts.theme;
                data.size = "ax5-ui-select-option-group-" + opts.size;
                data.multiple = opts.multiple;
                data.options = opts.options;

                this.activeSelectOptionGroup = jQuery(ax5.mustache.render(getOptionGroupTmpl.call(this, cfg.columnKeys), data));
                this.activeSelectQueueIndex = optIdx;

                alignSelectOptionGroup.call(this, "append"); // alignSelectOptionGroup 에서 body append
                jQuery(window).bind("resize.ax5select", function () {
                    alignSelectOptionGroup.call(this);
                }.bind(this));

                if (opts.selected && opts.selected.length > 0) {
                    selectedOptionEl = this.activeSelectOptionGroup.find('[data-option-index="' + opts.selected[0]["@i"] + '"]');
                    if (selectedOptionEl.get(0)) {
                        focusTop = selectedOptionEl.position().top - this.activeSelectOptionGroup.height() / 3;
                        this.activeSelectOptionGroup.find('[data-select-els="content"]').stop().animate({ scrollTop: focusTop }, cfg.animateTime, 'swing', function () {});
                    }
                }

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

                data = null;
                focusTop = null;
                selectedOptionEl = null;
                return this;
            };
        }();

        /**
         * @method ax5.ui.select.update
         * @param {(Object|String)} opts
         * @returns {ax5.ui.select}
         */
        this.update = function () {
            // multiple
            // options
            // width, height
            // label
            // selected

            return this;
        };

        /**
         * @method ax5.ui.select.setValue
         * @param value
         * @returns {axClass}
         */
        this.val = function () {

            // todo : val 함수 리팩토링 필요

            var processor = {
                'index': function index(opts, optIdx, value) {
                    //console.log(opts, value);

                    // 옵션선택 초기화
                    if (!opts.multiple) {
                        opts.options.forEach(function (n) {
                            n.selected = false;
                        });
                    }

                    var getSelected = function getSelected(o) {
                        return opts.multiple ? !o : true;
                    };

                    if (U.isArray(value.index)) {
                        value.index.forEach(function (n) {
                            opts.options[n].selected = getSelected(opts.options[n].selected);
                            this.activeSelectOptionGroup.find('[data-option-checkbox-index="' + n + '"]').attr("data-item-selected", opts.options[n].selected.toString());
                        });
                    } else {
                        opts.options[value.index].selected = getSelected(opts.options[value.index].selected);
                        this.activeSelectOptionGroup.find('[data-option-checkbox-index="' + value.index + '"]').attr("data-item-selected", opts.options[value.index].selected.toString());
                    }
                    syncSelectOptions.call(this, opts, optIdx, opts.options);
                    opts.$display.find('[data-ax5-select-display="label"]').html(getLabel.call(this, opts, optIdx));

                    alignSelectDisplay.call(this);
                    alignSelectOptionGroup.call(this);
                },
                'text': function text(opts, optIdx, value) {},
                'arr': function arr(opts, optIdx, value) {},
                'value': function value(opts, optIdx, _value) {
                    console.log(opts, _value);
                }
            };

            return function (boundID, value) {
                var optIdx = ax5.util.search(this.queue, function () {
                    return this.id == boundID;
                });
                var opts = this.queue[optIdx];

                if (typeof value == "undefined") {
                    return opts.selected;
                } else if (U.isArray(value)) {
                    processor.arr.call(this, opts, optIdx, value);
                } else if (U.isString(value) || U.isNumber(value)) {
                    processor.value.call(this, opts, optIdx, value);
                } else {
                    for (var key in processor) {
                        if (value[key]) {
                            processor[key].call(this, opts, optIdx, value);
                            break;
                        }
                    }
                }

                opts = null;
                boundID = null;
                return this;
            };
        }();

        /**
         * @method ax5.ui.select.close
         * @returns {ax5.ui.select}
         */
        this.close = function (opts) {
            if (this.closeTimer) clearTimeout(this.closeTimer);
            if (!this.activeSelectOptionGroup) return this;

            opts = this.queue[this.activeSelectQueueIndex];

            this.activeSelectOptionGroup.addClass("destroy");
            jQuery(window).unbind("resize.ax5select");
            jQuery(window).unbind("click.ax5select");
            jQuery(window).unbind("keyup.ax5select");

            this.closeTimer = setTimeout(function () {
                if (this.activeSelectOptionGroup) this.activeSelectOptionGroup.remove();
                this.activeSelectOptionGroup = null;
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