// ax5.ui.picker
(function (root, _SUPER_) {

    /**
     * @class ax5.ui.picker
     * @classdesc
     * @version v0.0.1
     * @author tom@axisj.com
     * @logs
     * 2015-02-02 tom : 시작
     * @example
     * ```
     * var myPicker = new ax5.ui.picker();
     * ```
     */
    var U = ax5.util;

    //== UI Class
    var axClass = function () {
        var
            self = this,
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

        };

        this.bind = function (opts) {
            var
                pickerConfig = {},
                optIdx;

            jQuery.extend(true, pickerConfig, cfg);
            if (opts) jQuery.extend(true, pickerConfig, opts);
            opts = pickerConfig;

            if (!opts.target) {
                console.log(ax5.info.getError("ax5picker", "401", "bind"));
                return this;
            }
            opts.$target = jQuery(opts.target);
            if(!opts.id) opts.id = opts.$target.data("ax5-picker");

            if (!opts.id) {
                opts.id = 'ax5-picker-' + ax5.getGuid();
                opts.$target.data("ax5-picker", opts.id);
            }
            optIdx = U.search(this.queue, function () {
                return this.id == opts.id;
            });

            if (optIdx === -1)
            {
                this.queue.push(opts);
                this.__bindPickerTarget(opts, this.queue.length - 1);
            }
            else{
                this.queue[optIdx] = opts;
                this.__bindPickerTarget(this.queue[optIdx], optIdx);
            }

            return this;
        };

        this.__bindPickerTarget = (function () {

            var pickerEvent = {
                'focus': function (opts, optIdx, e) {
                    this.open(opts, optIdx);
                },
                'click': function (opts, optIdx, e) {
                    this.open(opts, optIdx);
                }
            };

            var pickerType = {
                '@fn': function (opts, optIdx) {
                    var
                        config = {},
                        inputLength = opts.$target.find('input[type="text"]').length;

                    config = {
                        inputLength: inputLength
                    };

                    if (inputLength > 1) {
                        config.btns = {
                            ok: {label: cfg.lang["ok"], theme: cfg.theme}
                        };
                    }

                    this.queue[optIdx] = jQuery.extend(true, config, opts);
                },
                'date': function (opts, optIdx) {
                    // 1. 이벤트 바인딩
                    // 2. ui 준비

                    var
                        contentWidth = (opts.content) ? opts.content.width || 270 : 270,
                        contentMargin = (opts.content) ? opts.content.margin || 5 : 5,
                        config = {},
                        inputLength = opts.$target.find('input[type="text"]').length;

                    config = {
                        contentWidth: (contentWidth * inputLength) + ((inputLength - 1) * contentMargin),
                        content: {
                            width: contentWidth,
                            margin: contentMargin
                        },
                        inputLength: inputLength
                    };

                    if (inputLength > 1 && !opts.btns) {
                        config.btns = {
                            ok: {label: cfg.lang["ok"], theme: cfg.theme}
                        };
                    }

                    this.queue[optIdx] = jQuery.extend(true, config, opts);
                }
            };

            return function (opts, optIdx) {
                if (!opts.content) {
                    console.log(ax5.info.getError("ax5picker", "501", "bind"));
                    return this;
                }

                // 함수타입
                if (U.isFunction(opts.content)) {
                    pickerType["@fn"].call(this, opts, optIdx);
                }
                else {
                    for (var key in pickerType) {
                        if (opts.content.type == key) {
                            pickerType[key].call(this, opts, optIdx);
                            break;
                        }
                    }
                }

                opts.$target
                    .find('input[type="text"]')
                    .unbind('focus.ax5picker')
                    .unbind('click.ax5picker')
                    .bind('focus.ax5picker', pickerEvent.focus.bind(this, this.queue[optIdx], optIdx))
                    .bind('click.ax5picker', pickerEvent.click.bind(this, this.queue[optIdx], optIdx));

                opts.$target
                    .find('.input-group-addon')
                    .unbind('click.ax5picker')
                    .bind('click.ax5picker', pickerEvent.click.bind(this, this.queue[optIdx], optIdx));

                if(opts.content.formatter && ax5.ui.formatter){
                    opts.$target.ax5formatter(opts.content.formatter);
                }

                return this;
            }

        })();

        this.__getTmpl = function (opts, optIdx) {
            // console.log(opts);
            return `
            <div class="ax5-ui-picker {{theme}}" id="{{id}}" data-picker-els="root">
                {{#title}}
                    <div class="ax-picker-heading">{{title}}</div>
                {{/title}}
                <div class="ax-picker-body">
                    <div class="ax-picker-contents" data-picker-els="contents" style="width:{{contentWidth}}px;"></div>
                    {{#btns}}
                        <div class="ax-picker-buttons">
                        {{#btns}}
                            {{#@each}}
                            <button data-picker-btn="{{@key}}" class="btn btn-default {{@value.theme}}">{{@value.label}}</button>
                            {{/@each}}
                        {{/btns}}
                        </div>
                    {{/btns}}
                </div>
                <div class="ax-picker-arrow"></div>
            </div>
            `;
        };

        this.setContentValue = function (boundID, inputIndex, val) {
            var opts = this.queue[ax5.util.search(this.queue, function () {
                return this.id == boundID;
            })];
            if (opts) {
                jQuery(opts.$target.find('input[type="text"]').get(inputIndex)).val(val);
                if (opts.inputLength == 1) {
                    this.close();
                }
            }
            return this;
        };

        /**
         * need to user call method
         */
        this.open = (function () {

            var pickerContent = {
                '@fn': function (opts, optIdx, callBack) {
                    opts.content.call(opts, function (html) {
                        callBack(html);
                    });
                    return true;
                },
                'date': function (opts, optIdx) {

                    var html = [];
                    for (var i = 0; i < opts.inputLength; i++) {
                        html.push('<div '
                            + 'style="width:' + U.cssNumber(opts.content.width) + ';float:left;" '
                            + 'class="ax-picker-content-box" '
                            + 'data-calendar-target="' + i + '"></div>');
                        if (i < opts.inputLength - 1) html.push('<div style="width:' + opts.content.margin + 'px;float:left;height: 5px;"></div>');
                    }
                    html.push('<div style="clear:both;"></div>');
                    opts.pickerContent.html(html.join(''));

                    var calendarConfig = {
                        displayDate: (new Date()),
                        control: {
                            left: '<i class="fa fa-chevron-left"></i>',
                            yearTmpl: '%s',
                            monthTmpl: '%s',
                            right: '<i class="fa fa-chevron-right"></i>',
                            yearFirst: true
                        }
                    };

                    // calendar bind
                    opts.pickerContent.find('[data-calendar-target]').each(function (idx) {
                        // calendarConfig extend ~
                        var
                            dValue = opts.$target.find('input[type="text"]').get(idx).value,
                            d = ax5.util.date(dValue)
                            ;

                        calendarConfig.displayDate = d;
                        if (dValue) calendarConfig.selection = [d];
                        calendarConfig = jQuery.extend(true, calendarConfig, opts.content.config || {});
                        calendarConfig.target = this;
                        calendarConfig.onClick = function () {
                            self.setContentValue(opts.id, idx, this.date);
                        };

                        new ax5.ui.calendar(calendarConfig);
                    });

                }
            };

            return function (opts, optIdx, tryCount) {

                /**
                 * open picker from the outside
                 */
                if (U.isString(opts) && typeof optIdx == "undefined") {
                    optIdx = ax5.util.search(this.queue, function () {
                        return this.id == opts;
                    })
                    opts = this.queue[optIdx];
                    if (optIdx == -1) {
                        console.log(ax5.info.getError("ax5picker", "402", "open"));
                        return this;
                    }
                }

                /**
                 다른 피커가 있는 경우와 다른 피커를 닫고 다시 오픈 명령이 내려진 경우에 대한 예외 처리 구문

                 */
                if (this.openTimer) clearTimeout(this.openTimer);
                if (this.activePicker) {
                    if (this.activePickerQueueIndex == optIdx) {
                        return this;
                    }

                    if (tryCount > 2) return this;
                    this.close();
                    this.openTimer = setTimeout((function () {
                        this.open(opts, optIdx, (tryCount || 0) + 1);
                    }).bind(this), cfg.animateTime);
                    return this;
                }

                this.activePicker = jQuery(ax5.mustache.render(this.__getTmpl(opts, optIdx), opts));
                this.activePickerQueueIndex = optIdx;
                opts.pickerContent = this.activePicker.find('[data-picker-els="contents"]');

                if (U.isFunction(opts.content)) {
                    // 함수타입
                    opts.pickerContent.html("Loading..");
                    pickerContent["@fn"].call(this, opts, optIdx, function (html) {
                        opts.pickerContent.html(html);
                    });
                }
                else {
                    for (var key in pickerContent) {
                        if (opts.content.type == key) {
                            pickerContent[key].call(this, opts, optIdx);
                            break;
                        }
                    }
                }

                // bind event picker btns
                this.activePicker.find("[data-picker-btn]").on(cfg.clickEventName, (function (e) {
                    this.__onBtnClick(e || window.event, opts, optIdx);
                }).bind(this));

                self.__alignPicker("append");
                jQuery(window).bind("resize.ax5picker", function () {
                    self.__alignPicker();
                });

                // bind key event
                jQuery(window).bind("keyup.ax5picker", function (e) {
                    e = e || window.event;
                    self.__onBodyKeyup(e);
                    try {
                        if (e.preventDefault) e.preventDefault();
                        if (e.stopPropagation) e.stopPropagation();
                        e.cancelBubble = true;
                    } catch (e) {

                    }
                    return false;
                });

                jQuery(window).bind("click.ax5picker", function (e) {
                    e = e || window.event;
                    self.__onBodyClick(e);
                    try {
                        if (e.preventDefault) e.preventDefault();
                        if (e.stopPropagation) e.stopPropagation();
                        e.cancelBubble = true;
                    } catch (e) {

                    }
                    return false;
                });

                if (opts && opts.onStateChanged) {
                    var that = {
                        state: "open",
                        self: this,
                        boundObject: opts
                    };
                    opts.onStateChanged.call(that, that);
                }

                return this;
            };
        })();

        this.close = function () {
            if (this.closeTimer) clearTimeout(this.closeTimer);
            if (!this.activePicker) return this;

            var
                opts = this.queue[this.activePickerQueueIndex]
                ;

            this.activePicker.addClass("destroy");
            jQuery(window).unbind("resize.ax5picker");
            jQuery(window).unbind("click.ax5picker");
            jQuery(window).unbind("keyup.ax5picker");

            this.closeTimer = setTimeout((function () {
                if (this.activePicker) this.activePicker.remove();
                this.activePicker = null;
                this.activePickerQueueIndex = -1;
                if (opts && opts.onStateChanged) {
                    var that = {
                        state: "close"
                    };
                    opts.onStateChanged.call(that, that);
                }
            }).bind(this), cfg.animateTime);

            return this;
        };

        /* private */
        this.__alignPicker = function (append) {
            if (!this.activePicker) return this;

            var
                opts = this.queue[this.activePickerQueueIndex],
                pos = {},
                dim = {};

            if (append) jQuery(document.body).append(this.activePicker);

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
                this.activePicker
                    .addClass("direction-" + opts.direction);
            }
            this.activePicker
                .css((function () {
                    if (opts.direction == "top") {
                        return {
                            left: pos.left + dim.width / 2 - this.activePicker.outerWidth() / 2,
                            top: pos.top + dim.height + 12
                        }
                    }
                    else if (opts.direction == "bottom") {
                        return {
                            left: pos.left + dim.width / 2 - this.activePicker.outerWidth() / 2,
                            top: pos.top - this.activePicker.outerHeight() - 12
                        }
                    }
                    else if (opts.direction == "left") {
                        return {
                            left: pos.left + dim.width + 12,
                            top: pos.top - dim.height / 2
                        }
                    }
                    else if (opts.direction == "right") {
                        return {
                            left: pos.left - this.activePicker.outerWidth() - 12,
                            top: pos.top - dim.height / 2
                        }
                    }
                }).call(this));
        };

        this.__onBodyClick = function (e, target) {
            if (!this.activePicker) return this;

            var
                opts = this.queue[this.activePickerQueueIndex]
                ;

            target = U.findParentNode(e.target, function (target) {
                if (target.getAttribute("data-picker-els"))
                {
                    return true;
                }
                else if (opts.$target.get(0) == target) {
                    return true;
                }
            });
            if (!target)
            {
                //console.log("i'm not picker");
                this.close();
                return this;
            }
            //console.log("i'm picker");
            return this;
        };

        this.__onBtnClick = function (e, target) {
            // console.log('btn click');
            if (e.srcElement) e.target = e.srcElement;

            target = U.findParentNode(e.target, function (target) {
                if (target.getAttribute("data-picker-btn")) {
                    return true;
                }
            });

            if (target) {
                let
                    opts = this.queue[this.activePickerQueueIndex],
                    k = target.getAttribute("data-picker-btn")
                    ;

                if (opts.btns && opts.btns[k].onClick) {
                    let that = {
                        key: k,
                        value: opts.btns[k],
                        self: this,
                        boundObject: opts
                    };
                    opts.btns[k].onClick.call(that, k);
                }
                else {
                    this.close();
                }
            }
        };

        this.__onBodyKeyup = function (e) {
            if (e.keyCode == ax5.info.eventKeys.ESC) {
                this.close();
            }
        };

        // 클래스 생성자
        this.main = (function () {
            if (arguments && U.isObject(arguments[0])) {
                this.setConfig(arguments[0]);
            }
        }).apply(this, arguments);
    };
    //== UI Class

    root.picker = (function () {
        if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
        return axClass;
    })(); // ax5.ui에 연결

})(ax5.ui, ax5.ui.root);

ax5.ui.picker_instance = new ax5.ui.picker();

$.fn.ax5picker = (function () {
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
    }
})();