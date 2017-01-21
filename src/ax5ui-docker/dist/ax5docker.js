"use strict";

/*
 * Copyright (c) 2017. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

(function () {

    var UI = ax5.ui,
        U = ax5.util;

    UI.addClass({
        className: "docker",
        version: "1.3.81"
    }, function () {

        /**
         * @class ax5docker
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```
         * var ax5docker = new ax5.ui.ax5docker();
         * ```
         */
        var ax5docker = function ax5docker() {

            var self = this,
                cfg = void 0;

            this.instanceId = ax5.getGuid();
            this.config = {};
            // 패널 정보
            this.panels = [];
            cfg = this.config;

            /**
             * @method ax5docker.setPanels
             * @returns {ax5docker}
             */
            this.setPanels = function (_panels) {

                console.log(_panels);

                return this;
            };

            // 클래스 생성자
            this.main = function () {
                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }.apply(this, arguments);
        };
        return ax5docker;
    }());
})();