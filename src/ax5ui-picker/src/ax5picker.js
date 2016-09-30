// ax5.ui.picker
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var PICKER;

    UI.addClass({
        className: "picker",
        version: "0.8.0"
    }, (function () {
        /**
         * @class ax5picker
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```js
         * ax5.def.picker.date_leftArrow = '<i class="fa fa-chevron-left"></i>';
         * ax5.def.picker.date_yearTmpl = '%s';
         * ax5.def.picker.date_monthTmpl = '%s';
         * def.picker.date_rightArrow = '<i class="fa fa-chevron-right"></i>';
         *
         * var picker = new ax5.ui.picker({
         *     onStateChanged: function () {
         *         console.log(this);
         *     }
         * });
         *
         * picker.bind({
         *     target: $('[data-picker-date]'),
         *     direction: "auto",
         *     content: {
         *         type: 'date',
         *         formatter: {
         *             pattern: 'date'
         *         }
         *     }
         * });
         * ```
         */
        var ax5picker = function () {
            var
                self = this,
                cfg;

            this.instanceId = ax5.getGuid();
            this.config = {
                clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
                theme: 'default',
                title: '',
                lang: {
                    "ok": "ok",
                    "cancel": "cancel"
                },
                animateTime: 100,
                calendar: {
                    control: {
                        left: ax5.def.picker.date_leftArrow || '&#x02190',
                        yearTmpl: ax5.def.picker.date_yearTmpl || '%s',
                        monthTmpl: ax5.def.picker.date_monthTmpl || '%s',
                        right: ax5.def.picker.date_rightArrow || '&#x02192',
                        yearFirst: true
                    }
                }
            };
            this.queue = [];
            this.activePicker = null;
            this.activePickerQueueIndex = -1;
            this.openTimer = null;
            this.closeTimer = null;

            cfg = this.config;

            var
                onStateChanged = function (item, that) {
                    if (item && item.onStateChanged) {
                        item.onStateChanged.call(that, that);
                    }
                    else if (this.onStateChanged) {
                        this.onStateChanged.call(that, that);
                    }
                    return true;
                },
                bindPickerTarget = (function () {

                    var pickerEvent = {
                        'focus': function (queIdx, e) {
                            this.open(queIdx);
                        },
                        'click': function (queIdx, e) {
                            this.open(queIdx);
                        }
                    };

                    var pickerType = {
                        '@fn': function (queIdx, _input) {
                            var item = this.queue[queIdx],
                                inputLength = _input.length,
                                config = {
                                    inputLength: inputLength || 1
                                };

                            if (inputLength > 1) {
                                config.btns = {
                                    ok: {label: cfg.lang["ok"], theme: cfg.theme}
                                };
                            }

                            this.queue[queIdx] = jQuery.extend(true, config, item);

                            config = null;
                            inputLength = null;
                        },
                        'date': function (queIdx, _input) {
                            // 1. 이벤트 바인딩
                            // 2. ui 준비

                            var item = this.queue[queIdx],
                                contentWidth = (item.content) ? item.content.width || 270 : 270,
                                contentMargin = (item.content) ? item.content.margin || 5 : 5,
                                inputLength = _input.length,
                                config = {
                                    contentWidth: (contentWidth * inputLength) + ((inputLength - 1) * contentMargin),
                                    content: {width: contentWidth, margin: contentMargin},
                                    inputLength: inputLength || 1
                                };

                            if (inputLength > 1 && !item.btns) {
                                config.btns = {
                                    ok: {label: cfg.lang["ok"], theme: cfg.theme}
                                };
                            }

                            this.queue[queIdx] = jQuery.extend(true, config, item);

                            contentWidth = null;
                            contentMargin = null;
                            config = null;
                            inputLength = null;
                        },
                        'secure-num': function (queIdx, _input) {
                            var item = this.queue[queIdx],
                                inputLength = _input.length,
                                config = {
                                    inputLength: inputLength || 1
                                };

                            this.queue[queIdx] = jQuery.extend(true, config, item);

                            config = null;
                            inputLength = null;
                        },
                        'keyboard': function (queIdx, _input) {
                            var item = this.queue[queIdx],
                                inputLength = _input.length,
                                config = {
                                    inputLength: inputLength || 1
                                };

                            this.queue[queIdx] = jQuery.extend(true, config, item);

                            config = null;
                            inputLength = null;
                        },
                        'numpad': function (queIdx, _input) {
                            var item = this.queue[queIdx],
                                inputLength = _input.length,
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
                            input;

                        if (!item.content) {
                            console.log(ax5.info.getError("ax5picker", "501", "bind"));
                            return this;
                        }

                        input = (item.$target.get(0).tagName.toUpperCase() == "INPUT") ? item.$target : item.$target.find('input[type]');

                        // 함수타입
                        if (U.isFunction(item.content)) {
                            pickerType["@fn"].call(this, queIdx, input);
                        }
                        else {
                            for (var key in pickerType) {
                                if (item.content.type == key) {
                                    pickerType[key].call(this, queIdx, input);
                                    break;
                                }
                            }
                        }

                        input
                            .unbind('focus.ax5picker')
                            .unbind('click.ax5picker')
                            .bind('focus.ax5picker', pickerEvent.focus.bind(this, queIdx))
                            .bind('click.ax5picker', pickerEvent.click.bind(this, queIdx));

                        item.$target
                            .find('.input-group-addon')
                            .unbind('click.ax5picker')
                            .bind('click.ax5picker', pickerEvent.click.bind(this, queIdx));

                        if (item.content.formatter && ax5.ui.formatter) {
                            input.ax5formatter(item.content.formatter);
                        }

                        input = null;
                        item = null;
                        queIdx = null;
                        return this;
                    }

                })(),

                alignPicker = function (append) {
                    if (!this.activePicker) return this;

                    var _alignPicker = function (item) {
                        var $window = jQuery(window), $body = jQuery(document.body);
                        var pos = {}, positionMargin = 12,
                            dim = {}, pickerDim = {},
                            pickerDirection;

                        pos = item.$target.offset();
                        dim = {
                            width: item.$target.outerWidth(),
                            height: item.$target.outerHeight()
                        };
                        pickerDim = {
                            winWidth: Math.max($window.width(), $body.width()),
                            winHeight: Math.max($window.height(), $body.height()),
                            width: this.activePicker.outerWidth(),
                            height: this.activePicker.outerHeight()
                        };

                        // picker css(width, left, top) & direction 결정
                        if (!item.direction || item.direction === "" || item.direction === "auto") {
                            // set direction
                            pickerDirection = "top";
                            if (pos.top - pickerDim.height - positionMargin < 0) {
                                pickerDirection = "top";
                            } else if (pos.top + dim.height + pickerDim.height + positionMargin > pickerDim.winHeight) {
                                pickerDirection = "bottom";
                            }
                        } else {
                            pickerDirection = item.direction;
                        }

                        if (append) {
                            this.activePicker
                                .addClass("direction-" + pickerDirection);
                        }

                        var positionCSS = (function () {
                            var css = {left: 0, top: 0};
                            switch (pickerDirection) {
                                case "top":
                                    css.left = pos.left + dim.width / 2 - pickerDim.width / 2;
                                    css.top = pos.top + dim.height + positionMargin;
                                    break;
                                case "bottom":
                                    css.left = pos.left + dim.width / 2 - pickerDim.width / 2;
                                    css.top = pos.top - pickerDim.height - positionMargin;
                                    break;
                                case "left":
                                    css.left = pos.left + dim.width + positionMargin;
                                    css.top = pos.top - pickerDim.height / 2 + dim.height / 2;
                                    break;
                                case "right":
                                    css.left = pos.left - pickerDim.width - positionMargin;
                                    css.top = pos.top - pickerDim.height / 2 + dim.height / 2;
                                    break;
                            }
                            return css;
                        })();

                        (function () {
                            if (pickerDirection == "top" || pickerDirection == "bottom") {
                                if (positionCSS.left < 0) {
                                    positionCSS.left = positionMargin;
                                    this.activePickerArrow.css({left: (pos.left + dim.width / 2) - positionCSS.left});
                                } else if (positionCSS.left + pickerDim.width > pickerDim.winWidth) {
                                    positionCSS.left = pickerDim.winWidth - pickerDim.width - positionMargin;
                                    this.activePickerArrow.css({left: (pos.left + dim.width / 2) - positionCSS.left});
                                }
                            }
                        }).call(this);

                        this.activePicker
                            .css(positionCSS);
                    };

                    var item = this.queue[this.activePickerQueueIndex];

                    if (append) jQuery(document.body).append(this.activePicker);
                    setTimeout((function () {
                        _alignPicker.call(this, item);
                    }).bind(this));

                },
                onBodyClick = function (e, target) {
                    if (!this.activePicker) return this;

                    var
                        item = this.queue[this.activePickerQueueIndex]
                        ;

                    target = U.findParentNode(e.target, function (target) {
                        if (target.getAttribute("data-picker-els")) {
                            return true;
                        }
                        else if (item.$target.get(0) == target) {
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
                onBtnClick = function (e, target) {
                    // console.log('btn click');
                    if (e.srcElement) e.target = e.srcElement;

                    target = U.findParentNode(e.target, function (target) {
                        if (target.getAttribute("data-picker-btn")) {
                            return true;
                        }
                    });

                    if (target) {
                        let
                            item = this.queue[this.activePickerQueueIndex],
                            k = target.getAttribute("data-picker-btn")
                            ;

                        if (item.btns && item.btns[k].onClick) {
                            let that = {
                                key: k,
                                value: item.btns[k],
                                self: this,
                                item: item
                            };
                            item.btns[k].onClick.call(that, k);
                        }
                        else {
                            this.close();
                        }
                    }
                },
                onBodyKeyup = function (e) {
                    if (e.keyCode == ax5.info.eventKeys.ESC) {
                        this.close();
                    }
                },
                getQueIdx = function (boundID) {
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
             * @method ax5picker.setConfig
             * @param {Object} config - 클래스 속성값
             * @returns {ax5picker}
             * @example
             * ```
             * ```
             */
            this.init = function () {
                this.onStateChanged = cfg.onStateChanged;
            };

            this.bind = function (item) {
                var
                    pickerConfig = {},
                    queIdx;

                item = jQuery.extend(true, pickerConfig, cfg, item);

                if (!item.target) {
                    console.log(ax5.info.getError("ax5picker", "401", "bind"));
                    return this;
                }
                item.$target = jQuery(item.target);

                if (!item.$target.get(0)) {
                    console.log(ax5.info.getError("ax5picker", "401", "bind"));
                    return this;
                }

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
                }
                else {
                    this.queue[queIdx] = jQuery.extend(true, {}, this.queue[queIdx], item);
                    bindPickerTarget.call(this, queIdx);
                }

                pickerConfig = null;
                queIdx = null;
                return this;
            };

            /**
             * @method ax5picker.setContentValue
             * @param {String} boundID
             * @param {Number} inputIndex
             * @param {String} val
             * @returns {ax5picker} this
             */
            this.setContentValue = function (boundID, inputIndex, val) {
                var queIdx = (U.isNumber(boundID)) ? boundID : getQueIdx.call(this, boundID);
                var item = this.queue[queIdx];
                var _input;

                if (item) {

                    _input = (item.$target.get(0).tagName.toUpperCase() == "INPUT") ? item.$target : jQuery(item.$target.find('input[type]').get(inputIndex));
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
             * @method ax5picker.open
             * @param {String} boundObjectId
             * @returns {ax5picker} this
             */
            this.open = (function () {

                var pickerContent = {
                    '@fn': function (queIdx, callback) {
                        var item = this.queue[queIdx];
                        item.content.call(item, function (html) {
                            callback(html);
                        });
                        return true;
                    },
                    'date': function (queIdx) {
                        var item = this.queue[queIdx];
                        var html = [];
                        for (var i = 0; i < item.inputLength; i++) {
                            html.push('<div '
                                + 'style="width:' + U.cssNumber(item.content.width) + ';float:left;" '
                                + 'class="ax-picker-content-box" '
                                + 'data-calendar-target="' + i + '"></div>');
                            if (i < item.inputLength - 1) html.push('<div style="width:' + item.content.margin + 'px;float:left;height: 5px;"></div>');
                        }
                        html.push('<div style="clear:both;"></div>');
                        item.pickerContent.html(html.join(''));

                        var calendarConfig = jQuery.extend({}, cfg.calendar, {displayDate: (new Date())});
                        var input = (item.$target.get(0).tagName.toUpperCase() == "INPUT") ? item.$target : item.$target.find('input[type]');

                        // calendar bind
                        item.pickerContent.find('[data-calendar-target]').each(function () {

                            // calendarConfig extend ~
                            var
                                idx = this.getAttribute("data-calendar-target"),
                                dValue = input.get(idx).value,
                                d = ax5.util.date(dValue)
                                ;

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
                    'secure-num': function (queIdx) {
                        var item = this.queue[queIdx];
                        var html = [];
                        for (var i = 0; i < item.inputLength; i++) {
                            html.push('<div '
                                + 'style="width:' + U.cssNumber(item.content.width) + ';float:left;" '
                                + 'class="ax-picker-content-box" '
                                + 'data-secure-num-target="' + i + '"></div>');
                            if (i < item.inputLength - 1) html.push('<div style="width:' + item.content.margin + 'px;float:left;height: 5px;"></div>');
                        }
                        html.push('<div style="clear:both;"></div>');
                        item.pickerContent.html(html.join(''));

                        // secure-num bind
                        item.pickerContent.find('[data-secure-num-target]').each(function () {
                            var idx = this.getAttribute("data-secure-num-target"),
                                po = [];

                            var numArray = (function (a) {
                                var j, x, i;
                                for (i = a.length; i; i -= 1) {
                                    j = Math.floor(Math.random() * i);
                                    x = a[i - 1];
                                    a[i - 1] = a[j];
                                    a[j] = x;
                                }
                                return a;
                            })([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

                            var specialArray = [
                                {label: "&#x02190", fn: "back"}, {label: "C", fn: "clear"}
                            ];

                            numArray.forEach(function (n) {
                                po.push('<div style="float:left;' + item.content.config.btnWrapStyle + '">');
                                po.push('<button class="btn btn-default btn-' + item.content.config.btnTheme + '" '
                                    + 'style="' + item.content.config.btnStyle + '" data-secure-num-value="' + n + '">' + n + '</button>');
                                po.push('</div>');
                            });
                            specialArray.forEach(function (n) {
                                po.push('<div style="float:left;' + item.content.config.btnWrapStyle + '">');
                                po.push('<button class="btn btn-default btn-' + item.content.config.specialBtnTheme + '" '
                                    + 'style="' + item.content.config.btnStyle + '" data-secure-num-value="' + n.fn + '">' + n.label + '</button>');
                                po.push('</div>');
                            });

                            po.push('<div style="clear:both;"></div>');

                            $(this).html(po.join('')).on("click", '[data-secure-num-value]', function () {
                                var act = this.getAttribute("data-secure-num-value");
                                var _input = (item.$target.get(0).tagName.toUpperCase() == "INPUT") ? item.$target : jQuery(item.$target.find('input[type]').get(idx));
                                var val = _input.val();

                                if (act == "back") {
                                    _input.val(val.substring(0, val.length - 1));
                                }
                                else if (act == "clear") {
                                    _input.val('');
                                }
                                else {
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
                    },
                    'keyboard': function (queIdx) {
                        var item = this.queue[queIdx];
                        var html = [];
                        for (var i = 0; i < item.inputLength; i++) {
                            html.push('<div '
                                + 'style="width:' + U.cssNumber(item.content.width) + ';float:left;" '
                                + 'class="ax-picker-content-box" '
                                + 'data-keyboard-target="' + i + '"></div>');
                            if (i < item.inputLength - 1) html.push('<div style="width:' + item.content.margin + 'px;float:left;height: 5px;"></div>');
                        }
                        html.push('<div style="clear:both;"></div>');
                        item.pickerContent.html(html.join(''));

                        var keyArray = [
                            [
                                {value: "`", shiftValue: "~"},
                                {value: "1", shiftValue: "!"},
                                {value: "2", shiftValue: "@"},
                                {value: "3", shiftValue: "#"},
                                {value: "4", shiftValue: "$"},
                                {value: "5", shiftValue: "%"},
                                {value: "6", shiftValue: "^"},
                                {value: "7", shiftValue: "&"},
                                {value: "8", shiftValue: "*"},
                                {value: "9", shiftValue: "("},
                                {value: "0", shiftValue: ")"},
                                {value: "-", shiftValue: "_"},
                                {value: "=", shiftValue: "+"},
                                {label: "&#x02190", fn: "back"}
                            ],
                            [
                                {value: "q", shiftValue: "Q"},
                                {value: "w", shiftValue: "W"},
                                {value: "e", shiftValue: "E"},
                                {value: "r", shiftValue: "R"},
                                {value: "t", shiftValue: "T"},
                                {value: "y", shiftValue: "Y"},
                                {value: "u", shiftValue: "U"},
                                {value: "i", shiftValue: "I"},
                                {value: "o", shiftValue: "O"},
                                {value: "p", shiftValue: "P"},
                                {value: "[", shiftValue: "{"},
                                {value: "]", shiftValue: "}"},
                                {value: "\\", shiftValue: "|"}
                            ],
                            [
                                {label: "Clear", fn: "clear"},
                                {value: "a", shiftValue: "A"},
                                {value: "s", shiftValue: "S"},
                                {value: "d", shiftValue: "D"},
                                {value: "f", shiftValue: "F"},
                                {value: "g", shiftValue: "G"},
                                {value: "h", shiftValue: "H"},
                                {value: "j", shiftValue: "J"},
                                {value: "k", shiftValue: "K"},
                                {value: "l", shiftValue: "L"},
                                {value: ";", shiftValue: ":"},
                                {value: "'", shiftValue: "\""}


                            ],
                            [
                                {label: "Shift", fn: "shift"},
                                {value: "z", shiftValue: "Z"},
                                {value: "x", shiftValue: "X"},
                                {value: "c", shiftValue: "C"},
                                {value: "v", shiftValue: "V"},
                                {value: "b", shiftValue: "B"},
                                {value: "n", shiftValue: "N"},
                                {value: "m", shiftValue: "M"},
                                {value: ",", shiftValue: "<"},
                                {value: ".", shiftValue: ">"},
                                {value: "/", shiftValue: "?"},
                                {label: "Close", fn: "close"}
                            ]
                        ];
                        var specialArray = [
                            {label: "&#x02190", fn: "back"}, {label: "C", fn: "clear"}
                        ];

                        var getKeyBoard = function (isShiftKey) {
                            var po = [];
                            keyArray.forEach(function (row) {
                                po.push('<div style="display: table;margin:0 auto;">');
                                row.forEach(function (n) {

                                    var keyValue, keyLabel, btnWrapStyle, btnTheme, btnStyle;
                                    if (n.fn) {
                                        keyValue = n.fn;
                                        keyLabel = n.label;
                                        btnWrapStyle = item.content.config.specialBtnWrapStyle;
                                        btnTheme = item.content.config.specialBtnTheme;
                                        btnStyle = item.content.config.specialBtnStyle;
                                    } else {
                                        keyLabel = keyValue = ((isShiftKey) ? n.shiftValue : n.value);
                                        btnWrapStyle = item.content.config.btnWrapStyle;
                                        btnTheme = item.content.config.btnTheme;
                                        btnStyle = item.content.config.btnStyle;
                                    }

                                    po.push('<div style="display: table-cell;' + btnWrapStyle + '">');
                                    po.push('<button class="btn btn-default btn-' + btnTheme + '" '
                                        + 'style="' + btnStyle + '" data-keyboard-value="' + keyValue + '">' + keyLabel + '</button>');
                                    po.push('</div>');
                                });
                                po.push('</div>');
                            });
                            return po.join('');
                        };

                        // secure-num bind
                        item.pickerContent.find('[data-keyboard-target]').each(function () {
                            var idx = this.getAttribute("data-keyboard-target");
                            var $this = $(this);
                            var isShiftKey = false;
                            var toggleShift = function () {
                                isShiftKey = !isShiftKey;
                                $this.html(getKeyBoard(isShiftKey));
                            };
                            $this.html(getKeyBoard(isShiftKey)).on("mousedown", '[data-keyboard-value]', function () {
                                var act = this.getAttribute("data-keyboard-value");
                                var _input = (item.$target.get(0).tagName.toUpperCase() == "INPUT") ? item.$target : jQuery(item.$target.find('input[type]').get(idx));
                                var val = _input.val();

                                switch (act) {
                                    case "back":
                                        _input.val(val.substring(0, val.length - 1));
                                        break;
                                    case "clear":
                                        _input.val('');
                                        break;
                                    case "shift":
                                        toggleShift();
                                        return false;
                                        break;
                                    case "close":
                                        self.close();
                                        return false;
                                        break;
                                    default:
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
                    },
                    'numpad': function (queIdx) {
                        var item = this.queue[queIdx];
                        var html = [];
                        for (var i = 0; i < item.inputLength; i++) {
                            html.push('<div '
                                + 'style="width:' + U.cssNumber(item.content.width) + ';float:left;" '
                                + 'class="ax-picker-content-box" '
                                + 'data-numpad-target="' + i + '"></div>');
                            if (i < item.inputLength - 1) html.push('<div style="width:' + item.content.margin + 'px;float:left;height: 5px;"></div>');
                        }
                        html.push('<div style="clear:both;"></div>');
                        item.pickerContent.html(html.join(''));

                        // secure-num bind
                        item.pickerContent.find('[data-numpad-target]').each(function () {
                            var idx = this.getAttribute("data-numpad-target"),
                                po = [];

                            var keyArray = item.content.config.keyArray || [
                                    {value: "7"},
                                    {value: "8"},
                                    {value: "9"},
                                    {label: "BS", fn: "back"},
                                    {value: "4"},
                                    {value: "5"},
                                    {value: "6"},
                                    {label: "CLS", fn: "clear"},
                                    {value: "1"},
                                    {value: "2"},
                                    {value: "3"},
                                    {value: ""},
                                    {value: "."},
                                    {value: "0"},
                                    {value: ""},
                                    {label: "OK", fn: "enter"}
                                ];

                            keyArray.forEach(function (n) {
                                var keyValue, keyLabel, btnWrapStyle, btnTheme, btnStyle;

                                if (n.fn) {
                                    keyValue = n.fn;
                                    keyLabel = n.label;
                                    btnTheme = item.content.config.specialBtnTheme;
                                    btnWrapStyle = item.content.config.specialBtnWrapStyle;
                                    btnStyle = item.content.config.specialBtnStyle;
                                } else {
                                    keyLabel = keyValue = n.value;
                                    btnTheme = (keyValue) ? item.content.config.btnTheme : "";
                                    btnWrapStyle = item.content.config.btnWrapStyle;
                                    btnStyle = item.content.config.btnStyle;
                                }

                                po.push('<div style="float:left;' + btnWrapStyle + '">');
                                po.push('<button class="btn btn-default btn-' + btnTheme + '" '
                                    + 'style="' + btnStyle + '" data-numpad-value="' + keyValue + '">' + (keyLabel || "&nbsp;") + '</button>');
                                po.push('</div>');
                            });

                            po.push('<div style="clear:both;"></div>');

                            $(this).html(po.join('')).on("mousedown", '[data-numpad-value]', function () {
                                var act = this.getAttribute("data-numpad-value");
                                var _input = (item.$target.get(0).tagName.toUpperCase() == "INPUT") ? item.$target : jQuery(item.$target.find('input[type]').get(idx));
                                var val = _input.val();
                                var state = "";

                                switch (act) {
                                    case "back":
                                        state = "changeValue";
                                        _input.val(val.substring(0, val.length - 1));
                                        break;
                                    case "clear":
                                        state = "changeValue";
                                        _input.val('');
                                        break;
                                    case "enter":
                                        self.close(item, "enter");
                                        return false;
                                        break;
                                    case "close":
                                        self.close();
                                        return false;
                                        break;
                                    default:
                                        state = "changeValue";
                                        _input.val(val + act);
                                }

                                onStateChanged.call(this, item, {
                                    self: self,
                                    state: state,
                                    item: item,
                                    value: _input.val()
                                });
                            });
                        });
                    }
                };

                return function (boundID, tryCount) {
                    var queIdx = (U.isNumber(boundID)) ? boundID : getQueIdx.call(this, boundID);
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
                        this.openTimer = setTimeout((function () {
                            this.open(queIdx, (tryCount || 0) + 1);
                        }).bind(this), cfg.animateTime);
                        return this;
                    }

                    this.activePicker = jQuery(PICKER.tmpl.get.call(this, "pickerTmpl", item));
                    this.activePickerArrow = this.activePicker.find(".ax-picker-arrow");
                    this.activePickerQueueIndex = queIdx;
                    item.pickerContent = this.activePicker.find('[data-picker-els="content"]');

                    if (U.isFunction(item.content)) {
                        // 함수타입
                        item.pickerContent.html("Loading..");
                        pickerContent["@fn"].call(this, queIdx, function (html) {
                            item.pickerContent.html(html);
                        });
                    }
                    else {
                        if (item.content.type in pickerContent) {
                            pickerContent[item.content.type].call(this, queIdx);
                        }
                    }

                    // bind event picker btns
                    this.activePicker.find("[data-picker-btn]").on(cfg.clickEventName, (function (e) {
                        onBtnClick.call(this, e || window.event, queIdx);
                    }).bind(this));


                    alignPicker.call(this, "append");

                    jQuery(window).bind("resize.ax5picker", (function () {
                        alignPicker.call(this);
                    }).bind(this));

                    // bind key event
                    jQuery(window).bind("keyup.ax5picker", (function (e) {
                        e = e || window.event;
                        onBodyKeyup.call(this, e);
                        U.stopEvent(e);
                    }).bind(this));

                    jQuery(window).bind("click.ax5picker", (function (e) {
                        e = e || window.event;
                        onBodyClick.call(this, e);
                        U.stopEvent(e);
                    }).bind(this));

                    onStateChanged.call(this, item, {
                        self: this,
                        state: "open",
                        item: item
                    });

                    return this;
                };
            })();

            /**
             * @method ax5picker.close
             * @returns {ax5picker} this
             */
            this.close = function (item, state) {
                if (this.closeTimer) clearTimeout(this.closeTimer);
                if (!this.activePicker) return this;

                item = this.queue[this.activePickerQueueIndex];

                this.activePicker.addClass("destroy");
                jQuery(window).unbind("resize.ax5picker");
                jQuery(window).unbind("click.ax5picker");
                jQuery(window).unbind("keyup.ax5picker");

                this.closeTimer = setTimeout((function () {
                    if (this.activePicker) this.activePicker.remove();
                    this.activePicker = null;
                    this.activePickerQueueIndex = -1;

                    onStateChanged.call(this, item, {
                        self: this,
                        state: state || "close"
                    });

                }).bind(this), cfg.animateTime);

                return this;
            };

            // 클래스 생성자
            this.main = (function () {
                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }).apply(this, arguments);
        };
        return ax5picker;
    })());

    PICKER = ax5.ui.picker;
})();

/**
 * ax5.ui.picker_instance
 * @type {ax5picker}
 * @example
 * ```js
 * // picker 기본 속성을 변경해야 한다면
 * ax5.ui.picker_instance.setConfig({
 * });
 *
 * ```
 */
ax5.ui.picker_instance = new ax5.ui.picker();

jQuery.fn.ax5picker = (function () {
    return function (config) {
        if (ax5.util.isString(arguments[0])) {
            var methodName = arguments[0];

            switch (methodName) {
                case "open":
                    return ax5.ui.picker_instance.open(this);
                    break;
                case "close":
                    return ax5.ui.picker_instance.close(this);
                    break;
                case "setValue":
                    return ax5.ui.picker_instance.setContentValue(this, arguments[1], arguments[2]);
                    break;
                default:
                    return this;
            }
        }
        else {
            if (typeof config == "undefined") config = {};
            jQuery.each(this, function () {
                var defaultConfig = {
                    target: this
                };
                config = jQuery.extend(true, config, defaultConfig);
                ax5.ui.picker_instance.bind(config);
            });
        }
        return this;
    };
})();