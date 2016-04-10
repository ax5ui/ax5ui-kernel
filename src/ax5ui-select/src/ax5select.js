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
            animateTime: 250
        };

        this.activeselect = null;
        this.activeselectQueueIndex = -1;
        this.openTimer = null;
        this.closeTimer = null;

        cfg = this.config;

        var
            onStateChanged = function (opts, that) {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                }
                else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }
                return true;
            },
            onClick = function () {

            },
            bindSelectTarget = (function () {
                var selectEvent = {
                    'click': function (opts, optIdx, e) {
                        self.open(opts, optIdx);
                    }
                };

                return function (opts, optIdx) {
                    var _select;

                    if (!opts.content) {
                        console.log(ax5.info.getError("ax5select", "501", "bind"));
                        return this;
                    }


                    _select = (opts.target.tagName.toUpperCase() == "INPUT") ? opts.$target : opts.$target.find('input[type="text"]');
                    _select
                        .unbind('click.ax5picker')
                        .bind('click.ax5picker', selectEvent.click.bind(this, this.queue[optIdx], optIdx));

                    _select = null;
                    opts = null;
                    optIdx = null;
                    return this;
                }
            })();
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
        };

        this.bind = function (opts) {
            var
                selectConfig = {},
                optIdx;

            jQuery.extend(true, selectConfig, cfg);
            if (opts) jQuery.extend(true, selectConfig, opts);
            opts = selectConfig;

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
            optIdx = U.search(this.queue, function () {
                return this.id == opts.id;
            });

            if (optIdx === -1) {
                this.queue.push(opts);
                bindSelectTarget.call(this, opts, this.queue.length - 1);
            }
            else {
                this.queue[optIdx] = opts;
                bindSelectTarget.call(this, this.queue[optIdx], optIdx);
            }

            selectConfig = null;
            optIdx = null;
            return this;
        };

        this.open = (function () {

            var getOptionsContent = {
                
            };
            
            return function (opts, optIdx, tryCount){

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

    root.select = (function () {
        if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
        return axClass;
    })(); // ax5.ui에 연결

})(ax5.ui, ax5.ui.root);

ax5.ui.select_instance = new ax5.ui.select();

$.fn.ax5select = (function () {
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
    }
})();