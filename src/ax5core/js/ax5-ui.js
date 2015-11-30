/**
 * Refer to this by {@link ax5}.
 * @namespace ax5.ui
 */

/**
 * @class ax5.ui.root
 * @classdesc ax5 ui class 코어 클래스 모든 클래스의 공통 함수를 가지고 있습니다.
 * @version v0.0.1
 * @author tom@axisj.com
 * @logs
 * 2014-12-12 tom : 시작
 * @example
 * ```
 * var myui = new ax5.ui.root();
 * ```
 */
ax5.ui = (function (core) {

	function ax_ui() {
		// 클래스 인스턴스 초기화
		this.main = (function(){
			this.config = {};
			this.name = "root";
		}).apply(this, arguments);

		/**
		 * 클래스의 속성 정의 메소드 속성 확장후에 내부에 init 함수를 호출합니다.
		 * @method ax5.ui.root.set_config
		 * @param {Object} config - 클래스 속성값
		 * @param {Boolean} [call_init=true] - init 함수 호출 여부
		 * @returns {ax5.ui.ax_ui}
		 * @example
		 * ```
		 * var myui = new ax5.ui.root();
		 * myui.set_config({
		 * 	id:"abcd"
		 * });
		 * ```
		 */
		this.set_config = function (cfg, call_init) {
			core.util.extend_all(this.config, cfg, true);
			if (typeof call_init == "undefined" || call_init === true) {
				this.init();
			}
			return this;
		};
		this.init = function () {
			console.log(this.config);
		};

		this.bind_window_resize = function(callBack){

			setTimeout((function(){
				ax5.dom.resize((function(){
					if(this.bind_window_resize__) clearTimeout(this.bind_window_resize__);
					this.bind_window_resize__ = setTimeout((function(){
						callBack.call(this);
					}).bind(this), 10);
				}).bind(this));
			}).bind(this), 100);

		};

		this.stop_event = function(e){
			if (e.preventDefault) e.preventDefault();
			if (e.stopPropagation) e.stopPropagation();
			e.cancelBubble = true;
			return false;
		}
	}

	return {
		root: ax_ui
	}
})(ax5);