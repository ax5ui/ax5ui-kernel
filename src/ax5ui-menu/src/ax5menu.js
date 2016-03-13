// ax5.ui.menu
(function (root, _SUPER_) {
    
    /**
     * @class ax5.ui.menu
     * @classdesc
     * @version v0.0.1
     * @author tom@axisj.com
     * @example
     * ```
     * var menu = new ax5.ui.menu();
     * ```
     */
    var U = ax5.util;
    
    //== UI Class
    var axClass = function () {
        var
            self = this,
            cfg;
        
        if (_SUPER_) _SUPER_.call(this); // 부모호출

        this.config = {
            animateTime: 250
        };
        
        this.openTimer = null;
        this.closeTimer = null;
        
        cfg = this.config;

        this.init = function () {
            // after set_config();
            self.menuId = ax5.getGuid();
        };

        this.__getTmpl = function () {
            return `
            <div class="ax5-ui-menu {{theme}}">
                <div class="ax-menu-body">

                </div>
                <div class="ax-menu-arrow"></div>
            </div>
            `;
        };

        /**
         * @method ax5.ui.menu.popup
         * @param {Event|Object} e - Event or Object
         * @returns {ax5.ui.menu} this
         */
        this.popup = function (e) {

            return this;
        };

        this.__popup = function () {

        };

        /**
         * @method ax5.ui.menu.close
         * @returns {ax5.ui.menu} this
         */
        this.close = function () {

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
    
    root.menu = (function () {
        if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
        return axClass;
    })(); // ax5.ui에 연결
    
})(ax5.ui, ax5.ui.root);