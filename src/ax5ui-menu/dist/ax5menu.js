"use strict";

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
    var axClass = function axClass() {
        var self = this,
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
            return "\n            <div class=\"ax5-ui-menu {{theme}}\" id=\"{{id}}\" data-menu-els=\"root\">\n                <div class=\"ax-menu-body\">\n\n                </div>\n                <div class=\"ax-menu-arrow\"></div>\n            </div>\n            ";
        };

        this.popup = function () {};

        this.close = function () {};

        // 클래스 생성자
        this.main = function () {
            if (arguments && U.isObject(arguments[0])) {
                this.setConfig(arguments[0]);
            }
        }.apply(this, arguments);
    };
    //== UI Class

    root.menu = function () {
        if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
        return axClass;
    }(); // ax5.ui에 연결
})(ax5.ui, ax5.ui.root);