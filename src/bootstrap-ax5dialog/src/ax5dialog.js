// ax5.ui.dialog
(function (root, _SUPER_) {

    /**
     * @class ax5.ui.dialog
     * @classdesc
     * @version v0.0.1
     * @author tom@axisj.com
     * @logs
     * 2014-06-15 tom : 시작
     * @example
     * ```
     * var myDialog = new ax5.ui.dialog();
     * ```
     */

    var U = ax5.util;

    //== UI Class
    var axClass = function () {
        // 클래스 생성자
        this.main = (function () {
            if (_SUPER_) _SUPER_.call(this); // 부모호출
            this.config = {
                clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
                theme: 'default',
                width: 300,
                title: '',
                msg: '',
                lang: {
                    "ok": "ok", "cancel": "cancel"
                }
            };
        }).apply(this, arguments);

        this.activeDialog = null;

        var cfg = this.config;
        cfg.id = 'ax5-dialog-' + ax5.getGuid();

        /**
         * Preferences of dialog UI
         * @method ax5.ui.dialog.setConfig
         * @param {Object} config - 클래스 속성값
         * @returns {ax5.ui.dialog}
         * @example
         * ```
         * ```
         */
            //== class body start
        this.init = function () {
            cfg.id = 'ax5-dialog-' + ax5.getGuid();
        };

        /**
         * open the dialog of alert type
         * @method ax5.ui.dialog.alert
         * @param {Object|String} [{theme, title, msg, btns}|msg] - dialog 속성을 json으로 정의하거나 msg만 전달
         * @param {Function} [callback] - 사용자 확인 이벤트시 호출될 callback 함수
         * @returns {ax5.ui.dialog}
         * @example
         * ```
         * myDialog.alert({
		 *  title: 'app title',
		 *  msg: 'alert'
		 * }, function(){});
         * ```
         */
        this.alert = function (opts, callback) {
            if (U.isString(opts)) {
                opts = {
                    title: cfg.title,
                    msg: opts
                }
            }
            opts.dialogType = "alert";
            opts.theme = (opts.theme || cfg.theme || "");
            if (typeof opts.btns === "undefined") {
                opts.btns = {
                    ok: {label: cfg.lang["ok"], theme: opts.theme}
                };
            }
            this.open(opts, callback);
            return this;
        };

        /**
         * open the dialog of confirm type
         * @method ax5.ui.dialog.confirm
         * @param {Object|String} [{theme, title, msg, btns}|msg] - dialog 속성을 json으로 정의하거나 msg만 전달
         * @param {Function} [callback] - 사용자 확인 이벤트시 호출될 callback 함수
         * @returns {ax5.ui.dialog}
         * @example
         * ```
         * myDialog.confirm({
		 *  title: 'app title',
		 *  msg: 'confirm'
		 * }, function(){});
         * ```
         */
        this.confirm = function (opts, callback) {
            if (U.isString(opts)) {
                opts = {
                    title: cfg.title,
                    msg: opts
                }
            }
            opts.dialogType = "confirm";
            opts.theme = (opts.theme || cfg.theme || "");
            if (typeof opts.btns === "undefined") {
                opts.btns = {
                    ok: {label: cfg.lang["ok"], theme: opts.theme},
                    cancel: {label: cfg.lang["cancel"]}
                };
            }
            this.open(opts, callback);
            return this;
        };

        /**
         * open the dialog of prompt type
         * @method ax5.ui.dialog.prompt
         * @param {Object|String} [{theme, title, msg, btns, input}|msg] - dialog 속성을 json으로 정의하거나 msg만 전달
         * @param {Function} [callback] - 사용자 확인 이벤트시 호출될 callback 함수
         * @returns {ax5.ui.dialog}
         * @example
         * ```
         * myDialog.prompt({
		 *  title: 'app title',
		 *  msg: 'alert'
		 * }, function(){});
         * ```
         */
        this.prompt = function (opts, callback) {
            if (U.isString(opts)) {
                opts = {
                    title: cfg.title,
                    msg: opts
                }
            }
            opts.dialogType = "prompt";
            opts.theme = (opts.theme || cfg.theme || "");

            if (typeof opts.input === "undefined") {
                opts.input = {
                    value: {label: (opts.msg || cfg.msg || "")}
                };
            }
            if (typeof opts.btns === "undefined") {
                opts.btns = {
                    ok: {label: cfg.lang["ok"], theme: opts.theme},
                    cancel: {label: cfg.lang["cancel"]}
                };
            }
            this.open(opts, callback);
            return this;
        };

        this.getContent = function (dialogId, opts) {
            var
                po = [];

            po.push('<div id="' + dialogId + '" data-ax5-ui="dialog" class="ax5-ui-dialog ' + opts.theme + '">');
            po.push('<div class="ax-dialog-heading">');
            po.push((opts.title || cfg.title || ""));
            po.push('</div>');
            po.push('<div class="ax-dialog-body">');
            po.push('<div class="ax-dialog-msg">');

            po.push((opts.msg || cfg.msg || "").replace(/\n/g, "<br/>"));

            if (opts.input) {
                U.each(opts.input, function (k, v) {
                    po.push('<div class="ax-dialog-prompt">');
                    po.push(this.label.replace(/\n/g, "<br/>"));
                    po.push('</div>');
                    po.push('<input type="' + (this.type || 'text') + '" placeholder="' + (this.placeholder || "") + ' " class="ax-inp ' + (this.klass || "") + '" data-ax-dialog-prompt="' + k + '" style="width:100%;" value="' + (this.value || "") + '" />');
                });
            }

            po.push('</div>');
            po.push('<div class="ax-dialog-buttons">');
            po.push('<div class="ax-button-wrap">');
            U.each(opts.btns, function (k, v) {
                po.push('<button type="button" data-ax-dialog-btn="' + k + '" class="btn ' + this.theme + '">' + this.label + '</button>');
            });
            po.push('</div>');
            po.push('</div>');
            po.push('</div>');
            po.push('</div>');
            return po.join('');
        };

        this.open = function (opts, callback) {
            var
                pos = {},
                box = {},
                po;

            opts.id = (opts.id || cfg.id);

            box = {
                width: opts.width || cfg.width
            };
            jQuery(document.body).append(this.getContent(opts.id, opts));
            this.activeDialog = jQuery('#' + opts.id);
            this.activeDialog.css({width: box.width});

            // dialog 높이 구하기 - 너비가 정해지면 높이가 변경 될 것.
            box.height = this.activeDialog.height();

            //- position 정렬
            if (typeof opts.position === "undefined" || opts.position === "center") {
                var w = window.innerWidth
                    || document.documentElement.clientWidth
                    || document.body.clientWidth;
                var h = window.innerHeight
                    || document.documentElement.clientHeight
                    || document.body.clientHeight;

                pos.top = h / 2 - box.height / 2;
                pos.left = w / 2 - box.width / 2;
            }
            else {
                pos.left = opts.position.left || 0;
                pos.top = opts.position.top || 0;
            }
            this.activeDialog.css(pos);

            // bind button event
            if (opts.dialogType === "prompt") {
                this.activeDialog.find("[data-ax-dialog-prompt]").get(0).focus();
            }
            else {
                this.activeDialog.find("[data-ax-dialog-btn]").get(0).focus();
            }

            this.activeDialog.find("[data-ax-dialog-btn]").on(cfg.clickEventName, (function (e) {
                this.btnOnclick(e || window.event, opts, callback);
            }).bind(this));

            // bind key event
            jQuery(window).bind("keydown.ax-dialog", (function (e) {
                this.onkeyup(e || window.event, opts, callback);
            }).bind(this));

            if (cfg.onopen) {
                cfg.onopen.call(this, this);
            }
            return this;
        };

        this.btnOnclick = function (e, opts, callback, target, k) {
            if (e.srcElement) e.target = e.srcElement;

            target = U.findParentNode(e.target, function (target) {
                if (target.getAttribute("data-ax-dialog-btn")) {
                    return true;
                }
            });

            if (target) {
                k = target.getAttribute("data-ax-dialog-btn");

                var that = {
                    key: k, value: opts.btns[k],
                    dialogId: opts.id,
                    btnTarget: target
                };
                if (opts.dialogType === "prompt") {
                    var emptyKey = null;
                    for (var oi in opts.input) {
                        that[oi] = this.activeDialog.find('[data-ax-dialog-prompt=' + oi + ']').val();
                        if (that[oi] == "" || that[oi] == null) {
                            emptyKey = oi;
                            break;
                        }
                    }
                }
                if (opts.btns[k].onclick) {
                    opts.btns[k].onclick.call(that, k);
                }
                else if (opts.dialogType === "alert") {
                    if (callback) callback.call(that, k);
                    this.close();
                }
                else if (opts.dialogType === "confirm") {
                    if (callback) callback.call(that, k);
                    this.close();
                }
                else if (opts.dialogType === "prompt") {
                    if (k === 'ok') {
                        if (emptyKey) {
                            this.activeDialog.find('[data-ax-dialog-prompt="' + emptyKey + '"]').get(0).focus();
                            return false;
                        }
                    }
                    if (callback) callback.call(that, k);
                    this.close();
                }
            }
        };

        this.onkeyup = function (e, opts, callback, target, k) {
            if (e.keyCode == ax5.info.eventKeys.ESC) {
                this.close();
            }
            if (opts.dialogType === "prompt") {
                if (e.keyCode == ax5.info.eventKeys.RETURN) {
                    var that = {
                        key: k, value: opts.btns[k],
                        dialogId: opts.id,
                        btnTarget: target
                    };
                    var emptyKey = null;
                    for (var oi in opts.input) {
                        that[oi] = this.activeDialog.find('[data-ax-dialog-prompt=' + oi + ']').val();
                        if (that[oi] == "" || that[oi] == null) {
                            emptyKey = oi;
                            break;
                        }
                    }
                    if (emptyKey) return false;
                    if (callback) callback.call(that, k);
                    this.close();
                }
            }
        };

        /**
         * close the dialog
         * @method ax5.ui.dialog.close
         * @returns {ax5.ui.dialog}
         * @example
         * ```
         * myDialog.close();
         * ```
         */
        this.close = function () {
            if (this.activeDialog) {
                this.activeDialog.remove();
                this.activeDialog = null;
                jQuery(window).unbind("keydown.ax-dialog");
                if (cfg.onclose) {
                    cfg.onclose.call(this, this);
                }
            }
            return this;
        }
    };
    //== UI Class

    //== ui class 공통 처리 구문
    if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
    root.dialog = axClass; // ax5.ui에 연결
    //== ui class 공통 처리 구문

})(ax5.ui, ax5.ui.root);