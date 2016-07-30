/**
 * Refer to this by {@link ax5}.
 * @namespace ax5.ui
 */

/**
 * @class ax5.ui.root
 * @classdesc ax5 ui class
 * @version v0.1.0
 * @author tom@axisj.com
 * @example
 * ```
 * var myui = new ax5.ui.root();
 * ```
 */
ax5.ui = (function () {

    function axUi() {
        this.config = {};
        this.name = "root";

        /**
         * 클래스의 속성 정의 메소드 속성 확장후에 내부에 init 함수를 호출합니다.
         * @method ax5.ui.root.setConfig
         * @param {Object} config - 클래스 속성값
         * @param {Boolean} [callInit=true] - init 함수 호출 여부
         * @returns {ax5.ui.axUi}
         * @example
         * ```
         * var myui = new ax5.ui.root();
         * myui.setConfig({
		 * 	id:"abcd"
		 * });
         * ```
         */
        this.setConfig = function (cfg, callInit) {
            jQuery.extend(true, this.config, cfg, true);
            if (typeof callInit == "undefined" || callInit === true) {
                this.init();
            }
            return this;
        };
        this.init = function () {
            console.log(this.config);
        };

        this.bindWindowResize = function (callBack) {
            setTimeout((function () {
                jQuery(window).resize((function () {
                    if (this.bindWindowResize__) clearTimeout(this.bindWindowResize__);
                    this.bindWindowResize__ = setTimeout((function () {
                        callBack.call(this);
                    }).bind(this), 10);
                }).bind(this));
            }).bind(this), 100);
        };

        this.stopEvent = function (e) {
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
            e.cancelBubble = true;
            return false;
        };

        this.toString = function () {
            return this.name + '@' + this.version;
        };

        // instance init
        this.main = (function () {

        }).apply(this, arguments);
    }


    var addUI = function (key, version, cls) {
        /*
         if (ax5.ui.root) ax5.ui.root.call(this); // 부모호출
         if (ax5.util.isFunction(ax5.ui.root)) cls.prototype = new ax5.ui.root(); // 상속
         ax5.ui[key] = cls;
         */

        var factory = function (cls, arg) {
            switch (arg.length) {
                case 0:
                    return new cls();
                    break;
                case 1:
                    return new cls(arg[0]);
                    break;
                case 2:
                    return new cls(arg[0], arg[1]);
                    break;
            }
        };
        var initInstance = function (instance) {
            instance.a = "";
            return instance;
        };
        var initPrototype = function (cls) {
            var fn = cls.prototype;

        };

        var wrapper = function () {
            if (!this || !(this instanceof wrapper)) throw 'invalid call';
            var instance = factory(cls, arguments);
            return initInstance(instance);
        };
        initPrototype(cls);
        ax5.ui[key] = wrapper;
    };

    return {
        root: axUi,
        addUI: addUI
    }
})();