'use strict';

// ax5.ui.picker
(function (root, _SUPER_) {

    /**
     * @class ax5.ui.picker
     * @classdesc
     * @version 0.6.1
     * @author tom@axisj.com
     * @example
     * ```
     * var myPicker = new ax5.ui.picker();
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
            lang: {
                "ok": "ok", "cancel": "cancel"
            },
            animateTime: 250
        };

        this.activePicker = null;
        this.activePickerQueueIndex = -1;
        this.openTimer = null;
        this.closeTimer = null;

        cfg = this.config;

        var onStateChanged = function onStateChanged(item, that) {
            if (item && item.onStateChanged) {
                item.onStateChanged.call(that, that);
            } else if (this.onStateChanged) {
                this.onStateChanged.call(that, that);
            }
            return true;
        },
            bindPickerTarget = function () {

            var pickerEvent = {
                'focus': function focus(queIdx, e) {
                    this.open(queIdx);
                },
                'click': function click(queIdx, e) {
                    this.open(queIdx);
                }
            };

            var pickerType = {
                '@fn': function fn(queIdx) {
                    var item = this.queue[queIdx],
                        config = {},
                        inputLength = item.$target.find('input[type="text"]').length;

                    config = {
                        inputLength: inputLength || 1
                    };

                    if (inputLength > 1) {
                        config.btns = {
                            ok: { label: cfg.lang["ok"], theme: cfg.theme }
                        };
                    }

                    this.queue[queIdx] = jQuery.extend(true, config, item);

                    config = null;
                    inputLength = null;
                },
                'date': function date(queIdx) {
                    // 1. 이벤트 바인딩
                    // 2. ui 준비

                    var item = this.queue[queIdx],
                        contentWidth = item.content ? item.content.width || 270 : 270,
                        contentMargin = item.content ? item.content.margin || 5 : 5,
                        config = {},
                        inputLength = item.$target.find('input[type="text"]').length;

                    config = {
                        contentWidth: contentWidth * inputLength + (inputLength - 1) * contentMargin,
                        content: {
                            width: contentWidth,
                            margin: contentMargin
                        },
                        inputLength: inputLength || 1
                    };

                    if (inputLength > 1 && !item.btns) {
                        config.btns = {
                            ok: { label: cfg.lang["ok"], theme: cfg.theme }
                        };
                    }

                    this.queue[queIdx] = jQuery.extend(true, config, item);

                    contentWidth = null;
                    contentMargin = null;
                    config = null;
                    inputLength = null;
                },
                'secure-num': function secureNum(queIdx) {
                    var item = this.queue[queIdx],
                        config = {},
                        inputLength = item.$target.find('input[type="text"]').length;

                    config = {
                        inputLength: inputLength || 1
                    };

                    this.queue[queIdx] = jQuery.extend(true, config, item);

                    config = null;
                    inputLength = null;
                }
            };

            return function (queIdx) {
                var item = this.queue[queIdx],
                    _input;

                if (!item.content) {
                    console.log(ax5.info.getError("ax5picker", "501", "bind"));
                    return this;
                }

                // 함수타입
                if (U.isFunction(item.content)) {
                    pickerType["@fn"].call(this, queIdx);
                } else {
                    for (var key in pickerType) {
                        if (item.content.type == key) {
                            pickerType[key].call(this, queIdx);
                            break;
                        }
                    }
                }

                _input = item.$target.get(0).tagName.toUpperCase() == "INPUT" ? item.$target : item.$target.find('input[type]');
                _input.unbind('focus.ax5picker').unbind('click.ax5picker').bind('focus.ax5picker', pickerEvent.focus.bind(this, queIdx)).bind('click.ax5picker', pickerEvent.click.bind(this, queIdx));

                item.$target.find('.input-group-addon').unbind('click.ax5picker').bind('click.ax5picker', pickerEvent.click.bind(this, queIdx));

                if (item.content.formatter && ax5.ui.formatter) {
                    _input.ax5formatter(item.content.formatter);
                }

                _input = null;
                item = null;
                queIdx = null;
                return this;
            };
        }(),
            getTmpl = function getTmpl(queIdx) {
            return '\n                <div class="ax5-ui-picker {{theme}}" id="{{id}}" data-picker-els="root">\n                    {{#title}}\n                        <div class="ax-picker-heading">{{title}}</div>\n                    {{/title}}\n                    <div class="ax-picker-body">\n                        <div class="ax-picker-content" data-picker-els="content" style="width:{{contentWidth}}px;"></div>\n                        {{#btns}}\n                            <div class="ax-picker-buttons">\n                            {{#btns}}\n                                {{#@each}}\n                                <button data-picker-btn="{{@key}}" class="btn btn-default {{@value.theme}}">{{@value.label}}</button>\n                                {{/@each}}\n                            {{/btns}}\n                            </div>\n                        {{/btns}}\n                    </div>\n                    <div class="ax-picker-arrow"></div>\n                </div>\n                ';
        },
            alignPicker = function alignPicker(append) {
            if (!this.activePicker) return this;

            var item = this.queue[this.activePickerQueueIndex],
                pos = {},
                dim = {};

            if (append) jQuery(document.body).append(this.activePicker);

            pos = item.$target.offset();
            dim = {
                width: item.$target.outerWidth(),
                height: item.$target.outerHeight()
            };

            // picker css(width, left, top) & direction 결정
            if (!item.direction || item.direction === "" || item.direction === "auto") {
                // set direction
                item.direction = "top";
            }

            if (append) {
                this.activePicker.addClass("direction-" + item.direction);
            }
            this.activePicker.css(function () {
                if (item.direction == "top") {
                    return {
                        left: pos.left + dim.width / 2 - this.activePicker.outerWidth() / 2,
                        top: pos.top + dim.height + 12
                    };
                } else if (item.direction == "bottom") {
                    return {
                        left: pos.left + dim.width / 2 - this.activePicker.outerWidth() / 2,
                        top: pos.top - this.activePicker.outerHeight() - 12
                    };
                } else if (item.direction == "left") {
                    return {
                        left: pos.left + dim.width + 12,
                        top: pos.top - dim.height / 2
                    };
                } else if (item.direction == "right") {
                    return {
                        left: pos.left - this.activePicker.outerWidth() - 12,
                        top: pos.top - dim.height / 2
                    };
                }
            }.call(this));
        },
            onBodyClick = function onBodyClick(e, target) {
            if (!this.activePicker) return this;

            var item = this.queue[this.activePickerQueueIndex];

            target = U.findParentNode(e.target, function (target) {
                if (target.getAttribute("data-picker-els")) {
                    return true;
                } else if (item.$target.get(0) == target) {
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
            onBtnClick = function onBtnClick(e, target) {
            // console.log('btn click');
            if (e.srcElement) e.target = e.srcElement;

            target = U.findParentNode(e.target, function (target) {
                if (target.getAttribute("data-picker-btn")) {
                    return true;
                }
            });

            if (target) {
                var item = this.queue[this.activePickerQueueIndex],
                    k = target.getAttribute("data-picker-btn");

                if (item.btns && item.btns[k].onClick) {
                    var that = {
                        key: k,
                        value: item.btns[k],
                        self: this,
                        item: item
                    };
                    item.btns[k].onClick.call(that, k);
                } else {
                    this.close();
                }
            }
        },
            onBodyKeyup = function onBodyKeyup(e) {
            if (e.keyCode == ax5.info.eventKeys.ESC) {
                this.close();
            }
        },
            getQueIdx = function getQueIdx(boundID) {
            if (!U.isString(boundID)) {
                boundID = jQuery(boundID).data("data-axpicker-id");
            }
            if (!U.isString(boundID)) {
                console.log(ax5.info.getError("ax5picker", "402", "getQueIdx"));
                return;
            }
            return U.search(this.queue, function () {
                return this.id == boundID;
            });
        };
        /// private end

        /**
         * Preferences of picker UI
         * @method ax5.ui.picker.setConfig
         * @param {Object} config - 클래스 속성값
         * @returns {ax5.ui.picker}
         * @example
         * ```
         * ```
         */
        this.init = function () {
            this.onStateChanged = cfg.onStateChanged;
        };

        this.bind = function (item) {
            var pickerConfig = {},
                queIdx;

            item = jQuery.extend(true, pickerConfig, cfg, item);

            if (!item.target) {
                console.log(ax5.info.getError("ax5picker", "401", "bind"));
                return this;
            }
            item.$target = jQuery(item.target);
            if (!item.id) item.id = item.$target.data("data-axpicker-id");

            if (!item.id) {
                item.id = 'ax5-picker-' + ax5.getGuid();
                item.$target.data("data-axpicker-id", item.id);
            }
            queIdx = U.search(this.queue, function () {
                return this.id == item.id;
            });

            if (queIdx === -1) {
                this.queue.push(item);
                bindPickerTarget.call(this, this.queue.length - 1);
            } else {
                this.queue[queIdx] = jQuery.extend(true, {}, this.queue[queIdx], item);
                bindPickerTarget.call(this, queIdx);
            }

            pickerConfig = null;
            queIdx = null;
            return this;
        };

        /**
         * @method ax5.ui.picker.setContentValue
         * @param {String} boundID
         * @param {Number} inputIndex
         * @param {String} val
         * @returns {ax5.ui.picker} this
         */
        this.setContentValue = function (boundID, inputIndex, val) {
            var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
            var item = this.queue[queIdx];
            var _input;

            if (item) {

                _input = item.$target.get(0).tagName.toUpperCase() == "INPUT" ? item.$target : jQuery(item.$target.find('input[type]').get(inputIndex));
                _input.val(val);

                onStateChanged.call(this, item, {
                    self: self,
                    state: "changeValue",
                    item: item,
                    value: val
                });

                if (item.inputLength == 1) {
                    this.close();
                }
            }

            item = null;
            boundID = null;
            inputIndex = null;
            val = null;
            return this;
        };

        /**
         * @method ax5.ui.picker.open
         * @param {String} boundObjectId
         * @returns {ax5.ui.picker} this
         */
        this.open = function () {

            var pickerContent = {
                '@fn': function fn(queIdx, callBack) {
                    var item = this.queue[queIdx];
                    item.content.call(item, function (html) {
                        callBack(html);
                    });
                    return true;
                },
                'date': function date(queIdx) {
                    var item = this.queue[queIdx];
                    var html = [];
                    for (var i = 0; i < item.inputLength; i++) {
                        html.push('<div ' + 'style="width:' + U.cssNumber(item.content.width) + ';float:left;" ' + 'class="ax-picker-content-box" ' + 'data-calendar-target="' + i + '"></div>');
                        if (i < item.inputLength - 1) html.push('<div style="width:' + item.content.margin + 'px;float:left;height: 5px;"></div>');
                    }
                    html.push('<div style="clear:both;"></div>');
                    item.pickerContent.html(html.join(''));

                    var calendarConfig = {
                        displayDate: new Date(),
                        control: {
                            left: '<i class="fa fa-chevron-left"></i>',
                            yearTmpl: '%s',
                            monthTmpl: '%s',
                            right: '<i class="fa fa-chevron-right"></i>',
                            yearFirst: true
                        }
                    };

                    // calendar bind
                    item.pickerContent.find('[data-calendar-target]').each(function () {

                        // calendarConfig extend ~
                        var idx = this.getAttribute("data-calendar-target"),
                            dValue = item.$target.find('input[type]').get(idx).value,
                            d = ax5.util.date(dValue);

                        calendarConfig.displayDate = d;
                        if (dValue) calendarConfig.selection = [d];
                        calendarConfig = jQuery.extend(true, calendarConfig, item.content.config || {});
                        calendarConfig.target = this;
                        calendarConfig.onClick = function () {
                            self.setContentValue(item.id, idx, this.date);
                        };

                        new ax5.ui.calendar(calendarConfig);
                    });
                },
                'secure-num': function secureNum(queIdx) {
                    var item = this.queue[queIdx];
                    var html = [];
                    for (var i = 0; i < item.inputLength; i++) {
                        html.push('<div ' + 'style="width:' + U.cssNumber(item.content.width) + ';float:left;" ' + 'class="ax-picker-content-box" ' + 'data-secure-num-target="' + i + '"></div>');
                        if (i < item.inputLength - 1) html.push('<div style="width:' + item.content.margin + 'px;float:left;height: 5px;"></div>');
                    }
                    html.push('<div style="clear:both;"></div>');
                    item.pickerContent.html(html.join(''));

                    // secure-num bind
                    item.pickerContent.find('[data-secure-num-target]').each(function () {
                        var idx = this.getAttribute("data-secure-num-target"),
                            po = [];

                        var numArray = function (a) {
                            var j, x, i;
                            for (i = a.length; i; i -= 1) {
                                j = Math.floor(Math.random() * i);
                                x = a[i - 1];
                                a[i - 1] = a[j];
                                a[j] = x;
                            }
                            return a;
                        }([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

                        var specialArray = [{ label: "&#x02190", fn: "back" }, { label: "C", fn: "clear" }];

                        numArray.forEach(function (n) {
                            po.push('<div style="float:left;' + item.content.config.btnWrapStyle + '">');
                            po.push('<button class="btn btn-default btn-' + item.content.config.btnTheme + '" ' + 'style="' + item.content.config.btnStyle + '" data-secure-num-value="' + n + '">' + n + '</button>');
                            po.push('</div>');
                        });
                        specialArray.forEach(function (n) {
                            po.push('<div style="float:left;' + item.content.config.btnWrapStyle + '">');
                            po.push('<button class="btn btn-default btn-' + item.content.config.specialBtnTheme + '" ' + 'style="' + item.content.config.btnStyle + '" data-secure-num-value="' + n.fn + '">' + n.label + '</button>');
                            po.push('</div>');
                        });

                        po.push('<div style="clear:both;"></div>');

                        $(this).html(po.join('')).find('[data-secure-num-value]').click(function () {
                            var act = this.getAttribute("data-secure-num-value");
                            var _input = item.$target.get(0).tagName.toUpperCase() == "INPUT" ? item.$target : jQuery(item.$target.find('input[type]').get(idx));
                            var val = _input.val();

                            if (act == "back") {
                                _input.val(val.substring(0, val.length - 1));
                            } else if (act == "clear") {
                                _input.val('');
                            } else {
                                _input.val(val + act);
                            }

                            onStateChanged.call(this, item, {
                                self: self,
                                state: "changeValue",
                                item: item,
                                value: _input.val()
                            });
                        });
                    });
                }
            };

            return function (boundID, tryCount) {
                var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                var item = this.queue[queIdx];

                /**
                 다른 피커가 있는 경우와 다른 피커를 닫고 다시 오픈 명령이 내려진 경우에 대한 예외 처리 구문
                 */
                if (this.openTimer) clearTimeout(this.openTimer);
                if (this.activePicker) {
                    if (this.activePickerQueueIndex == queIdx) {
                        return this;
                    }

                    if (tryCount > 2) return this;
                    this.close();
                    this.openTimer = setTimeout(function () {
                        this.open(queIdx, (tryCount || 0) + 1);
                    }.bind(this), cfg.animateTime);
                    return this;
                }

                this.activePicker = jQuery(ax5.mustache.render(getTmpl.call(this, item, queIdx), item));
                this.activePickerQueueIndex = queIdx;
                item.pickerContent = this.activePicker.find('[data-picker-els="content"]');

                if (U.isFunction(item.content)) {
                    // 함수타입
                    item.pickerContent.html("Loading..");
                    pickerContent["@fn"].call(this, queIdx, function (html) {
                        item.pickerContent.html(html);
                    });
                } else {
                    for (var key in pickerContent) {
                        if (item.content.type == key) {
                            pickerContent[key].call(this, queIdx);
                            break;
                        }
                    }
                }

                // bind event picker btns
                this.activePicker.find("[data-picker-btn]").on(cfg.clickEventName, function (e) {
                    onBtnClick.call(this, e || window.event, queIdx);
                }.bind(this));

                alignPicker.call(this, "append");
                jQuery(window).bind("resize.ax5picker", function () {
                    alignPicker.call(this);
                }.bind(this));

                // bind key event
                jQuery(window).bind("keyup.ax5picker", function (e) {
                    e = e || window.event;
                    onBodyKeyup.call(this, e);
                    U.stopEvent(e);
                }.bind(this));

                jQuery(window).bind("click.ax5picker", function (e) {
                    e = e || window.event;
                    onBodyClick.call(this, e);
                    U.stopEvent(e);
                }.bind(this));

                onStateChanged.call(this, item, {
                    self: this,
                    state: "open",
                    item: item
                });

                return this;
            };
        }();

        /**
         * @method ax5.ui.picker.close
         * @returns {ax5.ui.picker} this
         */
        this.close = function (item) {
            if (this.closeTimer) clearTimeout(this.closeTimer);
            if (!this.activePicker) return this;

            item = this.queue[this.activePickerQueueIndex];

            this.activePicker.addClass("destroy");
            jQuery(window).unbind("resize.ax5picker");
            jQuery(window).unbind("click.ax5picker");
            jQuery(window).unbind("keyup.ax5picker");

            this.closeTimer = setTimeout(function () {
                if (this.activePicker) this.activePicker.remove();
                this.activePicker = null;
                this.activePickerQueueIndex = -1;

                onStateChanged.call(this, item, {
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

    root.picker = function () {
        if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
        return axClass;
    }(); // ax5.ui에 연결
})(ax5.ui, ax5.ui.root);

ax5.ui.picker_instance = new ax5.ui.picker();

$.fn.ax5picker = function () {
    return function (config) {
        if (typeof config == "undefined") config = {};
        $.each(this, function () {
            var defaultConfig = {
                target: this
            };
            config = $.extend(true, config, defaultConfig);
            ax5.ui.picker_instance.bind(config);
        });
        return this;
    };
}();