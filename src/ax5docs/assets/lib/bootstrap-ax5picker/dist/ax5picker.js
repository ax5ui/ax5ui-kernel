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

        /*
        this.config.btns = {
            ok: {label: this.config.lang["ok"], theme: this.config.theme}
        };
        */

        this.activePicker = null;
        this.activePickerQueueIndex = -1;

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
            var pickerConfig = {};
            jQuery.extend(true, pickerConfig, cfg);
            if (opts) jQuery.extend(true, pickerConfig, opts);
            opts = pickerConfig;

            if (!opts.target) {
                console.log(ax5.info.getError("ax5picker", "401", "bind"));
                return this;
            }
            opts.$target = jQuery(opts.target);

            if (!opts.id) {
                opts.id = 'ax5-picker-' + ax5.getGuid();
            }

            if (U.search(this.queue, function () {
                    return this.id == opts.id;
                }) === -1)
            {
                this.queue.push(opts);
                this.bindPickerTarget(opts, this.queue.length - 1);
            }

            return this;
        };

        this.bindPickerTarget = (function () {

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

                    console.log(this.queue[optIdx]);

                    this.queue[optIdx] = jQuery.extend(true, config, opts);

                    console.log(this.queue[optIdx]);
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
                    .bind('focus.ax5picker', pickerEvent.focus.bind(this, this.queue[optIdx], optIdx));

                opts.$target
                    .find('.input-group-addon')
                    .unbind('click.ax5picker')
                    .bind('click.ax5picker', pickerEvent.click.bind(this, this.queue[optIdx], optIdx));

                return this;
            }

        })();

        this.getTmpl = function (opts, optIdx) {
            // console.log(opts);
            return `
            <div class="ax5-ui-picker {{theme}}" id="{{id}}">
                {{#title}}
                    <div class="ax-picker-heading">{{title}}</div>
                {{/title}}
                <div class="ax-picker-body">
                    <div class="ax-picker-contents" data-modal-els="contents" style="width:{{contentWidth}}px;"></div>
                    {{#btns}}
                        <div class="ax-picker-buttons">
                        {{#btns}}
                            {{#@each}}
                            <button data-ax-picker-btn="{{@key}}" class="btn btn-default {{@value.theme}}">{{@value.label}}</button>
                            {{/@each}}
                        {{/btns}}
                        </div>
                    {{/btns}}
                </div>
                <div class="ax-picker-arrow"></div>
            </div>
            `;
        };

        this.setContentValue = function (bindId, inputIndex, val) {
            var opts = this.queue[ax5.util.search(this.queue, function () {
                return this.id == bindId;
            })];
            if (opts) {
                jQuery(opts.$target.find('input[type="text"]').get(inputIndex)).val(val);

                if (opts.inputLength == 1) {
                    this.close();
                }
            }
        };

        this.open = (function () {

            var pickerContent = {
                '@fn': function (opts, optIdx, callBack) {
                    opts.content.call(opts, function (html) {
                        callBack(html);
                    });
                    return true;
                },
                'date': function (opts, optIdx, pickerContents) {

                    var html = [];
                    for (var i = 0; i < opts.inputLength; i++) {
                        html.push('<div '
                            + 'style="width:' + U.cssNumber(opts.content.width) + ';float:left;" '
                            + 'class="ax-picker-content-box" '
                            + 'data-calendar-target="' + i + '"></div>');
                        if (i < opts.inputLength - 1) html.push('<div style="width:' + opts.content.margin + 'px;float:left;height: 5px;"></div>');
                    }
                    html.push('<div style="clear:both;"></div>');
                    pickerContents.html(html.join(''));

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
                    pickerContents.find('[data-calendar-target]').each(function (idx) {
                        // calendarConfig extend ~
                        calendarConfig.displayDate = ax5.util.date(opts.$target.find('input[type="text"]').get(idx).value);
                        calendarConfig = jQuery.extend(true, calendarConfig, opts.content.config || {});
                        calendarConfig.target = this;
                        calendarConfig.onClick = function () {
                            self.setContentValue(opts.id, idx, this.date);
                        };

                        new ax5.ui.calendar(calendarConfig);
                    });

                }
            };

            return function (opts, optIdx) {

                if (this.activePicker) {
                    return this;
                    this.activePicker.remove();
                    this.activePicker = null;
                }
                this.activePicker = jQuery(ax5.mustache.render(this.getTmpl(opts, optIdx), opts));
                this.activePickerQueueIndex = optIdx;
                var pickerContents = this.activePicker.find('[data-modal-els="contents"]');

                if (U.isFunction(opts.content)) {
                    // 함수타입
                    pickerContents.html("Loading..");
                    pickerContent["@fn"].call(this, opts, optIdx, function (html) {
                        pickerContents.html(html);
                    });
                }
                else {
                    for (var key in pickerContent) {
                        if (opts.content.type == key) {
                            pickerContent[key].call(this, opts, optIdx, pickerContents);
                            break;
                        }
                    }
                }

                self.__alignPicker("append");

                // unbind close
                jQuery(window).bind("resize.ax5picker", function () {
                    self.__alignPicker();
                });

                return this;
            };
        })();

        this.close = function () {
            if (!this.activePicker) return this;

            var
                opts = this.queue[this.activePickerQueueIndex]
                ;

            this.activePicker.addClass("destroy");
            jQuery(window).unbind("resize.ax5picker");

            setTimeout((function () {
                this.activePicker.remove();
                this.activePicker = null;
                this.activePickerQueueIndex = -1;
                if (opts && opts.onStateChanged) {
                    that = {
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