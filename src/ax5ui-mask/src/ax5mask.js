// ax5.ui.mask
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var MASK;

    UI.addClass({
        className: "mask",
        version: "0.7.5"
    }, (function () {
        /**
         * @class ax5mask
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```js
         * var customMask = function customMask() {
         *     var cTmpl = '' +
         *         '<div class="ax-mask" id="{{maskId}}" >' +
         *         '    <div class="ax-mask-bg" style="background-color:red !important;"></div>' +
         *         '    <div class="ax-mask-content">' +
         *         '        {{{body}}}' +
         *         '    </div>' +
         *         '</div>';
         *     return cTmpl;
         * };
         * ax5.ui.mask.tmpl.customMask = customMask;
         *
         * var mask = new ax5.ui.mask();
         *
         * mask.open({
         *     templateName: 'customMask',
         *     content: 'custom MASK on target',
         *     target: $("#user-content").get(0),
         *     onClick: function(){
         *         console.log(this);
         *     }
         * });
         * ```
         */
        var ax5mask = function () {
            var self = this,
                cfg;

            this.instanceId = ax5.getGuid();
            this.config = {
                theme: '',
                target: jQuery(document.body).get(0)
            };
            this.maskContent = '';
            this.status = "off";

            cfg = this.config;

            var
                onStateChanged = function (opts, that) {
                    if (opts && opts.onStateChanged) {
                        opts.onStateChanged.call(that, that);
                    }
                    else if (this.onStateChanged) {
                        this.onStateChanged.call(that, that);
                    }

                    opts = null;
                    that = null;
                    return true;
                },
                getBodyTmpl = function (data) {
                    if (typeof data.templateName === "undefined") data.templateName = "defaultMask";
                    return MASK.tmpl.get.call(this, data.templateName, data);
                },
                setBody = function (content) {
                    this.maskContent = content;
                };

            /**
             * Preferences of Mask UI
             * @method ax5mask.setConfig
             * @param {Object} config - 클래스 속성값
             * @returns {ax5mask}
             * @example
             * ```
             * setConfig({
             *      target : {Element|AX5 nodelist}, // 마스크 처리할 대상
             *      content : {String}, // 마스크안에 들어가는 내용물
             *      onStateChanged: function(){} // 마스크 상태변경 시 호출되는 함수 this.type으로 예외처리 가능
             * }
             * ```
             */
            this.init = function () {
                // after setConfig();
                this.onStateChanged = cfg.onStateChanged;
                this.onClick = cfg.onClick;
                if (this.config.content) setBody.call(this, this.config.content);
            };

            /**
             * open mask
             * target 을 주지 않으면 기본적으로 body 에 마스크가 적용되고 원하는 타겟을 지정해서 마스크를 씌울 수 있습니다.
             * 기본 정의된 마스크 외에 사용자가 템플릿을 정의해서 마스크를 사용 가능합니다.
             * @method ax5mask.open
             * @param {Object} config
             * @param {String} config
             * @returns {ax5mask}
             * @example
             * ```js
             * my_mask.open({
             *     target: document.body,
             *     content: "<h1>Loading..</h1>",
             *     onStateChanged: function () {
             *
             *     }
             * });
             *
             * my_mask.open({
             *     target: $("#mask-target").get(0), // dom Element
             *     content: "<h1>Loading..</h1>",
             *     onStateChanged: function () {
             *
             *     }
             * });
             *
             * 
             * var customMask = function customMask() {
             *     var cTmpl = '' +
             *             '<div class="ax-mask" id="{{maskId}}" >' +
             *             '    <div class="ax-mask-bg" style="background-color:red   !important;"></div>' +
             *             '    <div class="ax-mask-content">' +
             *             '        {{{body}}}' +
             *             '    </div>' +
             *             '</div>';
             *     return cTmpl;
             * };
             * ax5.ui.mask.tmpl.customMask = customMask;
             * 
             * my_mask.open({
             *     target: $("#mask-target").get(0), // dom Element
             *     content: "<h1>Loading..</h1>",
             *     
             *     onStateChanged: function () {
             *
             *     }
             * });
             * ```
             */
            this.open = function (options) {

                if (this.status === "on") this.close();
                if (options && options.content) setBody.call(this, options.content);
                if (typeof options.templateName === "undefined") options.templateName = "defaultMask";
                self.maskConfig = {};

                jQuery.extend(true, self.maskConfig, this.config, options);

                var _cfg = self.maskConfig,
                    target = _cfg.target,
                    $target = jQuery(target),
                    maskId = 'ax-mask-' + ax5.getGuid(),
                    $mask,
                    css = {},
                    that = {},
                    templateName = _cfg.templateName,
                    /*
                    bodyTmpl = getBodyTmpl(),
                    body = ax5.mustache.render(bodyTmpl, {
                        theme: _cfg.theme,
                        maskId: maskId,
                        body: this.maskContent
                    });
                    */
                    body = getBodyTmpl({
                        theme: _cfg.theme,
                        maskId: maskId,
                        body: this.maskContent,
                        templateName: templateName
                    });

                jQuery(document.body).append(body);

                if (target && target !== jQuery(document.body).get(0)) {
                    css = {
                        position: _cfg.position || "absolute",
                        left: $target.offset().left,
                        top: $target.offset().top,
                        width: $target.outerWidth(),
                        height: $target.outerHeight()
                    };

                    if (typeof self.maskConfig.zIndex !== "undefined") {
                        css["z-index"] = self.maskConfig.zIndex;
                    }
                    $target.addClass("ax-masking");
                }

                this.$mask = $mask = jQuery("#" + maskId);
                this.$target = $target;
                this.status = "on";
                $mask.css(css);

                if (_cfg.onClick) {
                    $mask.on("click", function (e) {
                        that = {
                            self: self,
                            state: "open",
                            type: "click"
                        };
                        self.maskConfig.onClick.call(that, that);
                    });
                }

                onStateChanged.call(this, null, {
                    self: this,
                    state: "open"
                });

                options = null;
                _cfg = null;
                target = null;
                $target = null;
                maskId = null;
                $mask = null;
                css = null;
                that = null;
                templateName  = null;
                body = null;

                return this;
            };

            /**
             * close mask
             * @method ax5mask.close
             * @param {Number} [_delay=0]
             * @returns {ax5mask}
             * @example
             * ```
             * my_mask.close();
             * ```
             */
            this.close = function (_delay) {
                if (this.$mask) {
                    var _close = function(){
                        this.status = "off";
                        this.$mask.remove();
                        this.$target.removeClass("ax-masking");

                        onStateChanged.call(this, null, {
                            self: this,
                            state: "close"
                        });
                    };


                    if(_delay) {
                        setTimeout((function () {
                            _close.call(this);
                        }).bind(this), _delay);
                    }else{
                        _close.call(this);
                    }
                }
                return this;
            };
            //== class body end


            this.pullRequest = function(){
                console.log("test pullRequest01");
                console.log("test pullRequest02");
            };

            // 클래스 생성자
            this.main = (function () {

                UI.mask_instance = UI.mask_instance || [];
                UI.mask_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }).apply(this, arguments);
        };
        return ax5mask;
    })());
    MASK = ax5.ui.mask;
})();