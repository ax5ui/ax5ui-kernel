// ax5.ui.uploader
(function () {

    let UI = ax5.ui;
    let U = ax5.util;
    let UPLOADER;

    UI.addClass({
        className: "uploader",
        version: "${VERSION}"
    }, (function () {

        let ax5uploader = function () {
            /**
             * @class ax5uploader
             * @classdesc
             * @author tom@axisj.com
             * @example
             * ```js
             *
             * ```
             */
            let self = this,
                cfg;

            this.instanceId = ax5.getGuid();
            this.config = {
                clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
                theme: 'default', // theme of uploader
                lang: { // 업로더 버튼 랭귀지 설정
                    "upload": "Upload",
                    "abort": "Abort"
                },
                uploadedBox: {
                    columnKeys: {
                        name: "name",
                        type: "type",
                        size: "size",
                        uploadedName: "uploadedName",
                        uploadedPath: "uploadedPath",
                        downloadPath: "downloadPath",
                        previewPath: "previewPath",
                        thumbnail: "thumbnail"
                    }
                },
                animateTime: 100,
                accept: "*/*", // 업로드 선택 파일 타입 설정
                multiple: false, // 다중 파일 업로드
                manualUpload: false, // 업로딩 시작 수동처리 여부
                progressBox: true // 업로드 프로그래스 박스 사용여부 false 이면 업로드 진행바를 표시 하지 않습니다. 개발자가 onprogress 함수를 이용하여 직접 구현 해야 합니다.
            };
            this.defaultBtns = {
                "upload": {label: this.config.lang["upload"], theme: "btn-primary"},
                "abort": {label: this.config.lang["abort"], theme: this.config.theme}
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
            this.__uploading = false;
            this.selectedFiles = [];
            this.selectedFilesTotal = 0;
            this.__loaded = 0;

            cfg = this.config;

            /**
             * UI 상태변경 이벤트 처리자
             * UI의 상태변경 : open, close, upload 등의 변경사항이 발생되면 onStateChanged 함수를 후출하여 이벤트를 처리
             */
            let onStateChanged = function (that) {

                let state = {
                    "open": function () {

                    },
                    "close": function () {

                    },
                    "upload": function () {

                    }
                };

                if (cfg.onStateChanged) {
                    cfg.onStateChanged.call(that, that);
                }
                else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }

                that = null;
                return true;
            };

            let onSelectFile = function (_evt) {
                let files;

                if (!ax5.info.supportFileApi) {
                    // file API 지원 안되는 브라우저.
                }
                else if ('dataTransfer' in _evt) {
                    files = _evt.dataTransfer.files;
                }
                else if ('target' in _evt) {
                    files = _evt.target.files;
                }
                else if (_evt) {
                    files = _evt;
                }

                if (!files) return false;

                /// selectedFiles에 현재 파일 정보 담아두기
                if (length in files) {
                    this.selectedFiles = U.toArray(files);
                } else {
                    this.selectedFiles = [files];
                }

                if (cfg.progressBox) {
                    openProgressBox();
                }
                if (!cfg.manualUpload) {
                    this.send();
                }
            };

            let bindEvent = function () {
                this.$fileSelector
                    .off("click.ax5uploader")
                    .on("click.ax5uploader", (function () {
                        this.$inputFile.trigger("click");
                    }).bind(this));

                this.$inputFile
                    .off("change.ax5uploader")
                    .on("change.ax5uploader", (function (_evt) {
                        onSelectFile.call(this, _evt);
                    }).bind(this));

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

            let alignLayout = function () {
                // 상황이 좋지 않은경우 (만약 버튼 클릭으로 input file click이 되지 않는 다면 z-index값을 높여서 버튼위를 덮는다.)
                /*
                 var box = this.$fileSelector.position();
                 box.width = this.$fileSelector.outerWidth();
                 box.height = this.$fileSelector.outerHeight();
                 this.$inputFile.css(box);
                 */
            };

            let alignProgressBox = function (append) {
                let _alignProgressBox = function () {
                    let $window = jQuery(window), $body = jQuery(document.body);
                    let pos = {}, positionMargin = 6,
                        dim = {}, pickerDim = {},
                        pickerDirection;

                    // cfg.viewport.selector

                    pos = (this.$progressBox.parent().get(0) == this.$target.get(0)) ? this.$fileSelector.position() : this.$fileSelector.offset();
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
                        this.$progressBox
                            .addClass("direction-" + pickerDirection);
                    }

                    let positionCSS = (function () {
                        let css = {left: 0, top: 0};
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
                    })();

                    (function () {
                        if (pickerDirection == "top" || pickerDirection == "bottom") {
                            if (positionCSS.left < 0) {
                                positionCSS.left = positionMargin;
                                this.$progressBoxArrow.css({left: (pos.left + dim.width / 2) - positionCSS.left});
                            } else if (positionCSS.left + pickerDim.width > pickerDim.winWidth) {
                                positionCSS.left = pickerDim.winWidth - pickerDim.width - positionMargin;
                                this.$progressBoxArrow.css({left: (pos.left + dim.width / 2) - positionCSS.left});
                            }
                        }
                    }).call(this);

                    this.$progressBox
                        .css(positionCSS);
                };

                this.$progressBox.css({top: -999});
                if (append) {
                    // progressBox를 append 할 타겟 엘리먼트 펀단 후 결정.
                    (function () {
                        if (cfg.viewport) {
                            return jQuery(cfg.viewport.selector);
                        } else {
                            return this.$target;
                        }
                    }).call(this).append(this.$progressBox);

                    // progressBox 버튼에 이벤트 연결.
                    this.$progressBox
                        .off("click.ax5uploader")
                        .on("click.ax5uploader", "button", (function (_evt) {
                            let act = _evt.target.getAttribute("data-pregressbox-btn");
                            let processor = {
                                "upload": function () {
                                    this.send();
                                },
                                "abort": function () {
                                    this.abort();
                                }
                            };
                            if (processor[act]) processor[act].call(this);
                        }).bind(this));
                }

                setTimeout((function () {
                    _alignProgressBox.call(this);
                }).bind(this));
            };

            let openProgressBox = (function () {
                this.$progressBox.removeClass("destroy");
                this.$progressUpload.removeAttr("disabled");
                this.$progressAbort.removeAttr("disabled");

                // apend & align progress box
                alignProgressBox.call(this, "append");

                // state change
                onStateChanged.call(this, {
                    self: this,
                    state: "open"
                });
            }).bind(this);

            let closeProgressBox = (function () {
                this.$progressBox.addClass("destroy");
                setTimeout((function () {
                    this.$progressBox
                        .remove();
                }).bind(this), cfg.animateTime);
            }).bind(this);

            let startUpload = (function () {

                let processor = {
                    "html5": function () {

                        let uploadFile = this.selectedFiles.shift();
                        if (!uploadFile) {
                            // 업로드 종료
                            uploadComplete();
                            return this;
                        }

                        let formData = new FormData();
                        //서버로 전송해야 할 추가 파라미터 정보 설정

                        this.$target.find("input").each(function () {
                            formData.append(this.name, this.value);
                        });
                        // 파일 아이템 추가
                        formData.append(cfg.form.fileName, uploadFile);

                        this.xhr = new XMLHttpRequest();
                        this.xhr.open("post", cfg.form.action, true);

                        this.xhr.onload = function (e) {
                            let res = e.target.response;
                            try {
                                if (typeof res == "string") res = U.parseJson(res);
                            } catch (e) {
                                return false;
                            }
                            if (cfg.debug) console.log(res);

                            if (res.error) {
                                if (cfg.debug) console.log(res.error);
                                return false;
                            }

                            uploaded(res);
                            self.send();
                        };

                        this.xhr.upload.onprogress = function (e) {
                            // console.log(e.loaded, e.total);
                            updateProgressBar(e);
                            if (U.isFunction(cfg.onprogress)) {
                                cfg.onprogress.call({
                                    loaded: e.loaded,
                                    total: e.total
                                }, e);
                            }
                        };
                        this.xhr.send(formData);  // multipart/form-data

                    },
                    "form": function () {
                        // 폼과 iframe을 만들어 페이지 아래에 삽입 후 업로드
                        // iframe 생성
                        let iframe = $('<iframe src="javascript:false;" name="" style="display:none;"></iframe>');
                        // form 생성.

                        $(document.body).append(iframe);
                    }
                };

                if (this.__uploading === false) {
                    // 전체 파일 사이즈 구하기
                    let filesTotal = 0;
                    this.selectedFiles.forEach(function (n) {
                        filesTotal += n.size;
                    });
                    this.selectedFilesTotal = filesTotal;
                    this.__loaded = 0;


                    this.__uploading = true; // 업로드 시작 상태 처리
                    this.$progressUpload.attr("disabled", "disabled");
                    this.$progressAbort.removeAttr("disabled");
                }

                processor[ax5.info.supportFileApi ? "html5" : "form"].call(this);

            }).bind(this);

            let updateProgressBar = (function (e) {
                this.__loaded += e.loaded;
                this.$progressBar.css({width: U.number(this.__loaded / this.selectedFilesTotal * 100, {round: 2}) + '%'});
                if (e.lengthComputable) {
                    if (e.loaded >= e.total) {

                    }
                }
            }).bind(this);

            let uploaded = (function (res) {
                if (cfg.debug) console.log(res);
                this.uploadedFiles.push(res);
                if (U.isFunction(cfg.onuploaded)) {
                    cfg.onuploaded.call({
                        self: this
                    }, res);
                }
            }).bind(this);

            let uploadComplete = (function () {
                this.__uploading = false; // 업로드 완료 상태처리
                this.$progressUpload.removeAttr("disabled");
                this.$progressAbort.attr("disabled", "disabled");

                if (cfg.progressBox) {
                    closeProgressBox();
                }
                if (U.isFunction(cfg.onuploadComplete)) {
                    cfg.onuploadComplete.call({
                        self: this
                    });
                }
                // update uploadedFiles display
            }).bind(this);

            let cancelUpload = (function () {

                let processor = {
                    "html5": function () {
                        if (this.xhr) {
                            this.xhr.abort();
                        }
                    },
                    "form": function () {

                    }
                };

                this.__uploading = false; // 업로드 완료 상태처리
                this.$progressUpload.removeAttr("disabled");
                this.$progressAbort.attr("disabled", "disabled");

                processor[ax5.info.supportFileApi ? "html5" : "form"].call(this);

                if (cfg.progressBox) {
                    closeProgressBox();
                }

                this.$inputFile.get(0).value = "";
                console.log("cancelUpload");
                // update uploadedFiles display
            }).bind(this);


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

                // btns 확인
                cfg.btns = jQuery.extend({}, this.defaultBtns, cfg.btns);

                this.$progressBox = jQuery(UPLOADER.tmpl.get.call(this, "progressBox", {
                    instanceId: this.instanceId,
                    btns: cfg.btns
                }));
                this.$progressBar = this.$progressBox.find('[role="progressbar"]');
                this.$progressBoxArrow = this.$progressBox.find(".ax-progressbox-arrow");
                this.$progressUpload = this.$progressBox.find('[data-pregressbox-btn="upload"]');
                this.$progressAbort = this.$progressBox.find('[data-pregressbox-btn="abort"]');

                // 레이아웃 정렬
                alignLayout.call(this);
                // 파일버튼 등에 이벤트 연결.
                bindEvent.call(this);

            };

            /**
             * @method ax5uploader.send
             *
             */
            this.send = (function () {

                return function () {
                    // 업로드 시작
                    startUpload();
                }
            })();

            this.abort = (function () {

                return function () {
                    cancelUpload();
                };
            })();

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

    UPLOADER = ax5.ui.uploader;
})();


// todo :
// html5용 업로드 - 구현완료
// abort, 여러개의 파일이 올라가는 중간에 abort 하면 업로드된 파일은 두고. 안올라간 파일만 중지 -- ok
// uploaded files display, needs columnKeys
// delete file
// set uploded files