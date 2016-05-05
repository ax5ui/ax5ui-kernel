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
            opts = null;
            that = null;
            return true;
        },
            getOptionGroupTmpl = function getOptionGroupTmpl(columnKeys) {
            return '\n                <div class="ax5-ui-select-option-group {{theme}} {{size}}" data-ax5-select-option-group="{{id}}">\n                    <div class="ax-select-body">\n                        <div class="ax-select-option-group-content" data-select-els="content">\n                        {{#options}}\n                            <div class="ax-select-option-item" data-option-index="{{@i}}" data-option-value="{{' + columnKeys.optionValue + '}}" {{#' + columnKeys.optionSelected + '}}data-option-selected="true"{{/' + columnKeys.optionSelected + '}}>\n                                <div class="ax-select-option-item-holder">\n                                    {{#multiple}}\n                                    <span class="ax-select-option-item-cell ax-select-option-item-checkbox">\n                                        <span class="item-checkbox-wrap useCheckBox" data-option-checkbox-index="{{@i}}"></span>\n                                    </span>\n                                    {{/multiple}}\n                                    {{^multiple}}\n                                    \n                                    {{/multiple}}\n                                    <span class="ax-select-option-item-cell ax-select-option-item-label">{{' + columnKeys.optionText + '}}</span>\n                                </div>\n                            </div>\n                        {{/options}}\n                        </div>\n                    </div>\n                    <div class="ax-select-arrow"></div> \n                </div>\n                ';
        },
            getTmpl = function getTmpl() {
            return '\n                <a {{^tabIndex}}href="#ax5select-{{id}}" {{/tabIndex}}{{#tabIndex}}tabindex="{{tabIndex}}" {{/tabIndex}}class="form-control {{formSize}} ax5-ui-select-display {{theme}}" \n                data-ax5-select-display="{{id}}">\n                    <div class="ax5-ui-select-display-table" data-select-els="display-table">\n                        <div data-ax5-select-display="label">{{label}}</div>\n                        <div data-ax5-select-display="addon" data-ax5-select-opened="false">\n                            {{#icons}}\n                            <span class="addon-icon-closed">{{clesed}}</span>\n                            <span class="addon-icon-opened">{{opened}}</span>\n                            {{/icons}}\n                            {{^icons}}\n                            <span class="addon-icon-closed"><span class="addon-icon-arrow"></span></span>\n                            <span class="addon-icon-opened"><span class="addon-icon-arrow"></span></span>\n                            {{/icons}}\n                        </div>\n                    </div>\n                </a>\n                ';
        },
            alignSelectDisplay = function alignSelectDisplay() {
            var i = this.queue.length,
                w;
            while (i--) {
                if (this.queue[i].$display) {
                    w = this.queue[i].select.outerWidth();
                    if (this.queue[i].select.css("display") != "block") {
                        w = w + cfg.displayMargin;
                    }
                    this.queue[i].$display.css({
                        "min-width": w
                    });
                }
            }

            i = null;
            w = null;
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
            getLabel = function getLabel(optIdx) {
            var opts = this.queue[optIdx];
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
                'click': function click(optIdx, e) {
                    if (self.activeSelectQueueIndex == optIdx) {
                        self.close();
                    } else {
                        self.open(optIdx);
                    }
                    U.stopEvent(e);
                },
                'keyUp': function keyUp(optIdx, e) {
                    if (e.which == ax5.info.eventKeys.SPACE) {
                        selectEvent.click.call(this, optIdx, e);
                    } else if (e.which == ax5.info.eventKeys.DOWN) {
                        // todo focus move
                    }
                }
            };
            return function (optIdx) {
                var opts = this.queue[optIdx];
                var data = {};

                if (!opts.$display) {
                    opts.options = syncSelectOptions.call(this, optIdx, opts.options);

                    /// 템플릿에 전달할 오브젝트 선언
                    data.id = opts.id;
                    data.theme = opts.theme;
                    data.tabIndex = opts.tabIndex;
                    data.label = getLabel.call(this, optIdx);
                    data.formSize = function () {
                        if (opts.select.hasClass("input-lg")) return "input-lg";
                        if (opts.select.hasClass("input-sm")) return "input-sm";
                    }();

                    opts.$display = jQuery(ax5.mustache.render(getTmpl.call(this, opts, optIdx), data));
                    opts.$target.append(opts.$display);
                    alignSelectDisplay.call(this);

                    opts.$display.unbind('click.ax5select').bind('click.ax5select', selectEvent.click.bind(this, optIdx)).unbind('keyup.ax5select').bind('keyup.ax5select', selectEvent.keyUp.bind(this, optIdx));
                } else {
                    opts.options = syncSelectOptions.call(this, optIdx, opts.options);
                    opts.$display.find('[data-ax5-select-display="label"]').html(getLabel.call(this, optIdx));
                    alignSelectDisplay.call(this);

                    opts.$display.unbind('click.ax5select').bind('click.ax5select', selectEvent.click.bind(this, optIdx)).unbind('keyup.ax5select').bind('keyup.ax5select', selectEvent.keyUp.bind(this, optIdx));
                }

                data = null;
                opts = null;
                optIdx = null;
                return this;
            };
        }(),
            syncSelectOptions = function () {
            var setSelected = function setSelected(optIdx, O) {
                if (!O) {
                    this.queue[optIdx].selected = [];
                } else {
                    if (this.queue[optIdx].multiple) this.queue[optIdx].selected.push(jQuery.extend({}, O));else this.queue[optIdx].selected[0] = jQuery.extend({}, O);
                }
            };

            return function (optIdx, options) {
                var opts = this.queue[optIdx];
                var po, elementOptions, newOptions;
                setSelected.call(this, optIdx, false); // opts.selected 초기화

                if (options) {
                    opts.options = options;

                    // select options 태그 생성
                    po = [];
                    opts.options.forEach(function (O, OIndex) {
                        O['@index'] = OIndex;
                        po.push('<option value="' + O[cfg.columnKeys.optionValue] + '" ' + (O[cfg.columnKeys.optionSelected] ? ' selected="selected"' : '') + '>' + O[cfg.columnKeys.optionText] + '</option>');
                        if (O[cfg.columnKeys.optionSelected]) {
                            setSelected.call(self, optIdx, O);
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
                        if (O.selected) setSelected.call(self, optIdx, option);
                        newOptions.push(option);
                        option = null;
                    });
                    opts.options = newOptions;
                }

                if (!opts.multiple && opts.selected.length == 0) {
                    opts.selected = jQuery.extend({}, opts.options[0]);
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
            jQuery(window).bind("resize.ax5select-display", function () {
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

            opts = jQuery.extend(selectConfig, cfg, opts);
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
            opts.tabIndex = opts.select.attr("tabindex");
            opts.select.attr("tabindex", "-1");
            opts.multiple = opts.select.attr("multiple");
            opts.size = opts.select.attr("data-size");
            if (opts.options) {
                opts.options = JSON.parse(JSON.stringify(opts.options));
            }

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
                bindSelectTarget.call(this, this.queue.length - 1);
            } else {
                this.queue[optIdx] = jQuery.extend({}, this.queue[optIdx], opts);
                bindSelectTarget.call(this, optIdx);
            }

            selectConfig = null;
            optIdx = null;
            return this;
        };

        /**
         * open the optionBox of select
         * @method ax5.ui.select.open
         * @param {Number} [optIdx]
         * @param {Number} [tryCount]
         * @returns {ax5.ui.select}
         */
        this.open = function () {

            return function (optIdx, tryCount) {
                /**
                 * open select from the outside
                 */
                if (optIdx instanceof jQuery || U.isElement(optIdx)) {
                    var select_id = jQuery(optIdx).data("ax5-select");
                    optIdx = ax5.util.search(this.queue, function () {
                        return this.id == select_id;
                    });
                    if (optIdx == -1) {
                        console.log(ax5.info.getError("ax5select", "402", "open"));
                        return this;
                    }
                }

                var opts = this.queue[optIdx];
                var data = {},
                    focusTop,
                    selectedOptionEl;
                if (this.openTimer) clearTimeout(this.openTimer);
                if (this.activeSelectOptionGroup) {
                    if (this.activeSelectQueueIndex == optIdx) {
                        return this;
                    }

                    if (tryCount > 2) return this;
                    this.close();
                    this.openTimer = setTimeout(function () {
                        this.open(optIdx, (tryCount || 0) + 1);
                    }.bind(this), cfg.animateTime);
                    return this;
                }

                /// 템플릿에 전달할 오브젝트 선언
                data.id = opts.id;
                data.theme = opts.theme;
                data.size = "ax5-ui-select-option-group-" + opts.size;
                data.multiple = opts.multiple;
                data.options = opts.options;
                opts.$display.attr("data-select-option-group-opened", "true");

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
        this.update = function (_opts) {
            this.bind(_opts);
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
                'index': function index(optIdx, value) {
                    // 옵션선택 초기화
                    if (!this.queue[optIdx].multiple) {
                        this.queue[optIdx].options.forEach(function (n) {
                            n.selected = false;
                        });
                    }

                    var getSelected = function getSelected(_opts, o) {
                        return _opts.multiple ? !o : true;
                    };

                    if (U.isArray(value.index)) {
                        value.index.forEach(function (n) {
                            self.queue[optIdx].options[n].selected = getSelected(self.queue[optIdx], self.queue[optIdx].options[n].selected);
                            self.activeSelectOptionGroup.find('[data-option-index="' + n + '"]').attr("data-option-selected", self.queue[optIdx].options[n].selected.toString());
                        });
                    } else {
                        self.queue[optIdx].options[value.index].selected = getSelected(self.queue[optIdx], self.queue[optIdx].options[value.index].selected);
                        self.activeSelectOptionGroup.find('[data-option-index="' + value.index + '"]').attr("data-option-selected", self.queue[optIdx].options[value.index].selected.toString());
                    }

                    syncSelectOptions.call(this, optIdx, this.queue[optIdx].options);
                    this.queue[optIdx].$display.find('[data-ax5-select-display="label"]').html(getLabel.call(this, optIdx));

                    alignSelectOptionGroup.call(this);
                },
                'text': function text(optIdx, value) {},
                'arr': function arr(optIdx, value) {},
                'value': function value(optIdx, _value) {
                    console.log(opts, _value);
                }
            };

            return function (boundID, value) {
                //console.log(boundID, value);

                if (!U.isString(boundID)) boundID = jQuery(boundID).data("ax5-select");
                if (!U.isString(boundID)) {
                    console.log(ax5.info.getError("ax5select", "402", "val"));
                    return;
                }
                var optIdx = ax5.util.search(this.queue, function () {
                    return this.id == boundID;
                });

                if (typeof value == "undefined") {
                    return this.queue[optIdx].selected;
                } else if (U.isArray(value)) {
                    processor.arr.call(this, optIdx, value);
                } else if (U.isString(value) || U.isNumber(value)) {
                    processor.value.call(this, optIdx, value);
                } else {
                    for (var key in processor) {
                        if (value[key]) {
                            processor[key].call(this, optIdx, value);
                            break;
                        }
                    }
                }

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
            opts.$display.removeAttr("data-select-option-group-opened");
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
jQuery.fn.ax5select = function () {
    return function (config) {
        if (typeof config == "undefined") config = {};
        jQuery.each(this, function () {
            var defaultConfig = {
                target: this
            };
            config = jQuery.extend({}, config, defaultConfig);
            ax5.ui.select_instance.bind(config);
        });
        return this;
    };
}();