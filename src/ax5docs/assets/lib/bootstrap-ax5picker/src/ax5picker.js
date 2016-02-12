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
            width: 300,
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

                    if (opts.content.config) jQuery.extend(true, config, opts.content.config);
                    this.queue[optIdx] = jQuery.extend(true, this.queue[optIdx], config);
                },
                'date': function (opts, optIdx) {
                    // 1. 이벤트 바인딩
                    // 2. ui 준비

                    var
                        calendarWidth = 270,
                        calendarMargin = 10,
                        config = {},
                        inputLength = opts.$target.find('input[type="text"]').length;

                    if (inputLength == 1) {
                        // single date
                        config = {
                            contentWidth: calendarWidth,
                            width: calendarWidth,
                            height: calendarWidth,
                            margin: 0,
                            inputLength: 1
                        }
                    }
                    else {
                        // multi date
                        config = {
                            contentWidth: (calendarWidth * inputLength) + ((inputLength - 1) * calendarMargin),
                            width: calendarWidth,
                            height: calendarWidth,
                            margin: calendarMargin,
                            inputLength: inputLength
                        }
                    }

                    this.queue[optIdx] = jQuery.extend(true, this.queue[optIdx], config);

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
                    .bind('focus.ax5picker', pickerEvent.focus.bind(this, opts, optIdx));

                opts.$target
                    .find('.input-group-addon')
                    .unbind('click.ax5picker')
                    .bind('click.ax5picker', pickerEvent.click.bind(this, opts, optIdx));

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
                            + 'style="width:' + U.cssNumber(opts.width) + ';float:left;" '
                            + 'class="ax-picker-content-box" '
                            + 'data-calendar-target="' + i + '"></div>');
                        if (i < opts.inputLength - 1) html.push('<div style="width:' + opts.margin + 'px;float:left;height: 5px;"></div>');
                    }
                    html.push('<div style="clear:both;"></div>');
                    pickerContents.html(html.join(''));

                    // calendar bind
                    pickerContents.find('[data-calendar-target]').each(function () {

                        new ax5.ui.calendar({
                            target: this,
                            displayDate: (new Date()),
                            control: {
                                left: '<i class="fa fa-chevron-left"></i>',
                                yearTmpl: '%s',
                                monthTmpl: '%s',
                                right: '<i class="fa fa-chevron-right"></i>',
                                yearFirst: true
                            },
                            onClick: function () {
                                console.log(this);
                            },
                            onStateChanged: function () {

                            }
                        });
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
                var pickerContents = this.activePicker.find('[data-modal-els="contents"]');

                // fill picker content
                var callBack = function (content) {
                    pickerContents.html(content);
                };

                // 함수타입
                if (U.isFunction(opts.content)) {
                    pickerContents.html("Loading..");
                    pickerContent["@fn"].call(this, opts, optIdx, callBack);
                }
                else {
                    for (var key in pickerContent) {
                        if (opts.content.type == key) {
                            pickerContent[key].call(this, opts, optIdx, pickerContents);
                            break;
                        }
                    }
                }

                self.__alignPicker(opts, optIdx, "append");

                // unbind close
                jQuery(window).bind("resize.ax5picker", function () {
                    self.__alignPicker(opts, optIdx);
                });

                return this;
            };
        })();

        this.close = function () {

            jQuery(window).unbind("resize.ax5picker");
        };

        /* private */
        this.__alignPicker = function (opts, optIdx, append) {
            var
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