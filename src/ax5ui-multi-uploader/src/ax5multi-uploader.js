// ax5.ui.multiUploader
(function () {

    var UI = ax5.ui;
    var U = ax5.util;

    UI.addClass({
        className: "multiUploader",
        version: "0.0.1"
    }, (function () {
        /**
         * @class ax5multiUploader
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```js
         * var upload = new ax5.ui.uploader();
         * $(document.body).ready(function () {
         *     upload.setConfig({
         *         target: $("#user-info-profileImageUrl"),
         *         file_types: "image/*",
         *         empty_msg: "프로필 사진",
         *         progress_theme: "basic",
         *         upload_http: {
         *             method: "POST",
         *             url: "/api/v1/aws/s3/upload",
         *             filename_param_key: "file",
         *             data: {bucket: "gajago-user-profile", crop: true}
         *         },
         *         on_event: function (that) {
         *             if (that.action == "fileselect") {
         *                 console.log(that.file);
         *             }
         *             else if (that.action == "uploaded") {
         *                 _root.form.profile_uploaded(that.file);
         *             }
         *             else if (that.action == "error") {
         *                 alert(that.error.msg);
         *             }
         *         }
         *     });
         * });
         * ```
         */
        var ax5multiUploader = function () {
            var
                self = this,
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

            this.init = function () {

            };

            // 클래스 생성자
            this.main = (function () {

                UI.multiUploader_instance = UI.multiUploader_instance || [];
                UI.multiUploader_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
                else {
                    //this.init();
                }
            }).apply(this, arguments);
        };
        return ax5multiUploader;
    })());

})();
