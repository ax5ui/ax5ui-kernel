/*
 * Copyright (c) 2017. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

(function () {


    const UI = ax5.ui;
    const U = ax5.util;

    let DOCKER;

    UI.addClass({
            className: "docker"
        }, (function () {

            /**
             * @class ax5docker
             * @classdesc
             * @author tom@axisj.com
             * @example
             * ```
             * var ax5docker = new ax5.ui.ax5docker();
             * ```
             */
            return function () {

                let self = this,
                    cfg;

                this.instanceId = ax5.getGuid();

                /**
                 * @member {Object} ax5docker.config
                 */
                this.config = {
                    theme: 'default',
                    animateTime: 250,
                    columnKeys: {},
                    control: {},
                    icons: {
                        close: 'X',
                        more: '...'
                    },
                    labelDirection: 'top',
                    disableClosePanel: false,
                    disableDragPanel: false,
                    resizeDebounceTime: 100,
                    panelDebounceTime: 300,
                };

                /**
                 * @member {Object} ax5docker.xvar
                 */
                this.xvar = {};
                /**
                 * @member {Object} ax5docker.menu
                 */
                this.menu = null;

                this.onResize = null;

                // 패널 정보
                /**
                 * @member {Array} ax5docker.panels
                 */
                this.panels = [];
                /**
                 * @member {Number} ax5docker.panelId
                 */
                this.panelId = 0;

                // 패널의 컨텐츠 모듈
                /**
                 * @member {Object} ax5docker.modules
                 */
                this.modules = {};

                cfg = this.config;

                /**
                 * @private {Object} ax5docker.debouncer
                 */
                const debouncer = {
                    resizeDebounceFn: ax5.util.debounce(function (fn) {
                        fn();
                    }, cfg.resizeDebounceTime),
                    panelDebounceFn: ax5.util.debounce(function (fn) {
                        fn();
                    }, cfg.panelDebounceTime)
                };

                /**
                 * @private {Function} fireEvent
                 * @param event
                 * @returns {ax5docker}
                 */
                const fireEvent = (event) => {
                    const eventProcessor = {
                        "resize"(e){
                            if (this.onResize) {


                                debouncer.resizeDebounceFn((function () {
                                    let that = {
                                        self: this,
                                        resizer: e.target,
                                        resizedDom: [e.target.prev(), e.target.next()]
                                    };
                                    this.onResize.call(that, that);
                                }).bind(this));
                            }
                        }
                    };

                    if (event.eventName in eventProcessor) {
                        eventProcessor[event.eventName].call(this, event);
                    }

                    return this;
                };

                const getPanelId = () => {
                    return this.panelId++;
                };

                /**
                 * defaultModule은 패널의 모듈이 정의되지 않은 경우를 위해 준비된 오브젝트
                 */
                const defaultModule = {
                    init(container, state){
                        container["$element"].html(state.name);
                    },
                    active(container, state){

                    },
                    deactive(container, state){

                    },
                    destroy(container, state){

                    }
                };

                /**
                 * 부모패널과 패널인덱스 값으로 패널 패스를 구합니다.
                 * @param parent
                 * @param pIndex
                 * @returns {string}
                 */
                const getPanelPath = (parent, pIndex) => {
                    let paths = [];
                    if (parent && typeof parent.panelPath !== "undefined") {
                        paths.push(parent.panelPath);
                    }

                    paths.push('panels[' + (pIndex || 0) + ']');
                    return paths.join(".");
                };

                /**
                 * 패널패스를 이용하여 패널을 가져옵니다
                 * @param _panelPath
                 * @returns {*}
                 */
                const getPanel = (_panelPath) => {
                    let path = [],
                        _path = (U.isArray(_panelPath)) ? [].concat(_panelPath) : [].concat(_panelPath.split(/[\.\[\]]/g));

                    _path.forEach(function (n) {
                        if (n !== "") path.push("[\"" + n.replace(/['\"]/g, "") + "\"]");
                    });

                    try {
                        return (Function("", "return this" + path.join('') + ";")).call(this);
                    } catch (e) {
                        return;
                    }
                };

                /**
                 * 패널을 이용하여 패널의 부모 패널을 가져옵니다
                 * @param _panel
                 */
                const getPanelParent = (_panel) => {
                    try {
                        let _path = _panel.panelPath.substr(0, _panel.panelPath.lastIndexOf("."));
                        return (Function("", "return this." + _path + ";")).call(this);
                    } catch (e) {
                        return;
                    }
                };

                /**
                 * 패널패스를 이용하여 패널오브젝트에 값을 부여합니다.
                 * @param _panelPath
                 * @param _value
                 * @returns {*}
                 */
                const setPanel = (_panelPath, _value) => {
                    let path = [],
                        _path = (U.isArray(_panelPath)) ? [].concat(_panelPath) : [].concat(_panelPath.split(/[\.\[\]]/g));

                    _path.forEach(function (n) {
                        if (n !== "") path.push("[\"" + n.replace(/['\"]/g, "") + "\"]");
                    });

                    return (Function("val", "return this" + path.join('') + " = val;")).call(this, _value);
                };

                /**
                 * get mouse position
                 * @param e
                 * @returns {{clientX, clientY}}
                 */
                const getMousePosition = (e) => {
                    let mouseObj, originalEvent = (e.originalEvent) ? e.originalEvent : e;
                    mouseObj = ('changedTouches' in originalEvent && originalEvent.changedTouches) ? originalEvent.changedTouches[0] : originalEvent;
                    // clientX, Y 쓰면 스크롤에서 문제 발생
                    return {
                        clientX: mouseObj.pageX,
                        clientY: mouseObj.pageY
                    }
                };

                /**
                 * 패널의 모듈이 초기화, 활성화, 비활성, 제거 되는 일들을 제어하는 함수.
                 * 모든 컨트롤은 실행되기전에 사용자가 정의한 control.before 함수의 결과에 따라 실행 여부를 결정합니다. 사용자가 control.before를 정의하지 않으면 무조건 실행합니다.
                 * @param {Object} _panel
                 * @param {String} _control - "init","active","deactive","destroy"
                 */
                const controlPanel = (_panel, _control, _callback) => {
                    let moduleState = jQuery.extend(_panel.moduleState, {
                            name: _panel.name
                        }),
                        moduleContainer = {
                            '$element': _panel.$item
                        },
                        module;

                    let processor = {
                        init: () => {
                            _panel.builded = true;
                            module = (_panel.moduleName in this.modules && 'init' in this.modules[_panel.moduleName]) ? this.modules[_panel.moduleName] : defaultModule;
                            module.init(moduleContainer, moduleState);
                        },
                        active: () => {
                            _panel.active = true;
                            _panel.$label.addClass("active");
                            _panel.$item.addClass("active");

                            let $pane = _panel.$label.parent();
                            if ($pane.get(0) && $pane.get(0).clientWidth !== $pane.get(0).scrollWidth) {
                                $pane.animate({scrollLeft: _panel.$label.position().left}, 300);
                            }

                            module = (_panel.moduleName in this.modules && 'active' in this.modules[_panel.moduleName]) ? this.modules[_panel.moduleName] : defaultModule;
                            module.active(moduleContainer, moduleState);
                            $pane = null;
                        },
                        deactive: () => {
                            _panel.active = false;
                            _panel.$label.removeClass("active");
                            _panel.$item.removeClass("active");
                            module = (_panel.moduleName in this.modules && 'deactive' in this.modules[_panel.moduleName]) ? this.modules[_panel.moduleName] : defaultModule;
                            module.deactive(moduleContainer, moduleState);
                        },
                        destroy: () => {
                            module = (_panel.moduleName in this.modules && 'destroy' in this.modules[_panel.moduleName]) ? this.modules[_panel.moduleName] : defaultModule;
                            module.destroy(moduleContainer, moduleState);

                            // 패널 데이터 제거.
                            setPanel(_panel.panelPath, null);
                            // 현재 패널 정보를 검사하여 패널 정보를 재 구성합니다.
                            arrangePanel();
                        },
                        remove: () => {
                            module = (_panel.moduleName in this.modules && 'destroy' in this.modules[_panel.moduleName]) ? this.modules[_panel.moduleName] : defaultModule;
                            module.destroy(moduleContainer, moduleState);

                            // 패널 데이터 제거.
                            setPanel(_panel.panelPath, null);
                            // 현재 패널 정보를 검사하여 패널 정보를 재 구성합니다.
                            arrangePanel();
                        },
                    };

                    // 사용자정의 함수 control.before, control.after에 전달할 인자 = that
                    let that = {
                        panel: _panel,
                        controlType: _control
                    };

                    // 비동기 처리 상황에 대응하기 위해 runProcessor를 별도 처리
                    let runProcessor = () => {
                        processor[_control]();
                        module = null;

                        if (U.isFunction(cfg.control.after)) {
                            cfg.control.after.call(that, that);
                        }
                    };

                    if (processor[_control]) {
                        if (U.isFunction(cfg.control.before)) {
                            cfg.control.before.call(that, that, function (result) {
                                if (typeof result === "undefined") result = true;
                                if (result) runProcessor();

                                if (U.isFunction(_callback)) {
                                    _callback(result);
                                }

                            });
                        }
                        else {
                            runProcessor();
                        }
                    }
                };

                /**
                 * 패널들의 패널 데이터 구조에 맞게 다시 그리기
                 */
                const repaintPanels = () => {
                    const appendProcessor = {
                        stack($parent, parent, myself, pIndex){

                            let $dom, activeIndex = -1;
                            myself.panelPath = getPanelPath(parent, pIndex);

                            $dom = jQuery(DOCKER.tmpl.get.call(this, "stack-panel", {
                                id: self.instanceId,
                                name: myself.name,
                                hasLabelColor: !U.isNothing(myself.color),
                                color: myself.color,
                                borderColor: myself.borderColor,
                                panelPath: myself.panelPath,
                                icons: cfg.icons,
                                labelDirection: myself.labelDirection || cfg.labelDirection,
                                disableClosePanel: cfg.disableClosePanel,
                                disableDragPanel: cfg.disableDragPanel,
                            }, {}));
                            $parent.append($dom);

                            if (U.isArray(myself.panels)) {
                                myself.panels.forEach(function (P, pIndex) {
                                    if (P.active) activeIndex = pIndex;
                                });
                                if (activeIndex === -1) activeIndex = 0;
                                myself.panels[activeIndex].active = true;

                                myself.panels.forEach(function (P, _pIndex) {
                                    P.panelIndex = _pIndex;
                                    appendProcessor[P.type]($dom, myself, P, _pIndex);
                                });
                            }

                            $dom = null;
                            activeIndex = null;
                        },
                        panel($parent, parent, myself, pIndex){
                            let $dom;
                            myself.panelPath = getPanelPath(parent, pIndex);
                            myself.$label = jQuery(DOCKER.tmpl.get.call(this, "panel-label", {
                                id: self.instanceId,
                                pIndex: pIndex,
                                name: myself.name,
                                hasLabelColor: !U.isNothing(myself.color),
                                color: myself.color,
                                borderColor: myself.borderColor,
                                panelPath: myself.panelPath,
                                icons: cfg.icons,
                                disableClosePanel: cfg.disableClosePanel,
                                disableDragPanel: cfg.disableDragPanel,
                            }, {}));

                            if (!myself.$item) {
                                myself.$item = jQuery('<div data-ax5docker-pane-item="' + pIndex + '" data-ax5docker-id="' + self.instanceId + '" data-ax5docker-pane-id="' + getPanelId() + '" data-ax5docker-path="' + myself.panelPath + '"></div>');
                            } else {
                                myself.$item.attr("data-ax5docker-path", myself.panelPath);
                                myself.$item.attr("data-ax5docker-pane-item", pIndex);
                            }

                            if (parent && parent.type == "stack") {
                                if (myself.active) {
                                    if (!myself.builded) controlPanel(myself, "init");
                                    controlPanel(myself, "active");
                                }
                                $parent.find('[data-ax5docker-pane-tabs="' + self.instanceId + '"]').append(myself.$label);
                                $parent.find('[data-ax5docker-pane-item-views="' + self.instanceId + '"]').append(myself.$item);
                            } else {
                                $dom = jQuery(DOCKER.tmpl.get.call(this, "stack-panel", {
                                    id: self.instanceId,
                                    name: myself.name,
                                    hasLabelColor: !U.isNothing(myself.color),
                                    color: myself.color,
                                    borderColor: myself.borderColor,
                                    panelPath: myself.panelPath,
                                    flexGrow: myself.flexGrow,
                                    icons: cfg.icons,
                                    labelDirection: myself.labelDirection || cfg.labelDirection,
                                    disableClosePanel: cfg.disableClosePanel,
                                    disableDragPanel: cfg.disableDragPanel,
                                }, {}));

                                if (!myself.builded) controlPanel(myself, "init");
                                controlPanel(myself, "active");

                                $dom.find('[data-ax5docker-pane-tabs="' + self.instanceId + '"]').append(myself.$label);
                                $dom.find('[data-ax5docker-pane-item-views="' + self.instanceId + '"]').append(myself.$item);

                                $parent.append($dom);
                            }

                            $dom = null;
                        },
                        resizeHandle($parent, parent, myself, pIndex){
                            let $dom = jQuery('<div data-ax5docker-id="' + self.instanceId + '" data-ax5docker-resize-handle="' + parent.type + "/" + parent.panelPath + "/" + pIndex + '"></div>');
                            $parent.append($dom);
                            $dom = null;
                        },
                        row($parent, parent, myself, pIndex){
                            let $dom;
                            myself.panelPath = getPanelPath(parent, pIndex);
                            if (parent && parent.type == "stack") {
                                throw "The 'stack' type child nodes are allowed only for the 'panel' type.";
                            }
                            $dom = jQuery('<div data-ax5docker-pane-axis="row" data-ax5docker-id="' + self.instanceId + '" data-ax5docker-path="' + myself.panelPath + '" style="flex-grow: ' + (myself.flexGrow || 1) + ';"></div>');
                            $parent.append($dom);

                            if (U.isArray(myself.panels)) {
                                myself.panels.forEach(function (P, _pIndex) {
                                    if (_pIndex > 0) appendProcessor["resizeHandle"]($dom, myself, P, _pIndex);
                                    P.panelIndex = _pIndex;
                                    appendProcessor[P.type]($dom, myself, P, _pIndex);
                                });
                            }

                            $dom = null;
                        },
                        column($parent, parent, myself, pIndex){
                            let $dom;
                            myself.panelPath = getPanelPath(parent, pIndex);
                            if (parent && parent.type == "stack") {
                                throw "The 'stack' type child nodes are allowed only for the 'panel' type.";
                            }
                            $dom = jQuery('<div data-ax5docker-pane-axis="column" data-ax5docker-id="' + self.instanceId + '" data-ax5docker-path="' + myself.panelPath + '" style="flex-grow: ' + (myself.flexGrow || 1) + ';"></div>');
                            $parent.append($dom);

                            if (U.isArray(myself.panels)) {
                                myself.panels.forEach(function (P, _pIndex) {
                                    if (_pIndex > 0) appendProcessor["resizeHandle"]($dom, myself, P, _pIndex);
                                    P.panelIndex = _pIndex;
                                    appendProcessor[P.type]($dom, myself, P, _pIndex);
                                });
                            }

                            $dom = null;
                        }
                    };

                    let $root = jQuery('<div data-ax5docker-panes="' + this.instanceId + '"></div>');
                    if (this.panels[0]) appendProcessor[this.panels[0].type]($root, null, this.panels[0], 0);
                    this.$target.html($root);

                    this.$target
                        .off("click.ax5docker-pane")
                        .on("click.ax5docker-pane", '[data-ax5docker-id="' + self.instanceId + '"][data-ax5docker-pane-tab] .close-icon', function (e) {
                            self.removePanel($(this).parents('[data-ax5docker-pane-tab]').attr("data-ax5docker-path"));
                            U.stopEvent(e);
                        })
                        .on("click.ax5docker-pane", '[data-ax5docker-id="' + self.instanceId + '"][data-ax5docker-pane-tab]', function (e) {
                            // pane, panelIndex 인자 변경.
                            let $clickedLabel = jQuery(this);
                            let pane = getPanel($clickedLabel.parents('[data-ax5docker-pane]').attr("data-ax5docker-path"));
                            let panelIndex = $clickedLabel.attr("data-ax5docker-pane-tab");

                            if (!$clickedLabel.hasClass("active")) {
                                changeActiveStackPanel(pane, panelIndex);
                            }

                            $clickedLabel = null;
                            pane = null;
                            panelIndex = null;
                            U.stopEvent(e);
                        })
                        .on("click.ax5docker-pane", '[data-ax5docker-pane-tabs-more="' + this.instanceId + '"]', function (e) {
                            openStackPanelMore($(this).parents('[data-ax5docker-pane]'), e);
                            U.stopEvent(e);
                        });

                    this.$target
                        .off("mousedown.ax5docker-pane-resize")
                        .off("dragstart.ax5docker-pane-resize")
                        .on("dragstart.ax5docker-pane-resize", '[data-ax5docker-id="' + self.instanceId + '"][data-ax5docker-pane-tab]', function (e) {
                            if (!cfg.disableDragPanel) {
                                panelTabDragEvent.on(this);
                            }
                        })
                        .on("mousedown.ax5docker-pane-resize", '[data-ax5docker-id="' + self.instanceId + '"][data-ax5docker-resize-handle]', function (e) {
                            let datas = this.getAttribute("data-ax5docker-resize-handle").split(/\//g);

                            // panelResizerEvent.init
                            self.xvar.mousePosition = getMousePosition(e);
                            self.xvar.resizerType = datas[0];
                            self.xvar.resizerPath = datas[1];
                            self.xvar.resizerIndex = datas[2];
                            // 주변 패널들
                            self.xvar.resizer$dom = $(this);
                            self.xvar.resizerParent$dom = self.xvar.resizer$dom.parent();
                            self.xvar.resizerPrevGrow = U.number(self.xvar.resizer$dom.prev().css("flex-grow"));
                            self.xvar.resizerNextGrow = U.number(self.xvar.resizer$dom.next().css("flex-grow"));

                            if (self.xvar.resizerType == "row") {
                                //self.xvar.resizerCanvasWidth = self.xvar.resizerParent$dom.innerWidth();
                                self.xvar.resizerCanvasWidth = self.xvar.resizer$dom.prev().innerWidth() + self.xvar.resizer$dom.next().innerWidth() + self.xvar.resizer$dom.width();
                            } else {
                                //self.xvar.resizerCanvasHeight = self.xvar.resizerParent$dom.innerHeight();
                                self.xvar.resizerCanvasHeight = self.xvar.resizer$dom.prev().innerHeight() + self.xvar.resizer$dom.next().innerHeight() + self.xvar.resizer$dom.height();
                            }

                            panelResizerEvent.on(this);
                            U.stopEvent(e);
                        })
                        .on("dragstart.ax5docker-pane-resize", '[data-ax5docker-id="' + self.instanceId + '"][data-ax5docker-resize-handle]', function (e) {
                            U.stopEvent(e);
                            return false;
                        });

                    // stackPane tabs 스크롤처리
                    alignStackPane();
                    $root = null;
                };

                /**
                 * repaintPanels이 작동할 때. 패널탭에 dragStart 이벤트를 연결합니다.
                 * 발생된 이벤트가 panelTabDragEvent.on를 작동.
                 */
                const panelTabDragEvent = {
                    "on": (dragPanel) => {
                        if (this.panels[0] && this.panels[0].panels && this.panels[0].panels.length) {

                            this.xvar.dragger = {
                                dragPanel: dragPanel,
                                target: null,
                                dragOverVertical: null,
                                dragOverHorizontal: null,
                            };

                            this.$target
                                .on("dragover.ax5docker-" + this.instanceId, '[data-ax5docker-id="' + this.instanceId + '"][data-ax5docker-path]', function (e) {
                                    // todo : dragover 구현
                                    // console.log("dargover", getMousePosition(e));
                                    // console.log(e.target);
                                    panelTabDragEvent.dragover(this, e);
                                    U.stopEvent(e);
                                })
                                .on("drop.ax5docker-" + this.instanceId, function (e) {
                                    panelTabDragEvent.off("drop");
                                    U.stopEvent(e);
                                })
                                .on("dragend.ax5docker-" + this.instanceId, function (e) {
                                    panelTabDragEvent.off();
                                    U.stopEvent(e);
                                });
                        }
                    },
                    "dragover": (dragoverDom, e) => {

                        let $dragoverDom = jQuery(dragoverDom),
                            box = {},
                            mouse = getMousePosition(e),
                            dragOverVertical,
                            dragOverHorizontal;

                        if (this.xvar.dragger.target == null || this.xvar.dragger.target.get(0) != $dragoverDom.get(0)) {
                            if (this.xvar.dragger.target) this.xvar.dragger.target.removeAttr("data-dropper");

                            this.xvar.dragger.target = $dragoverDom;
                            this.xvar.dragger.dragOverVertical = null;
                            this.xvar.dragger.dragOverHorizontal = null;
                        }

                        box = $dragoverDom.offset();
                        box.width = $dragoverDom.width();
                        box.height = $dragoverDom.height();

                        if ($dragoverDom.attr("data-ax5docker-pane-tab")) {
                            let halfWidth = box.width / 2;
                            if (box.left <= mouse.clientX && (box.left + halfWidth) >= mouse.clientX) {
                                dragOverHorizontal = "left";
                            }
                            else if ((box.left + halfWidth) <= mouse.clientX && (box.left + halfWidth * 2) >= mouse.clientX) {
                                dragOverHorizontal = "right";
                            }
                            if (this.xvar.dragger.dragOverHorizontal != dragOverHorizontal && typeof dragOverHorizontal != "undefined") {
                                this.xvar.dragger.dragOverHorizontal = dragOverHorizontal;
                                const draggerProcessor = {
                                    "left"($target){
                                        $target.attr("data-dropper", "left");
                                    },
                                    "right"($target){
                                        $target.attr("data-dropper", "right");
                                    },
                                };
                                if (this.xvar.dragger.dragOverHorizontal in draggerProcessor) {
                                    draggerProcessor[this.xvar.dragger.dragOverHorizontal](this.xvar.dragger.target);
                                }
                            }
                            halfWidth = null;
                        }
                        else if ($dragoverDom.attr("data-ax5docker-pane-tabs")) {
                            //this.xvar.dragger.dragOverVertical = "center";
                            this.xvar.dragger.dragOverHorizontal = "last-child";
                            this.xvar.dragger.target.attr("data-dropper", "true");
                        }
                        else if ($dragoverDom.attr("data-ax5docker-pane-item")) {
                            // panel dragover 포지션 구하기
                            let threeQuarterHeight = box.height / 3;
                            let threeQuarterWidth = box.width / 3;

                            if (box.top <= mouse.clientY && (box.top + threeQuarterHeight) >= mouse.clientY) {
                                dragOverVertical = "top";
                            }
                            else if ((box.top + threeQuarterHeight) <= mouse.clientY && (box.top + threeQuarterHeight * 2) >= mouse.clientY) {
                                dragOverVertical = "middle";
                            }
                            else if ((box.top + threeQuarterHeight * 2) <= mouse.clientY && (box.top + threeQuarterHeight * 3) >= mouse.clientY) {
                                dragOverVertical = "bottom";
                            }

                            if (box.left <= mouse.clientX && (box.left + threeQuarterWidth) >= mouse.clientX) {
                                dragOverHorizontal = "left";
                            }
                            else if ((box.left + threeQuarterWidth) <= mouse.clientX && (box.left + threeQuarterWidth * 2) >= mouse.clientX) {
                                dragOverHorizontal = "center";
                            }
                            else if ((box.left + threeQuarterWidth * 2) <= mouse.clientX && (box.left + threeQuarterWidth * 3) >= mouse.clientX) {
                                dragOverHorizontal = "right";
                            }

                            if (this.xvar.dragger.dragOverVertical != dragOverVertical || this.xvar.dragger.dragOverHorizontal != dragOverHorizontal) {
                                this.xvar.dragger.dragOverVertical = dragOverVertical;
                                this.xvar.dragger.dragOverHorizontal = dragOverHorizontal;

                                var draggerProcessor = {
                                    "left-top"($target){
                                        $target.attr("data-dropper", "left");
                                    },
                                    "right-top"($target){
                                        $target.attr("data-dropper", "right");
                                    },
                                    "center-top"($target){
                                        $target.attr("data-dropper", "top");
                                    },
                                    "left-middle"($target){
                                        $target.attr("data-dropper", "left");
                                    },
                                    "right-middle"($target){
                                        $target.attr("data-dropper", "right");
                                    },
                                    "center-middle"($target){
                                        $target.attr("data-dropper", "center");
                                    },
                                    "left-bottom"($target){
                                        $target.attr("data-dropper", "left");
                                    },
                                    "right-bottom"($target){
                                        $target.attr("data-dropper", "right");
                                    },
                                    "center-bottom"($target){
                                        $target.attr("data-dropper", "bottom");
                                    },
                                };
                                if (this.xvar.dragger.dragOverHorizontal + "-" + this.xvar.dragger.dragOverVertical in draggerProcessor) {
                                    draggerProcessor[this.xvar.dragger.dragOverHorizontal + "-" + this.xvar.dragger.dragOverVertical](this.xvar.dragger.target);
                                }
                            }

                            threeQuarterHeight = null;
                            threeQuarterWidth = null;
                        }


                    },
                    "off": (isDrop) => {
                        if (isDrop) {
                            let dragPanel = getPanel(this.xvar.dragger.dragPanel.getAttribute("data-ax5docker-path")),
                                appendType = [];

                            if (this.xvar.dragger.dragOverHorizontal) appendType.push(this.xvar.dragger.dragOverHorizontal);
                            if (this.xvar.dragger.dragOverVertical) appendType.push(this.xvar.dragger.dragOverVertical);

                            this.appendPanel(dragPanel, this.xvar.dragger.target.attr("data-ax5docker-path"), appendType);

                            dragPanel = null;
                            appendType = null;
                        }

                        alignStackPane();

                        this.$target
                            .off("dragover.ax5docker-" + this.instanceId)
                            .off("drop.ax5docker-" + this.instanceId)
                            .off("dragend.ax5docker-" + this.instanceId);

                        this.xvar.dragger.target.removeAttr("data-dropper");
                    }
                };

                /**
                 * repaintPanels이 작동할 때. 리사이저에 mousedown 이벤트를 연결합니다.
                 * 발생된 이벤트가 panelResizerEvent.on 을 작동시켜 리사이저를 움직이게 합니다
                 */
                const panelResizerEvent = {
                    "on": (_resizer) => {

                        jQuery(document.body)
                            .on("mousemove.ax5docker-" + this.instanceId, function (e) {
                                let mouseObj = getMousePosition(e),
                                    da_grow;

                                if (self.xvar.resizerLived) {
                                    if (self.xvar.resizerType == "row") {
                                        self.xvar.__da = mouseObj.clientX - self.xvar.mousePosition.clientX;
                                        da_grow = U.number(self.xvar.__da * 2 / self.xvar.resizerCanvasWidth, {round: 6});

                                        self.xvar.resizer$dom.prev().css({"flex-grow": self.xvar.resizerPrevGrow + da_grow});
                                        self.xvar.resizer$dom.next().css({"flex-grow": self.xvar.resizerNextGrow - da_grow});
                                    } else {
                                        self.xvar.__da = mouseObj.clientY - self.xvar.mousePosition.clientY;
                                        da_grow = U.number(self.xvar.__da * 2 / self.xvar.resizerCanvasHeight, {round: 6});

                                        self.xvar.resizer$dom.prev().css({"flex-grow": self.xvar.resizerPrevGrow + da_grow});
                                        self.xvar.resizer$dom.next().css({"flex-grow": self.xvar.resizerNextGrow - da_grow});
                                    }

                                    fireEvent({
                                        eventName: "resize",
                                        target: self.xvar.resizer$dom
                                    });
                                } else {
                                    self.xvar.resizerLived = true;
                                }

                                mouseObj = null;
                                da_grow = null;
                            })
                            .on("mouseup.ax5docker-" + this.instanceId, function (e) {
                                panelResizerEvent.off();
                                U.stopEvent(e);
                            })
                            .on("mouseleave.ax5docker-" + this.instanceId, function (e) {
                                panelResizerEvent.off();
                                U.stopEvent(e);
                            });

                        jQuery(document.body)
                            .attr('unselectable', 'on')
                            .css('user-select', 'none')
                            .on('selectstart', false);
                    },
                    "off": () => {
                        self.xvar.resizerLived = false;

                        if (typeof this.xvar.__da === "undefined") {

                        }
                        else {
                            let $prevPanel = self.xvar.resizer$dom.prev(),
                                $nextPanel = self.xvar.resizer$dom.next(),
                                prevPane = getPanel($prevPanel.attr("data-ax5docker-path")),
                                nextPane = getPanel($nextPanel.attr("data-ax5docker-path"));

                            prevPane.flexGrow = U.number($prevPanel.css("flex-grow"));
                            nextPane.flexGrow = U.number($nextPanel.css("flex-grow"));

                            $prevPanel = null;
                            $nextPanel = null;
                            prevPane = null;
                            nextPane = null;
                        }

                        alignStackPane();

                        jQuery(document.body)
                            .off("mousemove.ax5docker-" + this.instanceId)
                            .off("mouseup.ax5docker-" + this.instanceId)
                            .off("mouseleave.ax5docker-" + this.instanceId);

                        jQuery(document.body)
                            .removeAttr('unselectable')
                            .css('user-select', 'auto')
                            .off('selectstart');
                    }
                };

                /**
                 * 액티브 패널 변경(stack인 상황에서)
                 * @param pane
                 * @param panelIndex
                 * @returns {boolean}
                 */
                const changeActiveStackPanel = (pane, panelIndex) => {
                    let panel = pane.panels[panelIndex];

                    for (let p = 0, pl = pane.panels.length; p < pl; p++) {
                        if (pane.panels[p].active) {
                            controlPanel(pane.panels[p], "deactive");
                        }
                    }

                    if (!panel.builded) controlPanel(panel, "init");
                    controlPanel(panel, "active");

                    pane = null;
                    panelIndex = null;
                    panel = null;
                    return this;
                };

                /**
                 * stackTab의 더보기 아이콘이 클릭되면~~~
                 * @param stackPane
                 * @param e
                 * @returns {ax5docker}
                 */
                const openStackPanelMore = (stackPane, e) => {
                    let $stackPane = jQuery(stackPane),
                        panePath = $stackPane.attr("data-ax5docker-path"),
                        pane = getPanel(panePath);

                    if (this.menu) {
                        let menuItems = U.map(pane.panels, function (index) {
                            return {
                                label: this.name,
                                index: index,
                                panePath: panePath
                            }
                        });

                        this.menu.setConfig({
                            items: menuItems,
                            onClick: function () {
                                //console.log(pane);
                                changeActiveStackPanel(getPanel(this.panePath), this.index);
                            }
                        });

                        this.menu.popup(e);
                    } else {
                        console.log(pane.panels);
                        throw "'ax5ui-menu' is required to implement the function.";
                    }

                    $stackPane = null;
                    panePath = null;
                    pane = null;
                    return this;
                };

                /**
                 * stackPane이 리사이즈 되면 탭을 스크롤여부를 판단해야 합니다.
                 */
                const alignStackPane = () => {
                    debouncer.panelDebounceFn((function () {
                        this.$target.find('[data-ax5docker-pane-tabs="' + this.instanceId + '"]').each(function () {
                            let $this = jQuery(this).parent();
                            if (this.scrollWidth > this.clientWidth) {
                                $this.addClass("tabs-scrolled");
                            } else {
                                $this.removeClass("tabs-scrolled");
                            }
                            $this = null;
                        });
                    }).bind(this));
                };

                const panelsDeactive = (panels) => {
                    if (U.isArray(panels)) {
                        panels.forEach(function (p) {
                            //p.active = false;
                            //p.$item.removeClass("active");
                            controlPanel(p, "deactive");
                        });
                    } else {
                        //panels.active = false;
                        //panels.$item.removeClass("active");
                        controlPanel(panels, "deactive");
                    }
                };

                /**
                 * 패널중에 null이 된 요소를 찾아 panels를 정리 합니다.
                 * @returns {*}
                 */
                const arrangePanel = () => {
                    const processor = {
                        stack(myself){
                            if (!U.isArray(myself.panels)) return false;

                            let newObj = {
                                type: "stack",
                                panels: []
                            };

                            myself.panels.forEach(function (P, _pIndex) {
                                if (P) {
                                    let _p = processor[P.type](P);
                                    if (_p) newObj.panels.push(_p);
                                    _p = null;
                                }
                            });

                            if (newObj.panels.length == 0) {
                                return null;
                            } else if (newObj.panels.length < 2) {
                                newObj = newObj.panels[0];
                            }

                            return newObj;
                        },
                        panel(myself){
                            //console.log(myself);
                            return myself;
                        },
                        row(myself){

                            if (!U.isArray(myself.panels)) return false;

                            let newObj = {
                                type: "row",
                                panels: []
                            };

                            myself.panels.forEach(function (P, _pIndex) {
                                if (P) {
                                    let _p = processor[P.type](P);
                                    if (_p) newObj.panels.push(_p);
                                    _p = null;
                                }
                            });

                            if (newObj.panels.length == 0) {
                                return null;
                            } else if (newObj.panels.length < 2) {
                                newObj = newObj.panels[0];
                            }

                            return newObj;
                        },
                        column(myself){
                            if (!U.isArray(myself.panels)) return false;

                            let newObj = {
                                type: "column",
                                panels: []
                            };

                            myself.panels.forEach(function (P, _pIndex) {
                                if (P) {
                                    let _p = processor[P.type](P);
                                    if (_p) newObj.panels.push(_p);
                                    _p = null;
                                }
                            });

                            if (newObj.panels.length == 0) {
                                return null;
                            } else if (newObj.panels.length < 2) {
                                newObj = newObj.panels[0];
                            }

                            return newObj;
                        },
                    };

                    if (this.panels[0]) {
                        this.panels[0] = processor[this.panels[0].type](this.panels[0]);
                        if (this.panels[0] && this.panels[0].type === "panel") {
                            this.panels[0] = {
                                type: "stack",
                                panels: [this.panels[0]]
                            };
                        }
                    } else {
                        this.panels = [];
                    }

                    repaintPanels();
                };

                /**
                 * @method ax5docker.setConfig
                 * @param {Object} config
                 * @param {Element} config.target
                 * @param {Object[]} config.panels
                 * @param {String} config.panels[].type - panel, stack, row, column
                 * @param {String} config.panels[].name
                 * @param {String} [config.panels[].color]
                 * @param {String} [config.panels[].borderColor]
                 * @param {String} config.panels[].moduleName
                 * @param {Object} config.panels[].moduleState
                 * @param {Object[]} config.panels[].panels
                 * @param {Object} [config.icons]
                 * @param {String} [config.icons.close]
                 * @param {String} [config.icons.more]
                 * @param {Boolean} [config.disableClosePanel=false]
                 * @param {Boolean} [config.disableDragPanel=false]
                 * @param {Object} [config.control]
                 * @param {Function} [config.control.before]
                 * @param {Function} [config.control.after]
                 * @param {Object} [config.menu]
                 * @param {String} [config.menu.theme="default"]
                 * @param {String} [config.menu.position="absolute"]
                 * @param {Object} [config.menu.icons]
                 * @param {String} [config.menu.icons.arrow]
                 * @param {Number} [config.resizeDebounceTime=100]
                 * @param {Number} [config.panelDebounceTime=300]
                 * @example
                 * ```js
                 * var myDocker = new ax5.ui.docker();
                 * myDocker.setConfig({
                 *      target: $('[data-ax5docker="docker1"]'),
                 *      panels: [
                 *          {
                 *              type: "panel",
                 *              name: "panel name",
                 *              color: "#ff3300",
                 *              borderColor: "#000000",
                 *              moduleName: "content",
                 *              moduleState:{
                 *                  data: "data1"
                 *              }
                 *          }
                 *      ]
                 * });
                 * ```
                 */
                this.init = function (_config) {
                    cfg = jQuery.extend(true, {}, cfg, _config);
                    if (!cfg.target) {
                        console.log(ax5.info.getError("ax5docker", "401", "init"));
                        return this;
                    }

                    // 이벤트 정의 영역
                    this.onResize = cfg.onResize;

                    // memory target
                    this.$target = jQuery(cfg.target);
                    // set panels
                    this.panels = cfg.panels || [];
                    // event Functions
                    this.onStateChanged = cfg.onStateChanged;
                    this.onClick = cfg.onClick;
                    this.onLoad = cfg.onLoad;
                    this.onDataChanged = cfg.onDataChanged;

                    if (ax5.ui.menu) {
                        this.menu = new ax5.ui.menu({
                            theme: 'default',
                            position: "absolute",
                            icons: {
                                'arrow': '▸'
                            }
                        });
                    }

                    jQuery(window).bind("resize.ax5docker-" + this.id, function () {
                        // stackPane tabs 스크롤처리
                        alignStackPane();
                    });
                };

                /**
                 * @method ax5docker.setPanels
                 * @returns {ax5docker}
                 */
                this.setPanels = function (_panels) {
                    // set panels
                    this.panels = _panels || [];

                    // 패널 다시 그리기
                    repaintPanels();
                    return this;
                };

                /**
                 * @method ax5docker.addModule
                 * @param modules
                 * @returns {ax5docker}
                 */
                this.addModule = function (modules) {
                    if (U.isObject(modules)) {
                        jQuery.extend(true, this.modules, modules);
                    }
                    return this;
                };

                /**
                 * repaint panels of docker
                 * @method ax5docker.repaint
                 * @returns {ax5docker}
                 */
                this.repaint = function () {
                    // 패널 다시 그리기
                    repaintPanels();
                    return this;
                };

                /**
                 * @method ax5docker.addPanel
                 * @param {String} _addPath - Position path to add panel
                 * @param _addType
                 * @param _panel
                 * @param _panelIndex
                 * @returns {ax5docker}
                 * @example
                 * ```js
                 * myDocker.addPanel('0.1', 'stack', {type:'panel', name:'addPanel', moduleName: 'content'});
                 *
                 * ```
                 */
                this.addPanel = function (_addPath, _addType, _panel, _panelIndex) {
                    console.log(_addPath, _addType);
                    let addPath = "";
                    let pane;
                    let parent;

                    if (this.panels.length === 0 || !this.panels[0]) {
                        return this.setPanels([{type: "stack", panels: [_panel]}]);
                    } else {
                        if (_addPath == "undefined") {
                            addPath = "0";
                        } else {
                            addPath = _addPath
                                .replace(/[a-zA-Z\[\]]+/g, "")
                                .replace(/(\d+)/g, function (a, b) {
                                    return "panels[" + a + "]";
                                });
                        }
                        pane = getPanel(addPath);
                        parent = getPanelParent(pane);
                    }

                    if (parent && parent.type == "stack") {
                        // 부모패널로 ~
                        //console.log(addPath, _addPath);
                        pane = parent;
                        addPath = pane.panelPath;
                    }


                    console.log(pane);
                    console.log(parent);
                    console.log(addPath);

                    let panelProcessor = {
                        "stack"(_pane, _addType, _panel, _panelIndex){
                            let copyPanel = jQuery.extend({}, _pane),
                                addProcessor = {
                                    "stack"(_pane, _panel){
                                        if (_panel.active) {
                                            panelsDeactive(_pane.panels);
                                        }
                                        _pane.panels.push(_panel);
                                        arrangePanel();
                                    },
                                    "stack-left"(_pane, _panel){
                                        if (_panel.active) {
                                            panelsDeactive(_pane.panels);
                                        }
                                        _pane.panels.splice(_panelIndex, 0, _panel);
                                        arrangePanel();
                                    },
                                    "stack-right"(_pane, _panel){
                                        if (_panel.active) {
                                            panelsDeactive(_pane.panels);
                                        }
                                        _pane.panels.splice(Number(_panelIndex) + 1, 0, _panel);
                                        arrangePanel();
                                    },
                                    "row-left"(_pane, _panel){
                                        let parentPath = addPath.substr(0, addPath.lastIndexOf("."));
                                        let parentPane = getPanel(parentPath);
                                        if (parentPane && parentPane.type == "row") {
                                            this.addPanel(parentPane.panelPath, _addType, _panel, _pane.panelIndex);
                                        } else {
                                            _pane = setPanel(addPath, {
                                                type: "row",
                                                panels: []
                                            });
                                            _pane.panels.push(_panel);
                                            _pane.panels.push(copyPanel);
                                            arrangePanel();
                                        }
                                    },
                                    "row-right"(_pane, _panel){
                                        let parentPath = addPath.substr(0, addPath.lastIndexOf("."));
                                        let parentPane = getPanel(parentPath);
                                        if (parentPane && parentPane.type == "row") {
                                            this.addPanel(parentPane.panelPath, _addType, _panel, _pane.panelIndex);
                                        } else {
                                            _pane = setPanel(addPath, {
                                                type: "row",
                                                panels: []
                                            });
                                            _pane.panels.push(copyPanel);
                                            _pane.panels.push(_panel);
                                            arrangePanel();
                                        }
                                    },
                                    "column-top"(_pane, _panel){
                                        let parentPath = addPath.substr(0, addPath.lastIndexOf("."));
                                        let parentPane = getPanel(parentPath);
                                        if (parentPane && parentPane.type == "column") {
                                            this.addPanel(parentPane.panelPath, _addType, _panel, _pane.panelIndex);
                                        } else {
                                            _pane = setPanel(addPath, {
                                                type: "column",
                                                panels: []
                                            });
                                            _pane.panels.push(_panel);
                                            _pane.panels.push(copyPanel);
                                            arrangePanel();
                                        }
                                    },
                                    "column-bottom"(_pane, _panel){
                                        let parentPath = addPath.substr(0, addPath.lastIndexOf("."));
                                        let parentPane = getPanel(parentPath);
                                        if (parentPane && parentPane.type == "column") {
                                            this.addPanel(parentPane.panelPath, _addType, _panel, _pane.panelIndex);
                                        } else {
                                            _pane = setPanel(addPath, {
                                                type: "column",
                                                panels: []
                                            });
                                            _pane.panels.push(copyPanel);
                                            _pane.panels.push(_panel);
                                            arrangePanel();
                                        }
                                    }
                                };
                            if (_addType in addProcessor) {
                                addProcessor[_addType].call(this, _pane, _panel);
                            }

                            copyPanel = null;
                            addProcessor = null;
                        },
                        "row"(_pane, _addType, _panel, _panelIndex){
                            let copyPanel = jQuery.extend({}, _pane),
                                addProcessor = {
                                    "stack"(_pane, _panel){
                                        // 처리 할 수 없는 상황 첫번째 자식을 찾아 재 요청
                                        if (_pane.panels[0] && _pane.panels[0].panelPath) {
                                            this.addPanel(_pane.panels[0].panelPath, _addType, _panel);
                                        }
                                    },
                                    "row-left"(_pane, _panel, _panelIndex){
                                        _pane.panels.splice(_panelIndex, 0, _panel);
                                        arrangePanel();
                                    },
                                    "row-right"(_pane, _panel, _panelIndex){
                                        _pane.panels.splice(_panelIndex + 1, 0, _panel);
                                        arrangePanel();
                                    },
                                    "column-top"(_pane, _panel, _panelIndex){
                                        let parentPath = addPath.substr(0, addPath.lastIndexOf("."));
                                        let parentPane = getPanel(parentPath);
                                        if (parentPane && parentPane.type == "column") {
                                            this.addPanel(parentPane.panelPath, _addType, _panel, _pane.panelIndex);
                                        } else {
                                            _pane = setPanel(addPath, {
                                                type: "column",
                                                panels: []
                                            });
                                            _pane.panels.push(_panel);
                                            _pane.panels.push(copyPanel);
                                            arrangePanel();
                                        }
                                    },
                                    "column-bottom"(_pane, _panel, _panelIndex){
                                        let parentPath = addPath.substr(0, addPath.lastIndexOf("."));
                                        let parentPane = getPanel(parentPath);
                                        if (parentPane && parentPane.type == "column") {
                                            this.addPanel(parentPane.panelPath, _addType, _panel, _pane.panelIndex);
                                        } else {
                                            _pane = setPanel(addPath, {
                                                type: "column",
                                                panels: []
                                            });
                                            _pane.panels.push(copyPanel);
                                            _pane.panels.push(_panel);
                                            arrangePanel();
                                        }
                                    }
                                };
                            if (_addType in addProcessor) {
                                addProcessor[_addType].call(this, _pane, _panel, _panelIndex);
                            }

                            addProcessor = null;
                            copyPanel = null;
                        },
                        "column"(_pane, _addType, _panel, _panelIndex){
                            let copyPanel = jQuery.extend({}, _pane),
                                addProcessor = {
                                    "stack"(_pane, _panel){
                                        if (_pane.panels[0] && _pane.panels[0].panelPath) {
                                            this.addPanel(_pane.panels[0].panelPath, _addType, _panel);
                                        }
                                    },
                                    "row-left"(_pane, _panel){
                                        let parentPath = addPath.substr(0, addPath.lastIndexOf("."));
                                        let parentPane = getPanel(parentPath);
                                        if (parentPane && parentPane.type == "row") {
                                            this.addPanel(parentPane.panelPath, _addType, _panel, _pane.panelIndex);
                                        } else {
                                            _pane = setPanel(addPath, {
                                                type: "row",
                                                panels: []
                                            });
                                            _pane.panels.push(_panel);
                                            _pane.panels.push(copyPanel);
                                            arrangePanel();
                                        }
                                    },
                                    "row-right"(_pane, _panel){
                                        let parentPath = addPath.substr(0, addPath.lastIndexOf("."));
                                        let parentPane = getPanel(parentPath);
                                        if (parentPane && parentPane.type == "row") {
                                            this.addPanel(parentPane.panelPath, _addType, _panel, _pane.panelIndex);
                                        } else {
                                            _pane = setPanel(addPath, {
                                                type: "row",
                                                panels: []
                                            });
                                            _pane.panels.push(copyPanel);
                                            _pane.panels.push(_panel);
                                            arrangePanel();
                                        }
                                    },
                                    "column-top"(_pane, _panel){
                                        _pane.panels.splice(_panelIndex, 0, _panel);
                                        arrangePanel();
                                    },
                                    "column-bottom"(_pane, _panel){
                                        _pane.panels.splice(_panelIndex + 1, 0, _panel);
                                        arrangePanel();
                                    }
                                };
                            if (_addType in addProcessor) {
                                addProcessor[_addType].call(this, _pane, _panel);
                            }

                            addProcessor = null;
                            copyPanel = null;
                        },
                        "panel"(_pane, _addType, _panel){
                            let copyPanel = jQuery.extend({}, _pane),
                                addProcessor = {
                                    "stack"(_pane, _panel){
                                        // _pane stack으로 재구성
                                        _pane = setPanel(addPath, {
                                            type: "stack",
                                            panels: []
                                        });

                                        if (_panel.active) {
                                            panelsDeactive(copyPanel);
                                        }

                                        _pane.panels.push(copyPanel);
                                        _pane.panels.push(_panel);
                                        arrangePanel();
                                    },
                                    "stack-left"(_pane, _panel){
                                        // _pane stack으로 재구성
                                        _pane = setPanel(addPath, {
                                            type: "stack",
                                            panels: []
                                        });

                                        if (_panel.active) {
                                            panelsDeactive(copyPanel);
                                        }
                                        _pane.panels.push(_panel);
                                        _pane.panels.push(copyPanel);
                                        arrangePanel();
                                    },
                                    "stack-right"(_pane, _panel){
                                        // _pane stack으로 재구성
                                        _pane = setPanel(addPath, {
                                            type: "stack",
                                            panels: []
                                        });

                                        if (_panel.active) {
                                            panelsDeactive(copyPanel);
                                        }
                                        _pane.panels.push(copyPanel);
                                        _pane.panels.push(_panel);
                                        arrangePanel();
                                    },
                                    "row-left"(_pane, _panel){
                                        let parentPath = addPath.substr(0, addPath.lastIndexOf("."));
                                        let parentPane = getPanel(parentPath);
                                        if (parentPane && parentPane.type == "row" || parentPane.type == "column") {
                                            this.addPanel(parentPane.panelPath, _addType, _panel, _pane.panelIndex);
                                        } else {
                                            _pane = setPanel(addPath, {
                                                type: "row",
                                                panels: []
                                            });
                                            _pane.panels.push(_panel);
                                            _pane.panels.push(copyPanel);
                                            arrangePanel();
                                        }
                                    },
                                    "row-right"(_pane, _panel){
                                        let parentPath = addPath.substr(0, addPath.lastIndexOf("."));
                                        let parentPane = getPanel(parentPath);
                                        if (parentPane && parentPane.type == "row" || parentPane.type == "column") {
                                            this.addPanel(parentPane.panelPath, _addType, _panel, _pane.panelIndex);
                                        } else {
                                            _pane = setPanel(addPath, {
                                                type: "row",
                                                panels: []
                                            });
                                            _pane.panels.push(copyPanel);
                                            _pane.panels.push(_panel);
                                            arrangePanel();
                                        }
                                    },
                                    "column-top"(_pane, _panel){
                                        let parentPath = addPath.substr(0, addPath.lastIndexOf("."));
                                        let parentPane = getPanel(parentPath);
                                        if (parentPane && parentPane.type == "column" || parentPane.type == "row") {
                                            this.addPanel(parentPane.panelPath, _addType, _panel, _pane.panelIndex);
                                        } else {
                                            _pane = setPanel(addPath, {
                                                type: "column",
                                                panels: []
                                            });
                                            _pane.panels.push(_panel);
                                            _pane.panels.push(copyPanel);
                                            arrangePanel();
                                        }
                                    },
                                    "column-bottom"(_pane, _panel){
                                        let parentPath = addPath.substr(0, addPath.lastIndexOf("."));
                                        let parentPane = getPanel(parentPath);

                                        if (parentPane && parentPane.type == "column" || parentPane.type == "row") {
                                            this.addPanel(parentPane.panelPath, _addType, _panel, _pane.panelIndex);
                                        } else {
                                            _pane = setPanel(addPath, {
                                                type: "column",
                                                panels: []
                                            });
                                            _pane.panels.push(copyPanel);
                                            _pane.panels.push(_panel);
                                            arrangePanel();
                                        }
                                    }
                                };

                            if (_addType in addProcessor) {
                                addProcessor[_addType].call(this, _pane, _panel);
                            }

                            copyPanel = null;
                            addProcessor = null;
                        }
                    };

                    if ((pane) ? pane.type : "stack" in panelProcessor) {
                        panelProcessor[(pane) ? pane.type : "stack"].call(this, pane, _addType, _panel, _panelIndex);
                    }

                    return this;
                };

                /**
                 * 패널 삭제하기
                 * @method ax5docker.removePanel
                 * @param {String} panelPath
                 * @param {Function} callback
                 * @returns {ax5docker}
                 * @example
                 * ```js
                 * function removePanel() {
                 *      var p = myDocker.searchPanel(function (panel) {
                 *          return (panel.key == "A");
                 *      });
                 *
                 *      if (p) {
                 *          myDocker.removePanel(p.panelPath, function () {
                 *              removePanel();
                 *          });
                 *      }
                 * }
                 * removePanel();
                 * ```
                 */
                this.removePanel = function (panelPath, callback) {
                    let panel = getPanel(panelPath);

                    controlPanel(panel, "destroy", callback);

                    panel = null;
                    return this;
                };

                /**
                 * @method ax5docker.appendPanel
                 * @param _panel
                 * @param _appendPath
                 * @param _appendType
                 * @returns {ax5docker}
                 */
                this.appendPanel = function (_panel, _appendPath, _appendType) {
                    console.log(_panel);
                    let copiedPanel = $.extend({}, _panel, {panelPath: ""}),
                        addType;

                    let removePanelPath = _panel.panelPath;
                    let appendPanelIndex = U.right(_appendPath, ".").replace(/\D/g, "");

                    if (_appendType.length == 0) {
                        return this;
                    }

                    if (_panel.panelPath === _appendPath) {
                        let parentPath = _appendPath.substr(0, _appendPath.lastIndexOf("."));
                        let parentPane = getPanel(parentPath);
                        if (parentPane.type != "stack") {
                            return this;
                        }
                    }

                    if (_appendType.length == 1) { // stack
                        addType = (_appendType[0] == "last-child") ? "stack" : "stack-" + _appendType[0];
                        copiedPanel.active = false;
                        copiedPanel.$item.removeClass("active");
                        controlPanel(copiedPanel, "deactive");

                    } else {
                        switch (_appendType[0] + "-" + _appendType[1]) {
                            case "left-top":
                                addType = "row-left";
                                break;
                            case "left-middle":
                                addType = "row-left";
                                break;
                            case "left-bottom":
                                addType = "row-left";
                                break;
                            case "center-top":
                                addType = "column-top";
                                break;
                            case "center-middle":
                                addType = "stack";
                                copiedPanel.active = false;
                                copiedPanel.$item.removeClass("active");
                                appendPanelIndex = undefined;
                                controlPanel(copiedPanel, "deactive");
                                break;
                            case "center-bottom":
                                addType = "column-bottom";
                                break;
                            case "right-top":
                                addType = "row-right";
                                break;
                            case "right-middle":
                                addType = "row-right";
                                break;
                            case "right-bottom":
                                addType = "row-right";
                                break;
                        }
                    }

                    if (_panel.panelPath === _appendPath) {
                        // 부모레벨로 이동
                        _appendPath = U.left(_appendPath, ".");
                    }
                    // todo : deactive call

                    setPanel(removePanelPath, null);
                    
                    console.log(_appendPath, addType, copiedPanel, appendPanelIndex);
                    this.addPanel(_appendPath, addType, copiedPanel, appendPanelIndex);

                    copiedPanel = null;
                    return this;
                };

                /**
                 * @method ax5docker.align
                 * @returns {ax5docker}
                 */
                this.align = function () {
                    alignStackPane();
                    return this;
                };

                /**
                 * @method ax5docker.searchPanel
                 * @param _condition
                 * @returns {*}
                 * @example
                 * ```js
                 * var p = myDocker.searchPanel(function (panel) {
                 *  return (panel.id == "A");
                 * });
                 * ```
                 */
                this.searchPanel = function (_condition) {
                    if (U.isFunction(_condition)) {

                        const findPanel = function (_panels) {
                            let i = 0, l = _panels.length, findResult;
                            for (; i < l; i++) {
                                if(_panels[i]) {
                                    if (_panels[i].type === "panel") {
                                        if (_condition.call({
                                                config: self.config,
                                                panel: _panels[i]
                                            }, _panels[i])) {
                                            return _panels[i];
                                        }
                                    } else {
                                        if (findResult = findPanel(_panels[i].panels)) {
                                            return findResult;
                                        }
                                    }
                                }
                            }
                        };

                        return findPanel(this.panels);

                    } else if (U.isString(_condition)) {

                        return getPanel(_condition);

                    }
                };

                /**
                 * @method ax5docker.activePanel
                 * @param {String} _panelPath
                 * @param {Function} callback
                 * @returns {ax5docker}
                 * @example
                 * ```js
                 * myDocker.activePanel("0.1");
                 * myDocker.activePanel("0.0.1");
                 * ```
                 */
                this.activePanel = function (_panelPath, callback) {
                    let activePanelPath = "";
                    let pane;
                    let parent;

                    if (this.panels.length === 0 || !this.panels[0]) {
                        // 액티브 대상 없음.
                        return this;
                    } else {
                        if (typeof _panelPath == "undefined") {
                            activePanelPath = "0";
                        } else {
                            activePanelPath = _panelPath
                                .replace(/[a-zA-Z\[\]]+/g, "")
                                .replace(/(\d+)/g, function (a, b) {
                                    return "panels[" + a + "]";
                                });
                        }
                        pane = getPanel(activePanelPath);
                        parent = getPanelParent(pane);
                    }

                    changeActiveStackPanel(parent, pane.panelIndex);
                    return this;
                };

                // 클래스 생성자
                this.main = (function () {
                    UI.docker_instance = UI.docker_instance || [];
                    UI.docker_instance.push(this);

                    if (arguments && U.isObject(arguments[0])) {
                        this.setConfig(arguments[0]);
                    }
                }).apply(this, arguments);

            };
        })()
    );

    DOCKER = ax5.ui.docker;
})();