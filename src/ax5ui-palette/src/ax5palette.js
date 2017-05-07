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
                        width: 24,
                        height: 24,
                        cellWidth: 30
                    },
                    label: {
                       width: 80
                    },
                    slider: {
                        trackHeight: 8,
                        amount: 30,
                        handleWidth: 18,
                        handleHeight: 18,
                    },
                    list: [
                        {label: "red", value: "#ff0000"},
                        {label: "orange", value: "#ff9802"},
                        {label: "yellow", value: "#ffff00"},
                        {label: "green", value: "#00ff36"},
                        {label: "blue", value: "#0000ff"},
                        {label: "purple", value: "#ba00ff"},
                        //{label: "skyblue", value: "#84e4ff"},
                        //{label: "pink", value: "#ff77c4"},
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
            this.colors = [];

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

            /**
             * get mouse position
             * @param e
             * @returns {{clientX, clientY}}
             */
            const getMousePosition = (e) => {
                let mouseObj, originalEvent = (e.originalEvent) ? e.originalEvent : e;
                mouseObj = ('changedTouches' in originalEvent && originalEvent.changedTouches) ? originalEvent.changedTouches[0] : originalEvent;
                // clientX, Y 쓰면 스크롤에서 문제 발생
                return {
                    clientX: mouseObj.pageX,
                    clientY: mouseObj.pageY
                }
            };

            const alignHandle = (item) => {

            };

            const handleMoveEvent = {
                "on": () => {
                    jQuery(document.body)
                        .on("mousemove.ax5palette-" + this.instanceId, function (e) {
                            let mouseObj = getMousePosition(e),
                                da_grow;

                            mouseObj = null;
                            da_grow = null;
                        })
                        .on("mouseup.ax5palette-" + this.instanceId, function (e) {
                            handleMoveEvent.off();
                            U.stopEvent(e);
                        })
                        .on("mouseleave.ax5palette-" + this.instanceId, function (e) {
                            handleMoveEvent.off();
                            U.stopEvent(e);
                        });

                    jQuery(document.body)
                        .attr('unselectable', 'on')
                        .css('user-select', 'none')
                        .on('selectstart', false);
                },
                "off": () => {
                    self.xvar.resizerLived = false;

                    jQuery(document.body)
                        .off("mousemove.ax5palette-" + this.instanceId)
                        .off("mouseup.ax5palette-" + this.instanceId)
                        .off("mouseleave.ax5palette-" + this.instanceId);

                    jQuery(document.body)
                        .removeAttr('unselectable')
                        .css('user-select', 'auto')
                        .off('selectstart');
                }
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

                /// colors.list 색상 범위 결정
                cfg.colors.list.forEach(function (c) {
                    let _color = U.color(c.value);
                    c._amount = 0;
                    if (_color.r == 0 && _color.g == 0 && _color.b == 0) {
                        c._color0value = "#" + _color.lighten(cfg.colors.slider.amount * 2).getHexValue();
                        c._color1value = "#" + _color.lighten(cfg.colors.slider.amount).getHexValue();
                        c._color2value = "#" + _color.getHexValue();
                    } else {
                        c._color0value = "#" + _color.lighten(cfg.colors.slider.amount).getHexValue();
                        c._color1value = "#" + _color.getHexValue();
                        c._color2value = "#" + _color.darken(cfg.colors.slider.amount).getHexValue();
                    }
                });

                cfg.colors.slider.handleLeft = -cfg.colors.slider.handleWidth / 2;
                cfg.colors.slider.handleTop = -cfg.colors.slider.handleHeight / 2;

                // 팔렛트 컬러 패널 초기화
                this.$["colors"].html(PALETTE.tmpl.get("colors", cfg, cfg.columnKeys));

                this.$["colors"].find('[data-ax5palette-color-index]').each(function () {
                    let idx = this.getAttribute("data-ax5palette-color-index");
                    let color = cfg.colors.list[idx];
                    let item = jQuery.extend({}, color);
                    item.$item = jQuery(this);
                    alignHandle(item);
                    /////
                    self.colors.push(item);
                });

                this.$["colors"]
                    .off("mousedown")
                    .on("mousedown", '[data-panel="color-handle"]', function (e) {
                        console.log(e.target);
                    });
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