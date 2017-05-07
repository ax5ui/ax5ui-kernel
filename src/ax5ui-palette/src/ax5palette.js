// ax5.ui.palette
(function () {

    const UI = ax5.ui;
    const U = ax5.util;
    let PALETTE;

    UI.addClass({
        className: "palette"
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
                colors: {
                    preview: {
                        width: 20,
                        height: 20,
                        cellWidth: 30
                    },
                    label: {
                       width: 80
                    },
                    list: [
                        {label: "red", value: "#ff0000"},
                        {label: "orange", value: "#ff9802"},
                        {label: "yellow", value: "#ffff00"},
                        {label: "green", value: "#00ff36"},
                        {label: "blue", value: "#0000ff"},
                        {label: "purple", value: "#ba00ff"},
                        {label: "skyblue", value: "#84e4ff"},
                        {label: "pink", value: "#ff77c4"},
                        {label: "black", value: "#000000"},
                        {label: "white", value: "#ffffff"},
                    ],
                },
                controls: {
                    height: 30,
                },
                columnKeys: {}
            };
            this.xvar = {};

            cfg = this.config;

            const onStateChanged = (opts, that) => {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                }
                else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }

                that = null;
            };

            const repaint = () => {
                let box = {
                    width: this.$target.innerWidth(),
                    height: this.$target.innerHeight(),
                };

                // 패널 프레임 초기화
                this.$target.html(PALETTE.tmpl.get("frame", {}, cfg.columnKeys));

                // 각 패널들을 캐싱~
                this.$ = {
                    "root": this.$target.find('[data-ax5palette-container="root"]'),
                    "colors": this.$target.find('[data-ax5palette-container="colors"]'),
                    "controls": this.$target.find('[data-ax5palette-container="controls"]'),
                };

                //this.$["colors"].css({height: box.height - cfg.controls.height});
                //this.xvar.colorHeight = (box.height - cfg.controls.height) / cfg.colors.length;

                this.$["controls"].css({height: cfg.controls.height});

                // 팔렛트 컬러 패널 초기화
                this.$["colors"].html(PALETTE.tmpl.get("colors", cfg, cfg.columnKeys));

                //console.log(box);
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
                this.$target = jQuery(cfg.target);

                repaint(); // 팔렛트 그리기.
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