"use strict";

// ax5.ui.multiUploader
(function () {

    var UI = ax5.ui;
    var U = ax5.util;

    UI.addClass({
        className: "multiUploader",
        version: "0.0.1"
    }, function () {
        /**
         * @class ax5multiUploader
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```
         * var myuploader = new ax5.ui.multiUploader();
         * ```
         */
        var ax5multiUploader = function ax5multiUploader() {
            var self = this,
                cfg;

            this.instanceId = ax5.getGuid();
            this.config = {
                clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
                theme: 'default',
                file_types: "*/*"
            };
            this.queue = [];
            this.target = null;
            this.selectedFile = null;
            this.uploadedFile = null;

            cfg = this.config;

            this.init = function () {};

            // 클래스 생성자
            this.main = function () {

                UI.multiUploader_instance = UI.multiUploader_instance || [];
                UI.multiUploader_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                } else {
                    //this.init();
                }
            }.apply(this, arguments);
        };
        return ax5multiUploader;
    }());
})();