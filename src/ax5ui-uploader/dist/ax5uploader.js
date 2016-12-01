"use strict";

// ax5.ui.uploader
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var UPLOADER = void 0;

    UI.addClass({
        className: "uploader",
        version: "${VERSION}"
    }, function () {

        var ax5uploader = function ax5uploader() {
            var self = this,
                cfg = void 0;

            this.instanceId = ax5.getGuid();
            this.config = {
                clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
                theme: 'default',
                accept: "*/*",
                multiple: false
            };

            /// 업로드된 파일 큐
            this.uploadedFiles = [];
            /// 업로더 타겟
            this.$target = null;
            /// 업로드된 파일 정보들의 input 태그를 담아두는 컨테이너
            this.$inputContainer = null;
            /// input file 태그
            this.$inputFile = null;
            this.$inputFileForm = null;
            /// 파일 선택버튼
            this.$fileSelector = null;
            /// 파일 드랍존
            this.$dropZone = null;

            cfg = this.config;

            var onSelectFile = function onSelectFile(_evt) {
                var files;

                if (!ax5.info.supportFileApi) {
                    // file API 지원 안되는 브라우저.
                } else if ('dataTransfer' in _evt) {
                    files = _evt.dataTransfer.files;
                } else if ('target' in _evt) {
                    files = _evt.target.files;
                } else if (_evt) {
                    files = _evt;
                }

                if (!files) return false;

                /// selectedFiles에 현재 파일 정보 담아두기
                this.selectedFiles = files;

                console.log(this.selectedFiles);
                openProgressBox.call(this);
            };

            var upload = function upload() {
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

            var bindEvent = function bindEvent() {
                this.$fileSelector.off("click.ax5uploader").on("click.ax5uploader", function () {
                    this.$inputFile.trigger("click");
                }.bind(this));

                this.$inputFile.off("change.ax5uploader").on("change.ax5uploader", function (_evt) {
                    onSelectFile.call(this, _evt);
                }.bind(this));

                (function () {
                    // dropZone 설정 방식 변경
                    return false;
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
            };

            var alignLayout = function alignLayout() {
                // 상황이 좋지 않은경우 (만약 버튼 클릭으로 input file click이 되지 않는 다면 z-index값을 높여서 버튼위를 덮는다.)
                /*
                var box = this.$fileSelector.position();
                box.width = this.$fileSelector.outerWidth();
                box.height = this.$fileSelector.outerHeight();
                this.$inputFile.css(box);
                */
            };

            var alignProgressBox = function alignProgressBox(append) {
                var _alignProgressBox = function _alignProgressBox() {
                    var $window = jQuery(window),
                        $body = jQuery(document.body);
                    var pos = {},
                        positionMargin = 6,
                        dim = {},
                        pickerDim = {},
                        pickerDirection;

                    pos = this.$fileSelector.offset();
                    dim = {
                        width: this.$fileSelector.outerWidth(),
                        height: this.$fileSelector.outerHeight()
                    };
                    pickerDim = {
                        winWidth: Math.max($window.width(), $body.width()),
                        winHeight: Math.max($window.height(), $body.height()),
                        width: this.$progressBox.outerWidth(),
                        height: this.$progressBox.outerHeight()
                    };

                    // picker css(width, left, top) & direction 결정

                    if (!cfg.direction || cfg.direction === "" || cfg.direction === "auto") {
                        // set direction
                        pickerDirection = "top";
                        if (pos.top - pickerDim.height - positionMargin < 0) {
                            pickerDirection = "top";
                        } else if (pos.top + dim.height + pickerDim.height + positionMargin > pickerDim.winHeight) {
                            pickerDirection = "bottom";
                        }
                    } else {
                        pickerDirection = cfg.direction;
                    }

                    if (append) {
                        this.$progressBox.addClass("direction-" + pickerDirection);
                    }

                    var positionCSS = function () {
                        var css = { left: 0, top: 0 };
                        switch (pickerDirection) {
                            case "top":
                                css.left = pos.left + dim.width / 2 - pickerDim.width / 2;
                                css.top = pos.top + dim.height + positionMargin;
                                break;
                            case "bottom":
                                css.left = pos.left + dim.width / 2 - pickerDim.width / 2;
                                css.top = pos.top - pickerDim.height - positionMargin;
                                break;
                            case "left":
                                css.left = pos.left + dim.width + positionMargin;
                                css.top = pos.top - pickerDim.height / 2 + dim.height / 2;
                                break;
                            case "right":
                                css.left = pos.left - pickerDim.width - positionMargin;
                                css.top = pos.top - pickerDim.height / 2 + dim.height / 2;
                                break;
                        }
                        return css;
                    }();

                    (function () {
                        if (pickerDirection == "top" || pickerDirection == "bottom") {
                            if (positionCSS.left < 0) {
                                positionCSS.left = positionMargin;
                                this.$progressBoxArrow.css({ left: pos.left + dim.width / 2 - positionCSS.left });
                            } else if (positionCSS.left + pickerDim.width > pickerDim.winWidth) {
                                positionCSS.left = pickerDim.winWidth - pickerDim.width - positionMargin;
                                this.$progressBoxArrow.css({ left: pos.left + dim.width / 2 - positionCSS.left });
                            }
                        }
                    }).call(this);

                    this.$progressBox.css(positionCSS);
                };

                this.$progressBox.css({ top: -999 });

                if (append) jQuery(document.body).append(this.$progressBox);
                setTimeout(function () {
                    _alignProgressBox.call(this);
                }.bind(this));
            };

            var openProgressBox = function openProgressBox() {
                alignProgressBox.call(this, "append");
            };

            this.init = function (_config) {
                cfg = jQuery.extend(true, {}, cfg, _config);
                if (!cfg.target) {
                    console.log(ax5.info.getError("ax5uploader", "401", "init"));
                    return this;
                }

                this.$target = jQuery(cfg.target);

                // 파일 드랍존은 옵션 사항.
                if (cfg.dropZone) {
                    this.$dropZone = jQuery(cfg.dropZone);
                }

                // target attribute data
                (function (data) {
                    if (U.isObject(data) && !data.error) {
                        cfg = jQuery.extend(true, cfg, data);
                    }
                }).call(this, U.parseJson(this.$target.attr("data-ax5uploader-config"), true));

                // input container 추가
                this.$inputContainer = jQuery('<div data-ax5uploader-input-container=""></div>');
                this.$target.append(this.$inputContainer);

                // detect element
                /// fileSelector 수집
                this.$fileSelector = this.$target.find('[data-ax5uploader-button="selector"]');

                if (this.$fileSelector.length === 0) {
                    console.log(ax5.info.getError("ax5uploader", "402", "can not find file selector"));
                    return this;
                }

                // input file 추가
                this.$inputFile = jQuery(UPLOADER.tmpl.get.call(this, "inputFile", {
                    instanceId: this.instanceId,
                    multiple: cfg.multiple,
                    accept: cfg.accept
                }));

                if (ax5.info.supportFileApi) {
                    jQuery(document.body).append(this.$inputFile);
                } else {
                    this.$inputFileForm = jQuery(UPLOADER.tmpl.get.call(this, "inputFileForm", {
                        instanceId: this.instanceId
                    }));
                    this.$inputFileForm.append(this.$inputFile);
                    jQuery(document.body).append(this.$inputFileForm);
                }

                this.$progressBox = jQuery(UPLOADER.tmpl.get.call(this, "progressBox", {
                    instanceId: this.instanceId
                }));
                this.$progressBox.addClass("direction-top");
                this.$progressBoxArrow = this.$progressBox.find(".ax-progressbox-arrow");

                // 레이아웃 정렬
                alignLayout.call(this);
                // 파일버튼 등에 이벤트 연결.
                bindEvent.call(this);
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

    UPLOADER = ax5.ui.uploader;
})();

// ax5.ui.uploader.tmpl
(function () {

    var UPLOADER = ax5.ui.uploader;

    var uploadProgress = function uploadProgress(columnKeys) {
        return "\n        ";
    };

    var inputFile = function inputFile(columnKeys) {
        return "<input type=\"file\" data-ax5uploader-input=\"{{instanceId}}\" {{#multiple}}multiple{{/multiple}} accept=\"{{accept}}\" />";
    };

    var inputFileForm = function inputFileForm(columnKeys) {
        return "<form data-ax5uploader-form=\"{{instanceId}}\" method=\"post\" enctype=\"multipart/form-data\"></form>";
    };

    var progressBox = function progressBox(columnKeys) {
        return "\n<div data-ax5uploader-progressbox=\"{{instanceId}}\" class=\"{{theme}}\">\n    <div class=\"ax-progressbox-body\">\n        <div class=\"ax-pregressbox-content\">\n            <div class=\"progress\">\n              <div class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" style=\"width: 0\">\n                <span class=\"sr-only\">0% Complete</span>\n              </div>\n            </div>\n        </div>\n        {{#btns}}\n            <div class=\"ax-pregressbox-buttons\">\n            {{#btns}}\n                {{#@each}}\n                <button data-pregressbox-btn=\"{{@key}}\" class=\"btn btn-default {{@value.theme}}\">{{@value.label}}</button>\n                {{/@each}}\n            {{/btns}}\n            </div>\n        {{/btns}}\n    </div>\n    <div class=\"ax-progressbox-arrow\"></div>\n</div>\n";
    };

    UPLOADER.tmpl = {
        "uploadProgress": uploadProgress,
        "inputFile": inputFile,
        "inputFileForm": inputFileForm,
        "progressBox": progressBox,

        get: function get(tmplName, data, columnKeys) {
            return ax5.mustache.render(UPLOADER.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();