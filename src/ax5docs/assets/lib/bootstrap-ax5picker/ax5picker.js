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

        this.config.btns = {
            ok: {label: this.config.lang["ok"], theme: this.config.theme}
        };

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
                    //console.log(opts, e);
                    this.open(opts, optIdx);
                },
                'click': function (opts, optIdx, e) {
                    //console.log(opts, e);
                    this.open(opts, optIdx);
                }
            };

            var pickerType = {
                'date': function (opts, optIdx) {
                    // 1. 이벤트 바인딩
                    // 2. ui 준비

                    opts.$target
                        .find('input[type="text"]')
                        .unbind('focus.ax5picker')
                        .bind('focus.ax5picker', pickerEvent.focus.bind(this, opts, optIdx));

                    opts.$target
                        .find('.input-group-addon')
                        .unbind('click.ax5picker')
                        .bind('click.ax5picker', pickerEvent.click.bind(this, opts, optIdx));
                }
            };

            return function (opts, optIdx) {
                for (var key in pickerType) {
                    if (opts.type == key) {
                        pickerType[key](opts, optIdx);
                        break;
                    }
                }
                return this;
            }

        })();

        this.open = (function () {

            var getTmpl = function () {
                return ''
                    + '<div class="ax5-ui-picker">'
                    + '{{#title}}'
                    + '<div class="ax-picker-heading">{{title}}</div>'
                    + '{{/title}}'
                    + '<div class="ax-picker-body">'
                    + '<div class="ax-picker-contents">'
                    + '</div>'
                    + '{{#btns}}'
                    + '<div class="ax-picker-buttons">'
                    + '{{#btns}}'
                    + '<button class="btn btn-default">{{label}}</button>'
                    + '{{/btns}}'
                    + '</div>'
                    + '{{/btns}}'
                    + '</div>'
                    + '<div class="ax-picker-arrow"></div>'
                    + '</div>';
            };

            return function (opts, optIdx) {

            }
        })();

        this.close = function () {

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