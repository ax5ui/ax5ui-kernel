"use strict";

// ax5.ui.formatter
(function (root, _SUPER_) {

    /**
     * @class ax5.ui.formatter
     * @classdesc
     * @version v0.0.1
     * @author tom@axisj.com
     * @example
     * ```
     * var formatter = new ax5.ui.formatter();
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
            animateTime: 250
        };

        this.openTimer = null;
        this.closeTimer = null;

        cfg = this.config;

        /**
         * Preferences of formatter UI
         * @method ax5.ui.formatter.setConfig
         * @param {Object} config - 클래스 속성값
         * @returns {ax5.ui.formatter}
         * @example
         * ```
         * ```
         */
        this.init = function () {};

        this.bind = function (opts) {
            var formatterConfig = {};
            jQuery.extend(true, formatterConfig, cfg);
            if (opts) jQuery.extend(true, formatterConfig, opts);
            opts = formatterConfig;

            if (!opts.target) {
                console.log(ax5.info.getError("ax5formatter", "401", "bind"));
                return this;
            }
            opts.$target = jQuery(opts.target);

            if (!opts.id) {
                opts.id = 'ax5-formatter-' + ax5.getGuid();
            }

            if (U.search(this.queue, function () {
                return this.id == opts.id;
            }) === -1) {
                this.queue.push(opts);
                this.__bindFormatterTarget(opts, this.queue.length - 1);
            }

            return this;
        };

        this.__bindFormatterTarget = function () {

            var ctrlKeys = {
                "18": "KEY_ALT",
                "8": "KEY_BACKSPACE",
                "17": "KEY_CONTROL",
                "46": "KEY_DELETE",
                "40": "KEY_DOWN",
                "35": "KEY_END",
                "187": "KEY_EQUAL",
                "27": "KEY_ESC",
                "36": "KEY_HOME",
                "45": "KEY_INSERT",
                "37": "KEY_LEFT",
                "189": "KEY_MINUS",
                "34": "KEY_PAGEDOWN",
                "33": "KEY_PAGEUP",
                "190": "KEY_PERIOD",
                "13": "KEY_RETURN",
                "39": "KEY_RIGHT",
                "16": "KEY_SHIFT",
                // "32": "KEY_SPACE",
                "9": "KEY_TAB",
                "38": "KEY_UP",
                "91": "KEY_WINDOW"
                //"107" : "NUMPAD_ADD",
                //"194" : "NUMPAD_COMMA",
                //"110" : "NUMPAD_DECIMAL",
                //"111" : "NUMPAD_DIVIDE",
                //"12" : "NUMPAD_EQUAL",
                //"106" : "NUMPAD_MULTIPLY",
                //"109" : "NUMPAD_SUBTRACT"
            };

            var numKeys = {
                '48': 1, '49': 1, '50': 1, '51': 1, '52': 1, '53': 1, '54': 1, '55': 1, '56': 1, '57': 1,
                '96': 1, '97': 1, '98': 1, '99': 1, '100': 1, '101': 1, '102': 1, '103': 1, '104': 1, '105': 1
            };

            var setEnterableKeyCodes = {
                "money": function money(opts, optIdx) {
                    var enterableKeyCodes = {
                        '188': ',', '190': '.'
                    };
                    enterableKeyCodes = $.extend(enterableKeyCodes, ctrlKeys);
                    opts.enterableKeyCodes = $.extend(enterableKeyCodes, numKeys);
                },
                "number": function number(opts, optIdx) {
                    var enterableKeyCodes = {
                        '190': '.'
                    };
                    enterableKeyCodes = $.extend(enterableKeyCodes, ctrlKeys);
                    opts.enterableKeyCodes = $.extend(enterableKeyCodes, numKeys);
                },
                "date": function date(opts, optIdx) {
                    var enterableKeyCodes = {
                        '189': '-', '191': '/'
                    };
                    enterableKeyCodes = $.extend(enterableKeyCodes, ctrlKeys);
                    opts.enterableKeyCodes = $.extend(enterableKeyCodes, numKeys);
                },
                "time": function time(opts, optIdx) {
                    var enterableKeyCodes = {
                        '186': ':'
                    };
                    enterableKeyCodes = $.extend(enterableKeyCodes, ctrlKeys);
                    opts.enterableKeyCodes = $.extend(enterableKeyCodes, numKeys);
                },
                "bizno": function bizno(opts, optIdx) {
                    var enterableKeyCodes = {
                        '189': '-'
                    };
                    enterableKeyCodes = $.extend(enterableKeyCodes, ctrlKeys);
                    opts.enterableKeyCodes = $.extend(enterableKeyCodes, numKeys);
                },
                "phone": function phone(opts, optIdx) {
                    var enterableKeyCodes = {
                        '189': '-', '188': ','
                    };
                    enterableKeyCodes = $.extend(enterableKeyCodes, ctrlKeys);
                    opts.enterableKeyCodes = $.extend(enterableKeyCodes, numKeys);
                },
                "custom": function custom(opts, optIdx) {
                    var enterableKeyCodes = {};
                    enterableKeyCodes = $.extend(enterableKeyCodes, ctrlKeys);
                    opts.enterableKeyCodes = $.extend(enterableKeyCodes, numKeys);
                }
            };

            var eventStop = function eventStop(e) {
                // 이벤트 중지 구문
                if (e.preventDefault) e.preventDefault();
                if (e.stopPropagation) e.stopPropagation();
                e.cancelBubble = true;
                return false;
                // 이벤트 중지 구문 끝
            };

            var setPattern = {};

            var formatterEvent = {
                /* 키 다운 이벤트에서 입력할 수 없는 키 입력을 방어 */
                'keydown': function keydown(opts, optIdx, e) {
                    var isStop = false;

                    if (e.which && opts.enterableKeyCodes[e.which]) {} else {
                        console.log(e.which, opts.enterableKeyCodes);
                        isStop = true;
                    }
                    if (isStop) eventStop(e);
                },
                /* 키 업 이벤트에서 패턴을 적용 */
                'keyup': function keyup(opts, optIdx, e) {
                    var elem = opts.$input.get(0);
                    var elemFocusPosition;
                    if ('selectionStart' in elem) {
                        // Standard-compliant browsers
                        elemFocusPosition = elem.selectionStart;
                    } else if (document.selection) {
                        // IE
                        //elem.focus();
                        var sel = document.selection.createRange();
                        var selLen = document.selection.createRange().text.length;
                        sel.moveStart('character', -elem.value.length);
                        elemFocusPosition = sel.text.length - selLen;
                    }

                    opts.$input.data("focusPosition", elemFocusPosition);
                    opts.$input.data("prevLen", elem.value.length);
                }
            };

            return function (opts, optIdx) {
                if (!opts.pattern) {
                    if (opts.$target.get(0).tagName == "INPUT") {
                        opts.pattern = opts.$target.attr('data-ax5formatter');
                    } else {
                        opts.pattern = opts.$target.find('input[type="text"]').attr('data-ax5formatter');
                    }
                    if (!opts.pattern) {
                        console.log(ax5.info.getError("ax5formatter", "501", "bind"));
                        console.log(opts.target);
                        return this;
                    }
                }

                // 함수타입
                for (var key in setEnterableKeyCodes) {
                    if (opts.pattern == key) {
                        setEnterableKeyCodes[key].call(this, opts, optIdx);
                        break;
                    }
                }

                opts.$input = opts.$target.find('input[type="text"]');
                opts.$input.unbind('keydown.ax5formatter').bind('keydown.ax5formatter', formatterEvent.keydown.bind(this, this.queue[optIdx], optIdx));

                opts.$input.unbind('keyup.ax5formatter').bind('keyup.ax5formatter', formatterEvent.keyup.bind(this, this.queue[optIdx], optIdx));

                return this;
            };
        }();

        // 클래스 생성자
        this.main = function () {
            if (arguments && U.isObject(arguments[0])) {
                this.setConfig(arguments[0]);
            }
        }.apply(this, arguments);
    };
    //== UI Class

    root.formatter = function () {
        if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
        return axClass;
    }(); // ax5.ui에 연결
})(ax5.ui, ax5.ui.root);

ax5.ui.formatter_instance = new ax5.ui.formatter();

$.fn.ax5formatter = function () {
    return function (config) {
        if (typeof config == "undefined") config = {};
        $.each(this, function () {
            var defaultConfig = {
                target: this
            };
            config = $.extend(true, defaultConfig, config);
            ax5.ui.formatter_instance.bind(config);
        });
        return this;
    };
}();