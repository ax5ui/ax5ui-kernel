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
        this.activePicker = null;
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
        cfg.id = 'ax5-picker-' + ax5.getGuid();

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

        /**
         * open the picker of alert type
         * @method ax5.ui.picker.alert
         * @param {Object|String} [{theme, title, msg, btns}|msg] - picker 속성을 json으로 정의하거나 msg만 전달
         * @param {Function} [callBack] - 사용자 확인 이벤트시 호출될 callBack 함수
         * @returns {ax5.ui.picker}
         * @example
         * ```
         * myPicker.alert({
		 *  title: 'app title',
		 *  msg: 'alert'
		 * }, function(){});
         * ```
         */
        this.open = function (opts, callBack) {

            if (this.activePicker) {
                console.log(ax5.info.getError("ax5picker", "501", "open"));
                return this;
            }

            self.pickerConfig = {};
            jQuery.extend(true, self.pickerConfig, cfg);
            jQuery.extend(true, self.pickerConfig, opts);
            opts = self.pickerConfig;

            this._open(opts, callBack);
            return this;
        };

        this.getContent = function (pickerId, opts) {
            var
                po = [];

            po.push('<div id="' + pickerId + '" data-ax5-ui="picker" class="ax5-ui-picker ' + opts.theme + '">');
            po.push('<div class="ax-picker-heading">');
            po.push((opts.title || cfg.title || ""));
            po.push('</div>');
            po.push('<div class="ax-picker-body">');
            po.push('<div class="ax-picker-msg">');
            po.push((opts.msg || cfg.msg || "").replace(/\n/g, "<br/>"));
            po.push('</div>');

            if (opts.input) {
                po.push('<div class="ax-picker-prompt">');
                U.each(opts.input, function (k, v) {
                    po.push('<div class="form-group">');
                    if (this.label) po.push('    <label>' + this.label.replace(/\n/g, "<br/>") + '</label>');
                    po.push('    <input type="' + (this.type || 'text') + '" placeholder="' + (this.placeholder || "") + ' " class="form-control ' + (this.theme || "") + '" data-ax-picker-prompt="' + k + '" style="width:100%;" value="' + (this.value || "") + '" />');
                    if (this.help) {
                        po.push('    <p class="help-block">' + this.help.replace(/\n/g, "<br/>") + '</p>');
                    }
                    po.push('</div>');
                });
                po.push('</div>');
            }

            po.push('<div class="ax-picker-buttons">');
            po.push('<div class="ax-button-wrap">');
            U.each(opts.btns, function (k, v) {
                po.push('<button type="button" data-ax-picker-btn="' + k + '" class="btn btn-' + (this.theme || "default") + '">' + this.label + '</button>');
            });
            po.push('</div>');
            po.push('</div>');
            po.push('</div>');
            po.push('</div>');
            return po.join('');
        };

        this._open = function (opts, callBack) {
            var
                pos = {},
                that;

            opts.id = (opts.id || cfg.id);

            box = {
                width: opts.width
            };
            jQuery(document.body).append(this.getContent(opts.id, opts));

            this.activePicker = jQuery('#' + opts.id);
            this.activePicker.css({width: box.width});

            // picker 높이 구하기 - 너비가 정해지면 높이가 변경 될 것.
            opts.height = box.height = this.activePicker.height();

            //- position 정렬
            if (typeof opts.position === "undefined" || opts.position === "center") {
                var w = window.innerWidth;
                var h = window.innerHeight;

                pos.top = h / 2 - box.height / 2;
                pos.left = w / 2 - box.width / 2;
            }
            else {
                pos.left = opts.position.left || 0;
                pos.top = opts.position.top || 0;
            }
            this.activePicker.css(pos);

            this.activePicker.find("[data-ax-picker-btn]").on(cfg.clickEventName, (function (e) {
                this.btnOnClick(e || window.event, opts, callBack);
            }).bind(this))
                .get(0).focus();

            // bind key event
            jQuery(window).bind("keydown.ax-picker", (function (e) {
                this.onKeyup(e || window.event, opts, callBack);
            }).bind(this));

            jQuery(window).bind("resize.ax-picker", (function (e) {
                this.align(e || window.event);
            }).bind(this));

            if (opts && opts.onStateChanged) {
                that = {
                    state: "open"
                };
                opts.onStateChanged.call(that, that);
            }
            return this;
        };

        this.align = function (e) {
            if (!this.activePicker) return this;
            var opts = self.pickerConfig,
                box = {
                    width: opts.width,
                    height: opts.height
                };
            //- position 정렬
            if (typeof opts.position === "undefined" || opts.position === "center") {
                box.top = window.innerHeight / 2 - box.height / 2;
                box.left = window.innerWidth / 2 - box.width / 2;
            }
            else {
                box.left = opts.position.left || 0;
                box.top = opts.position.top || 0;
            }
            this.activePicker.css(box);
            return this;
        };

        this.btnOnClick = function (e, opts, callBack, target, k) {
            if (e.srcElement) e.target = e.srcElement;

            target = U.findParentNode(e.target, function (target) {
                if (target.getAttribute("data-ax-picker-btn")) {
                    return true;
                }
            });

            if (target) {
                k = target.getAttribute("data-ax-picker-btn");

                var that = {
                    key: k, value: opts.btns[k],
                    pickerId: opts.id,
                    btnTarget: target
                };
                if (opts.pickerType === "prompt") {
                    var emptyKey = null;
                    for (var oi in opts.input) {
                        that[oi] = this.activePicker.find('[data-ax-picker-prompt=' + oi + ']').val();
                        if (that[oi] == "" || that[oi] == null) {
                            emptyKey = oi;
                            break;
                        }
                    }
                }
                if (opts.btns[k].onClick) {
                    opts.btns[k].onClick.call(that, k);
                }
                else if (opts.pickerType === "alert") {
                    if (callBack) callBack.call(that, k);
                    this.close();
                }
                else if (opts.pickerType === "confirm") {
                    if (callBack) callBack.call(that, k);
                    this.close();
                }
                else if (opts.pickerType === "prompt") {
                    if (k === 'ok') {
                        if (emptyKey) {
                            this.activePicker.find('[data-ax-picker-prompt="' + emptyKey + '"]').get(0).focus();
                            return false;
                        }
                    }
                    if (callBack) callBack.call(that, k);
                    this.close();
                }
            }
        };

        this.onKeyup = function (e, opts, callBack, target, k) {
            if (e.keyCode == ax5.info.eventKeys.ESC) {
                this.close();
            }
            if (opts.pickerType === "prompt") {
                if (e.keyCode == ax5.info.eventKeys.RETURN) {
                    var that = {
                        key: k, value: opts.btns[k],
                        pickerId: opts.id,
                        btnTarget: target
                    };
                    var emptyKey = null;
                    for (var oi in opts.input) {
                        that[oi] = this.activePicker.find('[data-ax-picker-prompt=' + oi + ']').val();
                        if (that[oi] == "" || that[oi] == null) {
                            emptyKey = oi;
                            break;
                        }
                    }
                    if (emptyKey) return false;
                    if (callBack) callBack.call(that, k);
                    this.close();
                }
            }
        };

        /**
         * close the picker
         * @method ax5.ui.picker.close
         * @returns {ax5.ui.picker}
         * @example
         * ```
         * myPicker.close();
         * ```
         */
        this.close = function (opts, that) {
            if (this.activePicker) {
                opts = self.pickerConfig;
                this.activePicker.addClass("destroy");
                jQuery(window).unbind("keydown.ax-picker");
                jQuery(window).unbind("resize.ax-picker");

                setTimeout((function () {
                    this.activePicker.remove();
                    this.activePicker = null;
                    if (opts && opts.onStateChanged) {
                        that = {
                            state: "close"
                        };
                        opts.onStateChanged.call(that, that);
                    }
                }).bind(this), cfg.animateTime);
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

    root.picker = (function(){
        if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
        return axClass;
    })(); // ax5.ui에 연결

})(ax5.ui, ax5.ui.root);