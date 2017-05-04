// ax5.ui.palette
(function () {

    const UI = ax5.ui;
    const U = ax5.util;
    let PALETTE;

    UI.addClass({
        className: "palette",
        version: "${VERSION}"
    }, (function () {

        /**
         * @class ax5palette
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```js
         * ```
         */
        return function () {
            let self = this,
                cfg;

            this.instanceId = ax5.getGuid();
            this.target = null;

            this.config = {
                clickEventName: "click",
                theme: 'default',
                animateTime: 100,
                colors: [
                    {"red": "#ff0000"},
                    {"orange": "#ff9802"},
                    {"yellow": "#ffff00"},
                    {"green": "#00ff36"},
                    {"blue": "#0000ff"},
                    {"purple": "#ba00ff"},
                    {"skyblue": "#84e4ff"},
                    {"pink": "#ff77c4"},
                    {"black": "#000000"},
                    {"white": "#ffffff"},
                ]
            };

            cfg = this.config;

            const onStateChanged = function (opts, that) {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                }
                else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }

                that = null;
            };

            const repaint = function () {

            };

            /**
             * Preferences of palette UI
             * @method ax5palette.setConfig
             * @param {Object} config
             * @param {(Element||nodelist)} config.target
             * @returns {ax5palette}
             * @example
             * ```js
             * ```
             */
            //== class body start
            this.init = function () {
                // after setConfig();

                this.onStateChanged = cfg.onStateChanged;
                this.onClick = cfg.onClick;

                if (!cfg.target) {
                    console.log(ax5.info.getError("ax5palette", "401", "setConfig"));
                }
                this.target = jQuery(cfg.target);

            };

            // 클래스 생성자
            this.main = (function () {

                UI.palette_instance = UI.palette_instance || [];
                UI.palette_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }).apply(this, arguments);
        };
    })());
    PALETTE = ax5.ui.palette;
})();