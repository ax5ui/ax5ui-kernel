// ax5.ui.uploader
(function () {

    let UI = ax5.ui;
    let U = ax5.util;

    UI.addClass({
        className: "uploader",
        version: "${VERSION}"
    }, (function () {

        let ax5uploader = function () {
            let self = this,
                cfg;

            this.instanceId = ax5.getGuid();
            this.config = {
                clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
                theme: 'default',
                file_types: "*/*"
            };

            /// 업로드된 파일 큐
            this.queue = [];
            /// 업로더 타겟
            this.$target = null;
            /// 업로드된 파일 정보들의 input 태그를 담아두는 컨테이너
            this.$inputContainer = null;
            /// input file 태그
            this.$inputFile = null;
            /// 파일 선택버튼
            this.$fileSelector = null;
            /// 파일 전송버튼
            this.$uploadControler = null;
            /// 파일 드랍존
            this.$dropZone = null;

            cfg = this.config;

            let __request_select_file = function () {
                if (cfg.before_select_file) {
                    if (!cfg.before_select_file.call()) {
                        return false; // 중지
                    }
                }

                if (window.imagePicker) {
                    window.imagePicker.getPictures(
                        function (results) {
                            for (var i = 0; i < results.length; i++) {
                                console.log('Image URI: ' + results[i]);
                            }
                            _this.__on_select_file(results);
                        }, function (error) {
                            console.log('Error: ' + error);
                        }
                    );
                } else {
                    this.els["input-file"].trigger("click");
                }
            };

            let __old_select_file = function (evt) {
                var file,
                    target_id = this.target.id,
                    preview = this.els["preview-img"].get(0);

                if ('dataTransfer' in evt) {
                    file = evt.dataTransfer.files[0];
                }
                else if ('target' in evt) {
                    file = evt.target.files[0];
                }
                else if (evt) {
                    file = evt[0];
                }

                if (!file) return false;
                // todo : size over check

                this.selected_file = file;
                // 선택된 이미지 프리뷰 기능
                (function (root) {
                    root.els["preview-img"].css({display: "block"});

                    function setcss_preview(img, box_width, box_height) {
                        var css = {};

                        var image = new Image();
                        image.src = img.src;
                        image.onload = function () {
                            // access image size here
                            //console.log(this.width, this.height);
                            if (this.width > this.height) { // 가로형
                                if (this.height > box_height) {
                                    css = {
                                        width: this.width * (box_height / this.height), height: box_height
                                    };
                                    css.left = (box_width - css.width) / 2;
                                }
                                else {
                                    css = {
                                        width: this.width, height: this.height
                                    };
                                    css.top = (box_height - css.height) / 2;
                                }
                            }
                            else { // 세로형
                                if (this.width > box_width) {
                                    css = {
                                        height: this.height * (box_width / this.width), width: box_width
                                    };
                                    css.top = (box_height - css.height) / 2;
                                }
                                else {
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

            let __old_upload = function () {
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

                this.els["progress"].css({display: "block"});
                progress_bar.css({width: '0%'});

                if (window.imagePicker) {
                    formData.append(cfg.upload_http.filename_param_key, this.selected_file);
                    // 다른 처리 방법 적용 필요
                }
                else {
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
                    progress_bar.css({width: U.number((e.loaded / e.total) * 100, {round: 2}) + '%'});
                    if (e.lengthComputable) {
                        if (e.loaded >= e.total) {
                            //_this.upload_complete();
                            setTimeout(function () {
                                _this.els["progress"].css({display: "none"});
                            }, 300);
                        }
                    }
                };
                this.xhr.send(formData);  // multipart/form-data
            };

            let bindEvent = function () {
                this.$fileSelector
                    .off("click.ax5uploader")
                    .on("click.ax5uploader", (function () {
                        this.$inputFile.trigger("click");
                    }).bind(this));
            };

            let alignLayout = function () {
                var box = this.$fileSelector.position();
                box.width = this.$fileSelector.outerWidth();
                box.height = this.$fileSelector.outerHeight();
                this.$inputFile.css(box);
                // 상황이 좋지 않은경우 (만약 버튼 클릭으로 input file click이 되지 않는 다면 z-index값을 높여서 버튼위를 덮는다.)

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
                /// controller 수집
                this.$uploadControler = this.$target.find('[data-ax5uploader-button="control"]');

                if(this.$fileSelector.length === 0){
                    console.log(ax5.info.getError("ax5uploader", "402", "can not find file selector"));
                    return this;
                }
                
                // input file 추가
                this.$inputFile = jQuery('<input type="file" />');
                this.$target.append(this.$inputFile);
                
                // align
                alignLayout.call(this);

                // 파일버튼 등에 이벤트 연결.
                bindEvent.call(this);

                (function () {
                    // dropZone 설정 방식 변경
                    return false;
                    var dragZone = this.els["container"],
                        preview_img = this.els["preview-img"],
                        _this = this, timer;

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

            // 클래스 생성자
            this.main = (function () {
                UI.uploader_instance = UI.uploader_instance || [];
                UI.uploader_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
                else {
                    //this.init();
                }
            }).apply(this, arguments);
        };
        return ax5uploader;
    })());

})();
