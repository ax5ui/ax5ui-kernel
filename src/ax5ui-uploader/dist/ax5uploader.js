"use strict";

// ax5.ui.uploader
(function () {

    var UI = ax5.ui;
    var U = ax5.util;

    UI.addClass({
        className: "uploader",
        version: "0.0.5"
    }, function () {
        /**
         * @class ax5uploader
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
         *                 //console.log(that.file);
         *             }
         *             else if (that.action == "uploaded") {
         *                 //console.log(that);
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
        var ax5uploader = function ax5uploader() {
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

            this.init = function () {

                this.target = $(cfg.target);
                this.target.html(this.__get_layout());

                this.els = {
                    "container": this.target.find('[data-ui-els="container"]'),
                    "preview": this.target.find('[data-ui-els="preview"]'),
                    "preview-img": this.target.find('[data-ui-els="preview-img"]'),
                    "input-file": this.target.find('[data-ui-els="input-file"]'),
                    "progress": this.target.find('[data-ui-els="progress"]'),
                    "progress-bar": this.target.find('[data-ui-els="progress-bar"]')
                };

                this.els["preview"].bind("click", function () {
                    this.__request_select_file();
                }.bind(this));

                this.els["input-file"].bind("change", function (e) {
                    this.__on_select_file(e || window.event);
                }.bind(this));

                (function () {

                    var dragZone = this.els["container"],
                        preview_img = this.els["preview-img"],
                        _this = this,
                        timer;

                    dragZone.get(0).addEventListener('dragover', function (e) {
                        e.stopPropagation();
                        e.preventDefault();

                        preview_img.hide();
                        if (timer) clearTimeout(timer);

                        dragZone.addClass("dragover");
                    }, false);
                    dragZone.get(0).addEventListener('dragleave', function (e) {
                        e.stopPropagation();
                        e.preventDefault();

                        if (timer) clearTimeout(timer);
                        timer = setTimeout(function () {
                            preview_img.show();
                        }, 100);

                        dragZone.removeClass("dragover");
                    }, false);

                    dragZone.get(0).addEventListener('drop', function (e) {
                        e.stopPropagation();
                        e.preventDefault();

                        dragZone.removeClass("dragover");
                        _this.__on_select_file(e || window.event);
                    }, false);
                }).call(this);

                setTimeout(function () {
                    this.__set_size_layout();
                }.bind(this), 1);
            };

            this.__get_layout = function () {
                var po = [],
                    inputFileMultiple = "",
                    // inputFileMultiple = 'multiple="multiple"',  support multifile
                inputFileAccept = cfg.file_types;

                po.push('<div class="ax5-ui-single-uploader ' + cfg.theme + '" data-ui-els="container">');
                po.push('<div class="upload-preview" data-ui-els="preview">');

                po.push('<img class="upload-preview-img" data-ui-els="preview-img" src="" style="display:none;width:100%;height:100%;" />');
                po.push('<span class="empty-msg">' + cfg.empty_msg + '<span>');
                po.push('</div>');
                po.push('<div class="ax5-ui-progress ' + (cfg.progress_theme || "") + '" data-ui-els="progress" style="display: none;"><div class="progress-bar" data-ui-els="progress-bar"></div></div>');
                po.push('<input type="file" ' + inputFileMultiple + ' accept="' + inputFileAccept + '" capture="camera" data-ui-els="input-file" />');

                po.push('</div>');

                return po.join('');
            };

            this.__set_size_layout = this.align = function () {
                var progress_margin = 20,
                    progress_height = this.els["progress"].height(),
                    ct_width = this.els["container"].width(),
                    ct_height = this.els["container"].height();

                if (ct_width != 0 && ct_height != 0) {
                    this.els["progress"].css({
                        left: progress_margin,
                        top: ct_height / 2 - progress_height / 2,
                        width: ct_width - progress_margin * 2
                    });
                }
                //this.els["preview-img"].css({width: ct_width, height: ct_height});
            };

            this.__request_select_file = function () {
                if (cfg.before_select_file) {
                    if (!cfg.before_select_file.call()) {
                        return false; // 중지
                    }
                }

                if (window.imagePicker) {
                    window.imagePicker.getPictures(function (results) {
                        for (var i = 0; i < results.length; i++) {
                            console.log('Image URI: ' + results[i]);
                        }
                        _this.__on_select_file(results);
                    }, function (error) {
                        console.log('Error: ' + error);
                    });
                } else {
                    this.els["input-file"].trigger("click");
                }
            };

            this.__on_select_file = function (evt) {
                var file,
                    target_id = this.target.id,
                    preview = this.els["preview-img"].get(0);

                if ('dataTransfer' in evt) {
                    file = evt.dataTransfer.files[0];
                } else if ('target' in evt) {
                    file = evt.target.files[0];
                } else if (evt) {
                    file = evt[0];
                }

                if (!file) return false;
                // todo : size over check

                this.selected_file = file;
                // 선택된 이미지 프리뷰 기능
                (function (root) {
                    root.els["preview-img"].css({ display: "block" });

                    function setcss_preview(img, box_width, box_height) {
                        var css = {};

                        var image = new Image();
                        image.src = img.src;
                        image.onload = function () {
                            // access image size here
                            //console.log(this.width, this.height);
                            if (this.width > this.height) {
                                // 가로형
                                if (this.height > box_height) {
                                    css = {
                                        width: this.width * (box_height / this.height), height: box_height
                                    };
                                    css.left = (box_width - css.width) / 2;
                                } else {
                                    css = {
                                        width: this.width, height: this.height
                                    };
                                    css.top = (box_height - css.height) / 2;
                                }
                            } else {
                                // 세로형
                                if (this.width > box_width) {
                                    css = {
                                        height: this.height * (box_width / this.width), width: box_width
                                    };
                                    css.top = (box_height - css.height) / 2;
                                } else {
                                    css = {
                                        width: this.width, height: this.height
                                    };
                                    css.left = (box_width - css.width) / 2;
                                }
                            }
                            console.log(css);
                            root.els["preview-img"].css(css);
                        };
                    }

                    if (window.imagePicker) {
                        preview.src = file;
                        setcss_preview(preview, root.els["container"].width(), root.els["container"].height());
                    } else {
                        var reader = new FileReader(target_id);
                        reader.onloadend = function () {
                            try {
                                preview.src = reader.result;
                                setcss_preview(preview, root.els["container"].width(), root.els["container"].height());
                            } catch (ex) {
                                console.log(ex);
                            }
                        };
                        if (file) {
                            reader.readAsDataURL(file);
                        }
                    }
                })(this);

                if (cfg.on_event) {
                    var that = {
                        action: "fileselect",
                        file: file
                    };
                    cfg.on_event.call(that, that);
                }

                /// 파일 선택하면 업로드
                // if(file) this.upload(file);
            };

            this.upload = function () {
                var _this = this;
                if (!this.selected_file) {
                    if (cfg.on_event) {
                        var that = {
                            action: "error",
                            error: ax5.info.get_error("single-uploader", "460", "upload")
                        };
                        cfg.on_event.call(that, that);
                    }
                    return this;
                }

                var formData = new FormData(),
                    progress_bar = this.els["progress-bar"];

                this.els["progress"].css({ display: "block" });
                progress_bar.css({ width: '0%' });

                if (window.imagePicker) {
                    formData.append(cfg.upload_http.filename_param_key, this.selected_file);
                    // 다른 처리 방법 적용 필요
                } else {
                    formData.append(cfg.upload_http.filename_param_key, this.selected_file);
                }

                for (var k in cfg.upload_http.data) {
                    formData.append(k, cfg.upload_http.data[k]);
                }

                this.xhr = new XMLHttpRequest();
                this.xhr.open(cfg.upload_http.method, cfg.upload_http.url, true);
                this.xhr.onload = function (e) {
                    var res = e.target.response;
                    try {
                        if (typeof res == "string") res = U.parseJson(res);
                    } catch (e) {
                        console.log(e);
                        return false;
                    }
                    if (res.error) {
                        console.log(res.error);
                        return false;
                    }
                    _this.upload_complete(res);
                };
                this.xhr.upload.onprogress = function (e) {
                    progress_bar.css({ width: U.number(e.loaded / e.total * 100, { round: 2 }) + '%' });
                    if (e.lengthComputable) {
                        if (e.loaded >= e.total) {
                            //_this.upload_complete();
                            setTimeout(function () {
                                _this.els["progress"].css({ display: "none" });
                            }, 300);
                        }
                    }
                };
                this.xhr.send(formData); // multipart/form-data
            };

            this.upload_complete = function (res) {
                this.selected_file = null;
                this.uploaded_file = res;
                this.els["container"].addClass("uploaded");

                if (cfg.on_event) {
                    var that = {
                        action: "uploaded",
                        file: res
                    };
                    cfg.on_event.call(that, that);
                }
            };

            this.set_uploaded_file = function (file) {
                this.uploaded_file = file;
                if (this.uploaded_file) {
                    this.els["container"].addClass("uploaded");
                } else {
                    this.els["container"].removeClass("uploaded");
                }
            };

            this.set_preview_img = function (src) {
                if (src) {
                    this.els["preview-img"].attr({ "src": src }).show();
                } else {
                    this.els["preview-img"].attr({ "src": null }).hide();
                }
            };

            // 클래스 생성자
            this.main = function () {

                UI.uploader_instance = UI.uploader_instance || [];
                UI.uploader_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                } else {
                    //this.init();
                }
            }.apply(this, arguments);
        };
        return ax5uploader;
    }());
})();