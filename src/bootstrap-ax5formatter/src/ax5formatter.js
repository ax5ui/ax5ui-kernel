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
    var axClass = function () {
        var
            self = this,
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
        this.init = function () {

        };

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
                }) === -1)
            {
                this.queue.push(opts);
                this.__bindFormatterTarget(opts, this.queue.length - 1);
            }

            return this;
        };

        this.__bindFormatterTarget = (function () {

            var formatterPattern = {
                "money": function () {

                },
                "number": function () {

                },
                "date": function () {

                },
                "time": function () {

                },
                "bizno": function () {

                },
                "phone": function () {

                },
                "custom": function () {

                }
            };
            var formatterEvent = {
                'keydown': function (opts, optIdx, e) {
                    console.log(e.which);
                }
            };

            return function (opts, optIdx) {
                if (!opts.pattern) {
                    if(opts.$target.get(0).tagName == "INPUT"){
                        opts.pattern = opts.$target
                            .attr('data-ax5formatter');
                    }
                    else {
                        opts.pattern = opts.$target
                            .find('input[type="text"]')
                            .attr('data-ax5formatter');
                    }
                    if (!opts.pattern) {
                        console.log(ax5.info.getError("ax5formatter", "501", "bind"));
                        console.log(opts.target);
                        return this;
                    }
                }

                // 함수타입
                for (var key in formatterPattern) {
                    if (opts.pattern == key) {
                        formatterPattern[key].call(this, opts, optIdx);
                        break;
                    }
                }

                opts.$target
                    .find('input[type="text"]')
                    .unbind('keydown.ax5formatter')
                    .bind('keydown.ax5formatter', formatterEvent.keydown.bind(this, this.queue[optIdx], optIdx));

                return this;

            }

        })();

        // 클래스 생성자
        this.main = (function () {
            if (arguments && U.isObject(arguments[0])) {
                this.setConfig(arguments[0]);
            }
        }).apply(this, arguments);
    };
    //== UI Class

    root.formatter = (function () {
        if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
        return axClass;
    })(); // ax5.ui에 연결

})(ax5.ui, ax5.ui.root);

ax5.ui.formatter_instance = new ax5.ui.formatter();

$.fn.ax5formatter = (function () {
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
    }
})();