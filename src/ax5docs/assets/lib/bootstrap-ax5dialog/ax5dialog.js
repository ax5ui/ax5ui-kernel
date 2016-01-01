// ax5.ui.dialog
(function(root, ax_super) {

    /**
     * @class ax5.ui.dialog
     * @classdesc
     * @version v0.0.1
     * @author tom@axisj.com
     * @logs
     * 2014-06-15 tom : 시작
     * @example
     * ```
     * var my_dialog = new ax5.ui.dialog();
     * ```
     */

    var U = ax5.util, axd = ax5.dom;

    //== UI Class
    var ax_class = function(){
        // 클래스 생성자
        this.main = (function(){
            if (ax_super) ax_super.call(this); // 부모호출
            this.config = {
<<<<<<< HEAD
<<<<<<< HEAD
                clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
=======
                click_event_name: "click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
                mask: {
                    target: document.body,
                    content: ''
                },
>>>>>>> Revert "ax5dialog 90%"
=======
                click_event_name: "click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
>>>>>>> ax5dialog 90%
                theme: 'default',
                width: 300,
                title: '',
                msg: '',
                lang: {
                    "ok":"ok", "cancel":"cancel"
                }
            };
        }).apply(this, arguments);

<<<<<<< HEAD
<<<<<<< HEAD
        this.activeDialog = null;
=======
        this.active_dialog = null;
        this.mask = new ax5.ui.mask();
>>>>>>> Revert "ax5dialog 90%"
=======
        this.active_dialog = null;
>>>>>>> ax5dialog 90%

        var cfg = this.config;
        /**
         * Preferences of dialog UI
         * @method ax5.ui.dialog.set_config
         * @param {Object} config - 클래스 속성값
         * @returns {ax5.ui.dialog}
         * @example
         * ```
         * ```
         */
            //== class body start
<<<<<<< HEAD
<<<<<<< HEAD
        this.init = function () {
            // after setConfig();
=======
        this.init = function(){
            // after set_config();
>>>>>>> ax5dialog 90%
            cfg.id = 'ax5-dialog-' + ax5.getGuid();
=======
        this.init = function(){
            // after set_config();
            cfg.id = 'ax5-dialog-' + ax5.get_guid();

            this.mask.set_config(cfg.mask);
>>>>>>> Revert "ax5dialog 90%"
        };

        /**
         * open the dialog of alert type
         * @method ax5.ui.dialog.alert
         * @param {Object|String} [{theme, title, msg, btns}|msg] - dialog 속성을 json으로 정의하거나 msg만 전달
         * @param {Function} [callback] - 사용자 확인 이벤트시 호출될 callback 함수
         * @returns {ax5.ui.dialog}
         * @example
         * ```
         * my_dialog.alert({
		 *  title: 'app title',
		 *  msg: 'alert'
		 * }, function(){});
         * ```
         */
        this.alert = function(opts, callback) {
            if(U.is_string(opts)){
                opts = {
                    title: cfg.title,
                    msg: opts
                }
            }
            opts.dialog_type = "alert";
            opts.theme = (opts.theme || cfg.theme || "");
            if(typeof opts.btns === "undefined"){
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
         * my_dialog.confirm({
		 *  title: 'app title',
		 *  msg: 'confirm'
		 * }, function(){});
         * ```
         */
        this.confirm = function(opts, callback) {
            if(U.is_string(opts)){
                opts = {
                    title: cfg.title,
                    msg: opts
                }
            }
            opts.dialog_type = "confirm";
            opts.theme = (opts.theme || cfg.theme || "");
            if(typeof opts.btns === "undefined"){
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
         * my_dialog.prompt({
		 *  title: 'app title',
		 *  msg: 'alert'
		 * }, function(){});
         * ```
         */
        this.prompt = function(opts, callback) {
            if(U.is_string(opts)){
                opts = {
                    title: cfg.title,
                    msg: opts
                }
            }
            opts.dialog_type = "prompt";
            opts.theme = (opts.theme || cfg.theme || "");

            if(typeof opts.input === "undefined"){
                opts.input = {
                    value: {label: (opts.msg || cfg.msg || "")}
                };
            }
            if(typeof opts.btns === "undefined"){
                opts.btns = {
                    ok: {label: cfg.lang["ok"], theme: opts.theme},
                    cancel: {label: cfg.lang["cancel"]}
                };
            }
            this.open(opts, callback);
            return this;
        };


        this.get_content = function(dialog_id, opts){
            var
                po = [];

            po.push('<div id="' + dialog_id + '" data-ax5-ui="dialog" class="ax5-ui-dialog ' + opts.theme + '">');
            po.push('<div class="ax-dialog-heading">');
            po.push( (opts.title || cfg.title || "") );
            po.push('</div>');
            po.push('<div class="ax-dialog-body">');
            po.push('<div class="ax-dialog-msg">');

            po.push( (opts.msg || cfg.msg || "").replace(/\n/g, "<br/>") );

            if(opts.input){
                U.each(opts.input, function(k, v) {
                    po.push('<div class="ax-dialog-prompt">');
                    po.push( this.label.replace(/\n/g, "<br/>") );
                    po.push('</div>');
                    po.push('<input type="' + (this.type||'text') + '" placeholder="' + (this.placeholder||"") + ' " class="ax-inp ' + (this.klass||"") +'" data-ax-dialog-prompt="' + k + '" style="width:100%;" value="' + (this.value||"") + '" />');
                });
            }

            po.push('</div>');
            po.push('<div class="ax-dialog-buttons">');
            po.push('<div class="ax-button-wrap">');
            U.each(opts.btns, function(k, v){
                po.push('<button type="button" data-ax-dialog-btn="' + k + '" class="ax-btn ' + this.theme + '">' + this.label + '</button>');
            });
            po.push('</div>');
            po.push('</div>');
            po.push('</div>');
            po.push('</div>');
            return po.join('');
        };

        this.open = function(opts, callback){
            var
                pos = {},
                box = {},
                po;

            opts.id = (opts.id || cfg.id);

            this.mask.open();
            box = {
                width: opts.width || cfg.width
            };
            axd.append(document.body, this.get_content(opts.id, opts));
            this.active_dialog = ax5.dom('#' + opts.id);
            this.active_dialog.css({width: box.width});

            // dialog 높이 구하기 - 너비가 정해지면 높이가 변경 될 것.
            box.height = this.active_dialog.height();


            //console.log(ax5.dom.width(document.body));

            //- position 정렬
            if(typeof opts.position === "undefined" || opts.position === "center"){
                var w = window.innerWidth
                    || document.documentElement.clientWidth
                    || document.body.clientWidth;
                var h = window.innerHeight
                    || document.documentElement.clientHeight
                    || document.body.clientHeight;

                pos.top = h / 2 - box.height/2;
                pos.left = w / 2 - box.width/2;
            }else{
                pos.left = opts.position.left || 0;
                pos.top = opts.position.top || 0;
            }
            this.active_dialog.css(pos);

            // bind button event
            if(opts.dialog_type === "prompt") {
                this.active_dialog.find("[data-ax-dialog-prompt]").elements[0].focus();
            }else{
                this.active_dialog.find("[data-ax-dialog-btn]").elements[0].focus();
            }

            this.active_dialog.find("[data-ax-dialog-btn]").on(cfg.click_event_name, (function(e){
                this.btn_onclick(e||window.event, opts, callback);
            }).bind(this));

            // bind key event
            axd(window).on("keydown.ax-dialog", (function(e){
                this.onkeyup(e||window.event, opts, callback);
            }).bind(this));

            if(cfg.onopen){
                cfg.onopen.call(this, this);
            }
            return this;
        };

        this.btn_onclick = function(e, opts, callback, target, k){
            if(e.srcElement) e.target = e.srcElement;

            target = axd.parent(e.target, function(target){
                if(ax5.dom.attr(target, "data-ax-dialog-btn")){
                    return true;
                }
            });
            if(target){
                k = axd.attr(target, "data-ax-dialog-btn");

                var that = {
                    key: k, value: opts.btns[k],
                    dialog_id: opts.id,
                    btn_target: target
                };
                if(opts.dialog_type === "prompt") {
                    var empty_key = null;
                    for (var oi in opts.input) {
                        that[oi] = this.active_dialog.find('[data-ax-dialog-prompt=' + oi + ']').val();
                        if(that[oi] == "" || that[oi] == null){
                            empty_key = oi;
                            break;
                        }
                    }
                }
                if(opts.btns[k].onclick){
                    opts.btns[k].onclick.call(that, k);
                }
                else
                if(opts.dialog_type === "alert"){
                    if(callback) callback.call(that, k);
                    this.close();
                }
                else
                if(opts.dialog_type === "confirm"){
                    if(callback) callback.call(that, k);
                    this.close();
                }
                else
                if(opts.dialog_type === "prompt"){
                    if(k === 'ok') {
                        if(empty_key) {
                            this.active_dialog.find('[data-ax-dialog-prompt="' + empty_key + '"]').elements[0].focus();
                            return false;
                        }
                    }
                    if(callback) callback.call(that, k);
                    this.close();
                }
            }
        };

        this.onkeyup = function(e, opts, callback, target, k){
            if(e.keyCode == ax5.info.event_keys.ESC){
                this.close();
            }
            if(opts.dialog_type === "prompt") {
                if(e.keyCode == ax5.info.event_keys.RETURN){
                    var that = {
                        key: k, value: opts.btns[k],
                        dialog_id: opts.id,
                        btn_target: target
                    };
                    var empty_key = null;
                    for (var oi in opts.input) {
                        that[oi] = this.active_dialog.find('[data-ax-dialog-prompt=' + oi + ']').val();
                        if(that[oi] == "" || that[oi] == null){
                            empty_key = oi;
                            break;
                        }
                    }
                    if(empty_key) return false;
                    if(callback) callback.call(that, k);
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
         * my_dialog.close();
         * ```
         */
<<<<<<< HEAD
<<<<<<< HEAD
        this.close = function () {
            if (this.activeDialog) {
                this.activeDialog.remove();
                this.activeDialog = null;
                jQuery(window).unbind("keydown.ax-dialog");
                if (cfg.onclose) {
=======
        this.close = function(){
            if(this.active_dialog){
                this.active_dialog.remove();
                this.mask.close();
                this.active_dialog = null;
                axd(window).off("keydown.ax-dialog");
                if(cfg.onclose){
>>>>>>> Revert "ax5dialog 90%"
=======
        this.close = function(){
            if(this.active_dialog){
                this.active_dialog.remove();
                this.active_dialog = null;
                axd(window).off("keydown.ax-dialog");
                if(cfg.onclose){
>>>>>>> ax5dialog 90%
                    cfg.onclose.call(this, this);
                }
            }
            return this;
        }
    };
    //== UI Class

    //== ui class 공통 처리 구문
<<<<<<< HEAD
<<<<<<< HEAD
    if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
    root.dialog = axClass; // ax5.ui에 연결
=======
    if (U.is_function(ax_super)) ax_class.prototype = new ax_super(); // 상속
    root.dialog = ax_class; // ax5.ui에 연결
>>>>>>> Revert "ax5dialog 90%"
=======
    if (U.isFunction(ax_super)) ax_class.prototype = new ax_super(); // 상속
    root.dialog = ax_class; // ax5.ui에 연결
>>>>>>> ax5dialog 90%
    //== ui class 공통 처리 구문

})(ax5.ui, ax5.ui.root);


// todo : confirm 기능 구현 alert에 btns만 확장 하면 끄읏
// todo : prompt
// todo : toast
