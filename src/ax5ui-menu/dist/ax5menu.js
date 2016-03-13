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
            theme: "default",
            width: 200,
            direction: "top-left", // top-left|top-right|bottom-left|bottom-right
            animateTime: 250,
            items: []
        };

        this.openTimer = null;
        this.closeTimer = null;

        cfg = this.config;

        this.init = function () {
            // after set_config();
            self.menuId = ax5.getGuid();
        };

        /** private **/
        this.__getTmpl = function () {
            return "\n            <div class=\"ax5-ui-menu {{theme}}\">\n                <div class=\"ax-menu-body\">\n                    {{#items}}\n                    <div class=\"ax-menu-item\">{{label}}</div>\n                    {{/items}}\n                </div>\n                <div class=\"ax-menu-arrow\"></div>\n            </div>\n            ";
        };

        /** private **/
        this.__popup = function (opt, items) {
            var data = opt,
                activeMenu;
            data.items = items;
            activeMenu = jQuery(ax5.mustache.render(this.__getTmpl(), data));
            jQuery(document.body).append(activeMenu);

            this.__align(activeMenu);
        };

        /** private **/
        this.__align = function (activeMenu) {
            console.log(activeMenu.height());
        };

        /**
         * @method ax5.ui.menu.popup
         * @param {Event|Object} e - Event or Object
         * @param {Object} [opt]
         * @returns {ax5.ui.menu} this
         */
        this.popup = function () {

            var getOption = {
                'event': function event(e, opt) {
                    e = {
                        left: e.clientX,
                        top: e.clientY,
                        width: cfg.width,
                        theme: cfg.theme,
                        direction: cfg.direction
                    };
                    opt = jQuery.extend(true, e, opt);
                    return opt;
                },
                'object': function object(e, opt) {
                    e = {
                        left: e.left,
                        top: e.top,
                        width: e.width || cfg.width,
                        theme: e.theme || cfg.theme,
                        direction: e.direction || cfg.direction
                    };
                    opt = jQuery.extend(true, e, opt);
                    return opt;
                }
            };

            return function (e, opt) {

                if (!e) return this;
                opt = getOption[typeof e.clientX == "undefined" ? "object" : "event"].call(this, e, opt);
                this.__popup(opt, cfg.items);

                return this;
            };
        }();

        /**
         * @method ax5.ui.menu.close
         * @returns {ax5.ui.menu} this
         */
        this.close = function () {

            return this;
        };

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