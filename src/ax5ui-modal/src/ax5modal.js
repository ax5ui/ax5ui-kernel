// ax5.ui.modal
(function (root, _SUPER_) {

    /**
     * @class ax5.ui.modal
     * @classdesc
     * @version 0.5.4
     * @author tom@axisj.com
     * @example
     * ```
     * var my_modal = new ax5.ui.modal();
     * ```
     */

    var U = ax5.util;

    //== UI Class
    var axClass = function () {
        var
            self = this,
            cfg;

        if (_SUPER_) _SUPER_.call(this); // 부모호출
        this.activeModal = null;
        this.$ = {}; // UI inside of the jQuery object store
        this.config = {
            position: {
                left: "center",
                top: "middle",
                margin: 10
            },
            clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchstart" : "click"),
            theme: 'default',
            width: 300,
            height: 400,
            closeToEsc: true,
            animateTime: 250
        };
        cfg = this.config; // extended config copy cfg
        cfg.id = 'ax5-modal-' + ax5.getGuid(); // instance id

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
            getContentTmpl = function () {
                return `
                <div id="{{modalId}}" data-modal-els="root" class="ax5-ui-modal {{theme}} {{fullscreen}}" style="{{styles}}">
                    <div class="ax-modal-body" data-modal-els="body">
                    {{#iframe}}
                        <div data-modal-els="iframe-wrap" style="-webkit-overflow-scrolling: touch; overflow: auto;position: relative;">
                        <iframe name="{{modalId}}-frame" src="" width="100%" height="100%" frameborder="0" data-modal-els="iframe" style="position: absolute;left:0;top:0;"></iframe>
                        </div>
                        <form name="{{modalId}}-form" data-modal-els="iframe-form">
                        <input type="hidden" name="modalId" value="{{modalId}}" />
                        {{#param}}
                        {{#@each}}
                        <input type="hidden" name="{{@key}}" value="{{@value}}" />
                        {{/@each}}
                        {{/param}}
                        </form>
                    {{/iframe}}
                    </div>
                </div>
                `;
            },
            getContent = function (modalId, opts) {
                var
                    data = {
                        modalId: modalId,
                        theme: opts.theme,
                        fullScreen: (opts.fullScreen ? "fullscreen" : ""),
                        styles: [],
                        iframe: opts.iframe
                    };

                if (opts.zIndex) {
                    data.styles.push("z-index:" + opts.zIndex);
                }
                if (data.iframe && typeof data.iframe.param === "string") {
                    data.iframe.param = ax5.util.param(data.iframe.param);
                }

                return ax5.mustache.render(getContentTmpl(), data);
            },
            open = function (opts, callBack) {
                var that;

                jQuery(document.body).append(getContent.call(this, opts.id, opts));

                this.activeModal = jQuery('#' + opts.id);

                // 파트수집
                this.$ = {
                    "root": this.activeModal.find('[data-modal-els="root"]'),
                    "body": this.activeModal.find('[data-modal-els="body"]')
                };

                if (opts.iframe) {
                    this.$["iframe-wrap"] = this.activeModal.find('[data-modal-els="iframe-wrap"]');
                    this.$["iframe"] = this.activeModal.find('[data-modal-els="iframe"]');
                    this.$["iframe-form"] = this.activeModal.find('[data-modal-els="iframe-form"]');
                }

                //- position 정렬
                align.call(this);

                that = {
                    self: this,
                    id: opts.id,
                    theme: opts.theme,
                    width: opts.width,
                    height: opts.height,
                    state: "open",
                    $: this.$
                };

                if (opts.iframe) {

                    this.$["iframe-wrap"].css({height: opts.height});
                    this.$["iframe"].css({height: opts.height});

                    // iframe content load
                    this.$["iframe-form"].attr({"method": opts.iframe.method});
                    this.$["iframe-form"].attr({"target": opts.id + "-frame"});
                    this.$["iframe-form"].attr({"action": opts.iframe.url});
                    this.$["iframe"].on("load", (function () {
                        that.state = "load";
                        onStateChanged.call(this, opts, that);
                    }).bind(this));
                    this.$["iframe-form"].submit();
                }

                if (callBack) callBack.call(that);
                onStateChanged.call(this, opts, that);

                // bind key event
                if (opts.closeToEsc) {
                    jQuery(window).bind("keydown.ax-modal", (function (e) {
                        onkeyup.call(this, e || window.event);
                    }).bind(this));
                }
                jQuery(window).bind("resize.ax-modal", (function (e) {
                    align.call(this, null, e || window.event);
                }).bind(this));
            },
            align = function (position, e) {
                if (!this.activeModal) return this;
                var opts = self.modalConfig,
                    box = {
                        width: opts.width,
                        height: opts.height
                    };

                if (opts.fullScreen) {
                    box.width = jQuery(window).width();
                    box.height = jQuery(window).height();
                    box.left = 0;
                    box.top = 0;

                    if (opts.iframe) {
                        this.$["iframe-wrap"].css({height: box.height});
                        this.$["iframe"].css({height: box.height});
                    }
                }
                else {
                    if (position) {
                        jQuery.extend(true, opts.position, position);
                    }

                    //- position 정렬
                    if (opts.position.left == "left") {
                        box.left = (opts.position.margin || 0);
                    }
                    else if (opts.position.left == "right") {
                        // window.innerWidth;
                        box.left = jQuery(window).width() - box.width - (opts.position.margin || 0);
                    }
                    else if (opts.position.left == "center") {
                        box.left = jQuery(window).width() / 2 - box.width / 2;
                    }
                    else {
                        box.left = opts.position.left || 0;
                    }

                    if (opts.position.top == "top") {
                        box.top = (opts.position.margin || 0);
                    }
                    else if (opts.position.top == "bottom") {
                        box.top = jQuery(window).height() - box.height - (opts.position.margin || 0);
                    }
                    else if (opts.position.top == "middle") {
                        box.top = jQuery(window).height() / 2 - box.height / 2;
                    }
                    else {
                        box.top = opts.position.top || 0;
                    }
                }

                this.activeModal.css(box);
                return this;
            },
            onkeyup = function (e) {
                if (e.keyCode == ax5.info.eventKeys.ESC) {
                    this.close();
                }
            };

        /// private end

        /**
         * Preferences of modal UI
         * @method ax5.ui.modal.setConfig
         * @param {Object} config - 클래스 속성값
         * @returns {ax5.ui.modal}
         * @example
         * ```
         * ```
         */
        //== class body start
        this.init = function () {
            this.onStateChanged = cfg.onStateChanged;
        };

        /**
         * open the modal
         * @method ax5.ui.modal.open
         * @returns {ax5.ui.modal}
         * @example
         * ```
         * my_modal.open();
         * ```
         */
        this.open = function (opts, callBack) {
            if (U.isString(opts)) {
                opts = {
                    title: cfg.title,
                    msg: opts
                }
            }

            self.modalConfig = {};
            jQuery.extend(true, self.modalConfig, cfg);
            jQuery.extend(true, self.modalConfig, opts);
            opts = self.modalConfig;

            open.call(this, opts, callBack);
            return this;
        };

        /**
         * close the modal
         * @method ax5.ui.modal.close
         * @returns {ax5.ui.modal}
         * @example
         * ```
         * my_modal.close();
         * ```
         */
        this.close = function (opts, that) {
            if (this.activeModal) {
                opts = self.modalConfig;
                this.activeModal.addClass("destroy");
                jQuery(window).unbind("keydown.ax-modal");
                jQuery(window).unbind("resize.ax-modal");

                setTimeout((function () {
                    this.activeModal.remove();
                    this.activeModal = null;
                    that = {
                        self: this,
                        state: "close"
                    };
                    onStateChanged.call(this, opts, {
                        self: this,
                        state: "close"
                    });
                }).bind(this), cfg.animateTime);
            }
            return this;
        };

        /**
         * setCSS
         * @method ax5.ui.modal.css
         * @param {Object} css -
         * @returns {ax5.ui.modal}
         */
        this.css = function (css) {
            if (this.activeModal && !self.fullScreen) {
                this.activeModal.css(css);
                if (css.width) {
                    self.modalConfig.width = this.activeModal.width();
                }
                if (css.height) {
                    self.modalConfig.height = this.activeModal.height();
                    if (this.$["iframe"]) {
                        this.$["iframe-wrap"].css({height: self.modalConfig.height});
                        this.$["iframe"].css({height: self.modalConfig.height});
                    }
                }
            }
            return this;
        };

        // 클래스 생성자
        this.main = (function () {
            if (arguments && U.isObject(arguments[0])) {
                this.setConfig(arguments[0]);
            }
        }).apply(this, arguments);
    };
    //== UI Class

    root.modal = (function () {
        if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
        return axClass;
    })(); // ax5.ui에 연결

})(ax5.ui, ax5.ui.root);