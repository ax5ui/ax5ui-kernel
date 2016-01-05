// ax5.ui.toast
(function(root, ax_super) {

	/**
	 * @class ax5.ui.toast
	 * @classdesc
	 * @version v0.0.1
	 * @author tom@axisj.com
	 * @logs
	 * 2014-06-17 tom : 시작
	 * @example
	 * ```
	 * var my_toast = new ax5.ui.toast();
	 * ```
	 */

	var U = ax5.util, axd = ax5.dom;

	//== UI Class
	var ax_class = function(){
		// 클래스 생성자
		this.main = (function(){
			if (ax_super) ax_super.call(this); // 부모호출
			this.config = {
				click_event_name: "click", //(('ontouchstart' in document.documentElement) ? "touchstart" : "click"),
				theme: 'default',
				width: 300,
				axicon: '<i class="axi axi-axisj"></i>',
				msg: '',
				display_time: 3000,
				animate_time: 200
			};
		}).apply(this, arguments);

		this.toast_container = null;
		this.queue = [];

		var cfg = this.config;
		/**
		 * Preferences of toast UI
		 * @method ax5.ui.toast.set_config
		 * @param {Object} config - 클래스 속성값
		 * @returns {ax5.ui.toast}
		 * @example
		 * ```
		 * ```
		 */
		//== class body start
		this.init = function(){
			// after set_config();
			var container_id = ax5.get_guid();
			axd.append(document.body, '<div class="ax5-ui-toast-container" data-toast-container="' +
				'' + container_id + '"></div>');
			this.toast_container = ax5.dom('[data-toast-container="' + container_id + '"]');
		};

		/**
		 * open the toast of alert type
		 * @method ax5.ui.toast.alert
		 * @param {Object|String} [{theme, axicon, msg, btns}|msg] - toast 속성을 json으로 정의하거나 msg만 전달
		 * @param {Function} [callback] - 사용자 확인 이벤트시 호출될 callback 함수
		 * @returns {ax5.ui.toast}
		 * @example
		 * ```
		 * my_toast.alert({
		 *  title: '<i class="axi axi-axisj"></i>',
		 *  msg: 'alert'
		 * }, function(){});
		 * ```
		 */
		this.push = function(opts, callback) {
			if(U.is_string(opts)){
				opts = {
					title: cfg.title,
					msg: opts
				}
			}
			opts.toast_type = "push";
			opts.theme = (opts.theme || cfg.theme || "");
			this.open(opts, callback);
			return this;
		};

		/**
		 * open the toast of confirm type
		 * @method ax5.ui.toast.confirm
		 * @param {Object|String} [{theme, axicon, msg, btns}|msg] - toast 속성을 json으로 정의하거나 msg만 전달
		 * @param {Function} [callback] - 사용자 확인 이벤트시 호출될 callback 함수
		 * @returns {ax5.ui.toast}
		 * @example
		 * ```
		 * my_toast.confirm({
		 *  axicon: '<i class="axi axi-axisj"></i>',
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
			opts.toast_type = "confirm";
			opts.theme = (opts.theme || cfg.theme || "");
			if(typeof opts.btns === "undefined"){
				opts.btns = {
					ok: {label: 'ok', theme: opts.theme}
				};
			}
			this.open(opts, callback);
			return this;
		};

		this.get_content = function(toast_id, opts){
			var po = [];
			po.push('<div id="' + toast_id + '" data-ax5-ui="toast" class="ax5-ui-toast ' + opts.theme + '">');
				po.push('<div class="ax-toast-axicon">');
					po.push( (opts.axicon || cfg.axicon || "") );
				po.push('</div>');
				po.push('<div class="ax-toast-body">');
					po.push( (opts.msg || cfg.msg || "").replace(/\n/g, "<br/>") );
				po.push('</div>');
				if(opts.btns) {
					po.push('<div class="ax-toast-buttons">');
						po.push('<div class="ax-button-wrap">');
							U.each(opts.btns, function (k, v) {
								po.push('<button type="button" data-ax-toast-btn="' + k + '" class="ax-btn ' + this.theme + '">' + this.label + '</button>');
							});
						po.push('</div>');
					po.push('</div>');
				}

				po.push('<div style="clear:both;"></div>');
			po.push('</div>');
			return po.join('');
		};

		this.open = function(opts, callback){
			var
				toast_box,
				box = {},
				po;

			opts.id = 'ax5-toast-' + this.queue.length;
			this.queue.push(opts);
			box = {
				width: opts.width || cfg.width
			};
			this.toast_container.prepend( this.get_content(opts.id, opts) );
			toast_box = ax5.dom('#' + opts.id);
			toast_box.css({width: box.width});

			if(opts.toast_type === "push"){
				// 자동 제거 타이머 시작
				setTimeout((function(){
					this.close(opts, toast_box, callback);
				}).bind(this), cfg.display_time);
			}
			else
			if(opts.toast_type === "confirm"){
				toast_box.find("[data-ax-toast-btn]").on(cfg.click_event_name, (function(e){
					this.btn_onclick(e||window.event, opts, toast_box, callback);
				}).bind(this));
			}
		};

		this.btn_onclick = function(e, opts, toast_box, callback, target, k){
			target = axd.parent(e.target, function(target){
				if(ax5.dom.attr(target, "data-ax-toast-btn")){
					return true;
				}
			});
			if(target){
				k = axd.attr(target, "data-ax-toast-btn");
				var that = {
						key: k, value: opts.btns[k],
						toast_id: opts.id,
						btn_target: target
					};

				if(opts.btns[k].onclick){
					opts.btns[k].onclick.call(that, k);
				}
				else
				if(opts.toast_type === "confirm"){
					if(callback) callback.call(that, k);
					this.close(opts, toast_box);
				}
			}
		};

		// todo : confirm 타입 토스트일 때 키보드 이벤트 추가 할 수 있음.
		this.onkeyup = function(e, opts, callback, target, k){
			if(e.keyCode == ax5.info.event_keys.ESC){
				this.close();
			}
		};

		/**
		 * close the toast
		 * @method ax5.ui.toast.close
		 * @returns {ax5.ui.toast}
		 * @example
		 * ```
		 * my_toast.close();
		 * ```
		 */
		this.close = function(opts, toast_box, callback){
			if(typeof toast_box === "undefined") {
				opts = U.last(this.queue);
				toast_box = ax5.dom('#' + opts.id);
			}
			var that = {
				toast_id: opts.id
			};

			toast_box.class_name("add", (opts.toast_type == "push") ? "removed" : "destroy");
			this.queue = U.filter(this.queue, function () {
				return opts.id != this.id;
			});
			setTimeout(function () {
				toast_box.remove();
				if(callback) callback.call(that);
			}, cfg.animate_time);
			return this;
		}
	};
	//== UI Class

	//== ui class 공통 처리 구문
	if (U.is_function(ax_super)) ax_class.prototype = new ax_super(); // 상속
	root.toast = ax_class; // ax5.ui에 연결

	if (typeof define === "function" && define.amd) {
		define("_ax5_ui_toast", [], function () { return ax_class; }); // for requireJS
	}
	//== ui class 공통 처리 구문

})(ax5.ui, ax5.ui.root);


// todo : confirm 기능 구현 alert에 btns만 확장 하면 끄읏
// todo : prompt
// todo : toast