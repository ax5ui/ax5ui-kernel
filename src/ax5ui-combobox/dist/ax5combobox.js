'use strict';

/*
 * Copyright (c) 2016. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

// ax5.ui.combobox
(function (root, _SUPER_) {

    /**
     * @class ax5combobox
     * @classdesc
     * @version 0.1.3
     * @author tom@axisj.com
     * @example
     * ```
     * var mycombobox = new ax5.ui.combobox();
     * ```
     */
    var U = ax5.util;

    //== UI Class
    var axClass = function axClass() {
        var self = this,
            cfg;

        if (_SUPER_) _SUPER_.call(this); // 부모호출

        this.instanceId = ax5.getGuid();
        this.queue = [];
        this.config = {
            theme: 'default',
            animateTime: 250,
            lang: {
                noSelected: '',
                noOptions: 'no options',
                loading: 'now loading..'
            },
            columnKeys: {
                optionValue: 'value',
                optionText: 'text',
                optionSelected: 'selected'
            }
        };

        this.activecomboboxOptionGroup = null;
        this.activecomboboxQueueIndex = -1;
        this.openTimer = null;
        this.closeTimer = null;
        this.waitOptionsCallback = null;
        this.keyUpTimer = null;

        cfg = this.config;

        var ctrlKeys = {
            "18": "KEY_ALT",
            "8": "KEY_BACKSPACE",
            "17": "KEY_CONTROL",
            "46": "KEY_DELETE",
            "40": "KEY_DOWN",
            "35": "KEY_END",
            "187": "KEY_EQUAL",
            "27": "KEY_ESC",
            "36": "KEY_HOME",
            "45": "KEY_INSERT",
            "37": "KEY_LEFT",
            "189": "KEY_MINUS",
            "34": "KEY_PAGEDOWN",
            "33": "KEY_PAGEUP",
            // "190": "KEY_PERIOD",
            "13": "KEY_RETURN",
            "39": "KEY_RIGHT",
            "16": "KEY_SHIFT",
            // "32": "KEY_SPACE",
            "9": "KEY_TAB",
            "38": "KEY_UP",
            "91": "KEY_WINDOW"
            //"107" : "NUMPAD_ADD",
            //"194" : "NUMPAD_COMMA",
            //"110" : "NUMPAD_DECIMAL",
            //"111" : "NUMPAD_DIVIDE",
            //"12" : "NUMPAD_EQUAL",
            //"106" : "NUMPAD_MULTIPLY",
            //"109" : "NUMPAD_SUBTRACT"
        },
            onStateChanged = function onStateChanged(item, that) {
            if (item && item.onStateChanged) {
                item.onStateChanged.call(that, that);
            } else if (this.onStateChanged) {
                this.onStateChanged.call(that, that);
            }

            if (that.state == "changeValue") {
                if (item && item.onChange) {
                    item.onChange.call(that, that);
                } else if (this.onChange) {
                    this.onChange.call(that, that);
                }
            }

            item = null;
            that = null;
            return true;
        },
            getOptionGroupTmpl = function getOptionGroupTmpl(columnKeys) {
            return '\n                <div class="ax5combobox-option-group {{theme}} {{size}}" data-ax5combobox-option-group="{{id}}">\n                    <div class="ax-combobox-body">\n                        <div class="ax-combobox-option-group-content" data-els="content"></div>\n                    </div>\n                    <div class="ax-combobox-arrow"></div> \n                </div>\n                ';
        },
            getTmpl = function getTmpl() {
            return '\n                <div class="form-control {{formSize}} ax5combobox-display {{theme}}" \n                data-ax5combobox-display="{{id}}" data-ax5combobox-instance="{{instanceId}}">\n                    <div class="ax5combobox-display-table" data-els="display-table">\n                        <div data-ax5combobox-display="label-holder"> \n                        <a {{^tabIndex}}href="#ax5combobox-{{id}}" {{/tabIndex}}{{#tabIndex}}tabindex="{{tabIndex}}" {{/tabIndex}}\n                        data-ax5combobox-display="label"\n                        contenteditable="true"\n                        spellcheck="false">{{{label}}}</a>\n                        </div>\n                        <div data-ax5combobox-display="addon"> \n                            {{#multiple}}{{#reset}}\n                            <span class="addon-icon-reset" data-selected-clear="true">{{{.}}}</span>\n                            {{/reset}}{{/multiple}}\n                            {{#icons}}\n                            <span class="addon-icon-closed">{{clesed}}</span>\n                            <span class="addon-icon-opened">{{opened}}</span>\n                            {{/icons}}\n                            {{^icons}}\n                            <span class="addon-icon-closed"><span class="addon-icon-arrow"></span></span>\n                            <span class="addon-icon-opened"><span class="addon-icon-arrow"></span></span>\n                            {{/icons}}\n                        </div>\n                    </div>\n                </a>\n                ';
        },
            getSelectTmpl = function getSelectTmpl() {
            return '\n                <select tabindex="-1" class="form-control {{formSize}}" name="{{name}}" {{#multiple}}multiple="multiple"{{/multiple}}></select>\n                ';
        },
            getOptionsTmpl = function getOptionsTmpl(columnKeys) {
            return '\n                {{#waitOptions}}\n                    <div class="ax-combobox-option-item">\n                            <div class="ax-combobox-option-item-holder">\n                                <span class="ax-combobox-option-item-cell ax-combobox-option-item-label">\n                                    {{{lang.loading}}}\n                                </span>\n                            </div>\n                        </div>\n                {{/waitOptions}}\n                {{^waitOptions}}\n                    {{#options}}\n                        {{#optgroup}}\n                            <div class="ax-combobox-option-group">\n                                <div class="ax-combobox-option-item-holder">\n                                    <span class="ax-combobox-option-group-label">\n                                        {{{.}}}\n                                    </span>\n                                </div>\n                                {{#options}}\n                                {{^hide}}\n                                <div class="ax-combobox-option-item" data-option-focus-index="{{@findex}}" data-option-group-index="{{@gindex}}" data-option-index="{{@index}}" \n                                data-option-value="{{' + columnKeys.optionValue + '}}" \n                                {{#' + columnKeys.optionSelected + '}}data-option-selected="true"{{/' + columnKeys.optionSelected + '}}>\n                                    <div class="ax-combobox-option-item-holder">\n                                        {{#multiple}}\n                                        <span class="ax-combobox-option-item-cell ax-combobox-option-item-checkbox">\n                                            <span class="item-checkbox-wrap useCheckBox" data-option-checkbox-index="{{@i}}"></span>\n                                        </span>\n                                        {{/multiple}}\n                                        <span class="ax-combobox-option-item-cell ax-combobox-option-item-label">{{' + columnKeys.optionText + '}}</span>\n                                    </div>\n                                </div>\n                                {{/hide}}\n                                {{/options}}\n                            </div>                            \n                        {{/optgroup}}\n                        {{^optgroup}}\n                        {{^hide}}\n                        <div class="ax-combobox-option-item" data-option-focus-index="{{@findex}}" data-option-index="{{@index}}" data-option-value="{{' + columnKeys.optionValue + '}}" {{#' + columnKeys.optionSelected + '}}data-option-selected="true"{{/' + columnKeys.optionSelected + '}}>\n                            <div class="ax-combobox-option-item-holder">\n                                {{#multiple}}\n                                <span class="ax-combobox-option-item-cell ax-combobox-option-item-checkbox">\n                                    <span class="item-checkbox-wrap useCheckBox" data-option-checkbox-index="{{@i}}"></span>\n                                </span>\n                                {{/multiple}}\n                                <span class="ax-combobox-option-item-cell ax-combobox-option-item-label">{{' + columnKeys.optionText + '}}</span>\n                            </div>\n                        </div>\n                        {{/hide}}\n                        {{/optgroup}}\n                    {{/options}}\n                    {{^options}}\n                        <div class="ax-combobox-option-item">\n                            <div class="ax-combobox-option-item-holder">\n                                <span class="ax-combobox-option-item-cell ax-combobox-option-item-label">\n                                    {{{lang.noOptions}}}\n                                </span>\n                            </div>\n                        </div>\n                    {{/options}}\n                {{/waitOptions}}\n                ';
        },
            getLabelTmpl = function getLabelTmpl(columnKeys) {
            return '\n                {{#selected}}\n                <span tabindex="-1" data-ax5combobox-selected-label="{{@i}}" data-ax5combobox-selected-text="{{text}}">{{text}}</span> \n                {{/selected}}\n                <span>&nbsp;</span>\n                ';
        },
            alignComboboxDisplay = function alignComboboxDisplay() {
            var i = this.queue.length,
                w;

            while (i--) {
                var item = this.queue[i];
                if (item.$display) {
                    w = Math.max(item.$select.outerWidth(), U.number(item.minWidth));
                    item.$display.css({
                        "min-width": w
                    });
                    if (item.reset) {
                        item.$display.find(".addon-icon-reset").css({
                            "line-height": this.queue[i].$display.height() + "px"
                        });
                    }

                    // 높이조절 처리
                    if (item.multiple) {
                        var displayTableHeightAdjust = function () {
                            return U.number(item.$display.css("border-top-width")) + U.number(item.$display.css("border-bottom-width"));
                        }.call(this);
                        item.$target.height('');
                        item.$display.height('');

                        var displayTableHeight = item.$displayTable.outerHeight();
                        if (Math.abs(displayTableHeight - item.$target.height()) > displayTableHeightAdjust) {
                            item.$target.css({ height: displayTableHeight + displayTableHeightAdjust });
                            item.$display.css({ height: displayTableHeight + displayTableHeightAdjust });
                        }
                    }
                }
            }

            i = null;
            w = null;
            return this;
        },
            alignComboboxOptionGroup = function alignComboboxOptionGroup(append) {
            if (!this.activecomboboxOptionGroup) return this;

            var item = this.queue[this.activecomboboxQueueIndex],
                pos = {},
                dim = {};

            if (append) jQuery(document.body).append(this.activecomboboxOptionGroup);

            pos = item.$target.offset();
            dim = {
                width: item.$target.outerWidth(),
                height: item.$target.outerHeight()
            };

            // picker css(width, left, top) & direction 결정
            if (!item.direction || item.direction === "" || item.direction === "auto") {
                // set direction
                item.direction = "top";
            }

            if (append) {
                this.activecomboboxOptionGroup.addClass("direction-" + item.direction);
            }
            this.activecomboboxOptionGroup.css(function () {
                if (item.direction == "top") {
                    return {
                        left: pos.left,
                        top: pos.top + dim.height + 1,
                        width: dim.width
                    };
                } else if (item.direction == "bottom") {
                    return {
                        left: pos.left,
                        top: pos.top - this.activecomboboxOptionGroup.outerHeight() - 1,
                        width: dim.width
                    };
                }
            }.call(this));
        },
            onBodyClick = function onBodyClick(e, target) {
            if (!this.activecomboboxOptionGroup) return this;

            var item = this.queue[this.activecomboboxQueueIndex],
                clickEl = "display";

            target = U.findParentNode(e.target, function (target) {
                if (target.getAttribute("data-option-value")) {
                    clickEl = "optionItem";
                    return true;
                } else if (item.$target.get(0) == target) {
                    clickEl = "display";
                    return true;
                }
            });

            if (!target) {
                this.close();
                return this;
            } else if (clickEl === "optionItem") {
                this.val(item.id, {
                    index: {
                        gindex: target.getAttribute("data-option-group-index"),
                        index: target.getAttribute("data-option-index")
                    }
                }, undefined, "internal");
                U.selectRange(item.$displayLabel, "end"); // 포커스 end || selectAll
                if (!item.multiple) {
                    this.close();
                }
            } else {
                //open and display click
                //console.log(this.instanceId);
            }

            return this;
        },
            onBodyKeyup = function onBodyKeyup(e) {
            if (e.keyCode == ax5.info.eventKeys.ESC) {
                this.close();
            } else if (e.which == ax5.info.eventKeys.RETURN) {
                var values = [];
                var item = this.queue[this.activecomboboxQueueIndex];
                var childNodes = item.$displayLabel.get(0).childNodes;
                for (var i = 0, l = childNodes.length; i < l; i++) {
                    var node = childNodes[i];
                    // nodeType:1 - span, nodeType:3 - text
                    if (node.nodeType in nodeTypeProcessor) {
                        var value = nodeTypeProcessor[node.nodeType].call(this, this.activecomboboxQueueIndex, node);
                        if (typeof value !== "undefined") values.push(value);
                    }
                }

                this.val(item.id, values, true, "internal"); // set Value
                if (!item.multiple) this.close();
            }
        },
            getLabel = function getLabel(queIdx) {
            var item = this.queue[queIdx];

            // 템플릿에 전달 해야할 데이터 선언
            var data = {};
            data.id = item.id;
            data.theme = item.theme;
            data.size = "ax5combobox-option-group-" + item.size;
            data.multiple = item.multiple;
            data.lang = item.lang;
            data.options = item.options;
            data.selected = item.selected;
            data.hasSelected = data.selected && data.selected.length > 0;
            return ax5.mustache.render(getLabelTmpl.call(this, item.columnKeys), data);
        },
            syncLabel = function syncLabel(queIdx) {
            var item = this.queue[queIdx],
                displayTableHeight;
            item.$displayLabel.html(getLabel.call(this, queIdx));

            // label 사이즈 체크
            //console.log(this.queue[queIdx].$displayTable.outerHeight());
            if (item.$target.height() < (displayTableHeight = item.$displayTable.outerHeight())) {
                var displayTableHeightAdjust = function () {
                    return U.number(item.$display.css("border-top-width")) + U.number(item.$display.css("border-bottom-width"));
                }();
                item.$target.css({ height: displayTableHeight + displayTableHeightAdjust });
                item.$display.css({ height: displayTableHeight + displayTableHeightAdjust });
            } else {
                item.$target.height('');
                item.$display.height('');
            }
        },
            focusLabel = function focusLabel(queIdx) {

            this.queue[queIdx].$displayLabel.trigger("focus");
            U.selectRange(this.queue[queIdx].$displayLabel, "end"); // 포커스 end || selectAll
            /*
             if (this.queue[queIdx].$displayLabel.text().replace(/^\W*|\W*$/g, '') == "") {
             this.queue[queIdx].$displayLabel.html('<span>&nbsp;</span>').trigger("focus");
             U.selectRange(this.queue[queIdx].$displayLabel, [0, 0]); // 포커스 end || selectAll
             }
             else {
             this.queue[queIdx].$displayLabel.trigger("focus");
             U.selectRange(this.queue[queIdx].$displayLabel, "end"); // 포커스 end || selectAll
             }
             */
        },
            focusWord = function focusWord(queIdx, searchWord) {
            var options = [],
                i = -1,
                l = this.queue[queIdx].indexedOptions.length - 1,
                n;
            if (searchWord != "") {
                var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
                searchWord = searchWord.replace(regExp, "");

                while (l - i++) {
                    n = this.queue[queIdx].indexedOptions[i];

                    if (('' + n.text).toLowerCase() == searchWord.toLowerCase()) {
                        options = [{ '@findex': n['@findex'], optionsSort: 0 }];
                        break;
                    } else {
                        var sort = ('' + n.text).toLowerCase().search(searchWord.toLowerCase());
                        if (sort > -1) {
                            options.push({ '@findex': n['@findex'], optionsSort: sort });
                            if (options.length > 2) break;
                        }
                        sort = null;
                    }
                }
                options.sort(function (a, b) {
                    return a.optionsSort - b.optionsSort;
                });
            }
            if (options && options.length > 0) {
                focusMove.call(this, queIdx, undefined, options[0]['@findex']);
            } else {
                focusClear.call(this, queIdx);
            }

            try {
                return options;
            } finally {
                options = null;
                i = null;
                l = null;
                n = null;
            }
        },
            focusClear = function focusClear(queIdx) {
            if (this.activecomboboxOptionGroup) {
                this.activecomboboxOptionGroup.find('[data-option-focus-index]').removeClass("hover").removeAttr("data-option-selected");
            }

            this.queue[queIdx].optionFocusIndex = -1;
        },
            focusMove = function focusMove(queIdx, direction, findex) {
            var _focusIndex, _prevFocusIndex, focusOptionEl, optionGroupScrollContainer;
            var item = this.queue[queIdx];

            if (this.activecomboboxOptionGroup && item.options && item.options.length > 0) {

                if (typeof findex !== "undefined") {
                    _focusIndex = findex;
                } else {
                    _prevFocusIndex = item.optionFocusIndex == -1 ? item.optionSelectedIndex || -1 : item.optionFocusIndex;
                    if (_prevFocusIndex == -1) {
                        _focusIndex = 0;
                        //_focusIndex = (direction > 0) ? 0 : item.optionItemLength - 1; // 맨 끝으로 보낼것인가 말 것인가.
                    } else {
                            _focusIndex = _prevFocusIndex + direction;
                            if (_focusIndex < 0) _focusIndex = 0;else if (_focusIndex > item.optionItemLength - 1) _focusIndex = item.optionItemLength - 1;
                        }
                }

                item.optionFocusIndex = _focusIndex;

                // 포커스 인덱스가 hide아이템을 만나면 hide 아이템이 안나올 때까지 루프를 순회 합니다.
                // todo : editable 로 추가된 options가 제거 되지 않으므로. 인덱스 검색을 좀 더 보강 해야함.
                if (item.options[_focusIndex] && item.options[_focusIndex].hide) {
                    // 옵션이 없는 값이 선택된 경우
                    if (typeof direction === "undefined") {
                        return this;
                    } else {
                        var isStrop = false;
                        while (item.options[_focusIndex].hide) {
                            _focusIndex = _focusIndex + direction;
                            if (_focusIndex < 0) {
                                _focusIndex = 0;
                                break;
                            } else if (_focusIndex > item.optionItemLength - 1) {
                                _focusIndex = item.optionItemLength - 1;
                                break;
                            }
                        }
                    }
                }

                if (typeof _focusIndex !== "undefined") {
                    this.activecomboboxOptionGroup.find('[data-option-focus-index]').removeClass("hover");

                    focusOptionEl = this.activecomboboxOptionGroup.find('[data-option-focus-index="' + _focusIndex + '"]').addClass("hover");

                    optionGroupScrollContainer = this.activecomboboxOptionGroup.find('[data-els="content"]');

                    if (focusOptionEl.get(0)) {
                        var focusOptionElHeight = focusOptionEl.outerHeight(),
                            optionGroupScrollContainerHeight = optionGroupScrollContainer.innerHeight(),
                            optionGroupScrollContainerScrollTop = optionGroupScrollContainer.scrollTop(),
                            focusOptionElTop = focusOptionEl.position().top + optionGroupScrollContainer.scrollTop();

                        if (optionGroupScrollContainerHeight + optionGroupScrollContainerScrollTop < focusOptionElTop + focusOptionElHeight) {
                            optionGroupScrollContainer.scrollTop(focusOptionElTop + focusOptionElHeight - optionGroupScrollContainerHeight);
                        } else if (optionGroupScrollContainerScrollTop > focusOptionElTop) {
                            optionGroupScrollContainer.scrollTop(focusOptionElTop);
                        }
                        // optionGroup scroll check

                        if (typeof direction !== "undefined") {
                            // 방향이 있으면 커서 업/다운 아니면 사용자 키보드 입력
                            // 방향이 있으면 라벨 값을 수정
                            var childNodes = item.$displayLabel.get(0).childNodes;
                            var lastNode = childNodes[childNodes.length - 1];
                            if (lastNode.nodeType != '1') {
                                lastNode = childNodes[childNodes.length - 2];
                            }
                            if (!lastNode) return this;

                            if (lastNode.getAttribute("data-ax5combobox-selected-text")) {} else {
                                lastNode.innerHTML = "&nbsp;" + item.indexedOptions[_focusIndex].text;
                                U.selectRange(item.$displayLabel, "end");
                            }
                        }
                    }
                }
            }
        },
            bindComboboxTarget = function () {
            var debouncedFocusWord = U.debounce(function (queIdx) {
                var values = [];
                var searchWord = "";
                var item = this.queue[queIdx];
                var childNodes = item.$displayLabel.get(0).childNodes;

                for (var i = 0, l = childNodes.length; i < l; i++) {
                    var node = childNodes[i];
                    if (node.nodeType in nodeTypeProcessor) {

                        var value = nodeTypeProcessor[node.nodeType].call(this, this.activecomboboxQueueIndex, node, true);

                        if (typeof value === "undefined") {
                            //
                        } else if (U.isString(value)) {
                                searchWord = value;
                                if (node.nodeType == '1' && node.getAttribute("data-ax5combobox-selected-text")) {
                                    // 노드 타입인데 문자열이 리턴 되었다면 선택을 취소해야함.
                                    searchWord = false; // 검색을 수행하지 않고 값을 변경하자.
                                } else {
                                        values.push(value);
                                    }
                            } else {
                                values.push(value);
                            }
                    }
                }

                if (childNodes.length == 0) {
                    this.val(item.id, null, undefined, "internal"); // clear value
                } else if (searchWord === false) {
                        //this.val(item.id, null, undefined, "internal"); // clear value
                        this.val(item.id, values, undefined, "internal"); // set Value
                        U.selectRange(item.$displayLabel, "end"); // label focus end
                    } else if (searchWord != "") {
                            focusWord.call(self, queIdx, searchWord);
                        }
            }, 100);
            var comboboxEvent = {
                'click': function click(queIdx, e) {
                    var target = U.findParentNode(e.target, function (target) {
                        if (target.getAttribute("data-selected-clear")) {
                            //clickEl = "clear";
                            return true;
                        }
                    });

                    if (target) {
                        // selected clear
                        this.val(queIdx, { clear: true });
                    } else {
                        if (self.activecomboboxQueueIndex == queIdx) {
                            if (this.queue[queIdx].optionFocusIndex == -1) {
                                // 아이템에 포커스가 활성화 된 후, 마우스 이벤트 이면 무시
                                self.close();
                            }
                        } else {
                            self.open(queIdx);
                            if (this.queue[queIdx].$displayLabel.text().replace(/^\W*|\W*$/g, '') == "") {
                                focusLabel.call(this, queIdx);
                            }
                        }
                    }
                },
                'keyUp': function keyUp(queIdx, e) {
                    /// 약속된 키 이벤트가 발생하면 stopEvent를 통해 keyUp 이벤트가 발생되지 않도록 막아주는 센스
                    if (e.which == ax5.info.eventKeys.ESC && self.activecomboboxQueueIndex === -1) {
                        // ESC키를 누르고 옵션그룹이 열려있지 않은 경우
                        U.stopEvent(e);
                        return this;
                    }
                    if (self.activecomboboxQueueIndex != queIdx) {
                        // 닫힌 상태 인경우
                        self.open(queIdx);
                        U.stopEvent(e);
                    }
                    debouncedFocusWord.call(this, queIdx);
                },
                'keyDown': function keyDown(queIdx, e) {
                    if (e.which == ax5.info.eventKeys.ESC) {
                        U.stopEvent(e);
                    } else if (e.which == ax5.info.eventKeys.RETURN) {
                        // display label에서 줄넘김막기위한 구문
                        U.stopEvent(e);
                    } else if (e.which == ax5.info.eventKeys.DOWN) {
                        focusMove.call(this, queIdx, 1);
                        U.stopEvent(e);
                    } else if (e.which == ax5.info.eventKeys.UP) {
                        focusMove.call(this, queIdx, -1);
                        U.stopEvent(e);
                    }
                },
                'focus': function focus(queIdx, e) {
                    //console.log(e);
                },
                'blur': function blur(queIdx, e) {
                    //console.log(e);
                }
            };

            return function (queIdx) {
                var item = this.queue[queIdx];
                var data = {};
                // 현재 선택된 값을 담아두는 저장소, syncComboboxOptions를 통해 options와 selected값을 동기화 처리 한다.
                item.selected = [];

                if (!item.$display) {
                    /// 템플릿에 전달할 오브젝트 선언
                    data.instanceId = this.instanceId;
                    data.id = item.id;
                    data.name = item.name;
                    data.theme = item.theme;
                    data.tabIndex = item.tabIndex;
                    data.multiple = item.multiple;
                    data.reset = item.reset;

                    data.label = getLabel.call(this, queIdx);
                    data.formSize = function () {
                        return item.size ? "input-" + item.size : "";
                    }();

                    item.$display = jQuery(ax5.mustache.render(getTmpl.call(this, queIdx), data));
                    item.$displayTable = item.$display.find('[data-els="display-table"]');
                    item.$displayLabel = item.$display.find('[data-ax5combobox-display="label"]');

                    if (item.$target.find("select").get(0)) {
                        item.$select = item.$target.find("select");
                        item.$select.attr("tabindex", "-1").attr("class", "form-control " + data.formSize);
                        if (data.name) {
                            item.$select.attr("name", "name");
                        }
                        if (data.multiple) {
                            item.$select.attr("multiple", "multiple");
                        }
                    } else {
                        item.$select = jQuery(ax5.mustache.render(getSelectTmpl.call(this, queIdx), data));
                        item.$target.append(item.$select);
                    }

                    item.$target.append(item.$display);
                    // 라벨에 사용자 입력 필드가 있으므로 displayInput은 필요 없음.
                    // select.options로 item.options를 만들어내거나 item.options로 select.options를 만들어냄
                    item.options = syncComboboxOptions.call(this, queIdx, item.options);

                    alignComboboxDisplay.call(this);
                } else {
                    item.$displayLabel.html(getLabel.call(this, queIdx));
                    item.options = syncComboboxOptions.call(this, queIdx, item.options);

                    alignComboboxDisplay.call(this);
                }

                item.$display.unbind('click.ax5combobox').bind('click.ax5combobox', comboboxEvent.click.bind(this, queIdx));

                // combobox 태그에 대한 이벤트 감시
                item.$displayLabel.unbind("focus.ax5combobox").bind("focus.ax5combobox", comboboxEvent.focus.bind(this, queIdx)).unbind("blur.ax5combobox").bind("blur.ax5combobox", comboboxEvent.blur.bind(this, queIdx)).unbind('keyup.ax5combobox').bind('keyup.ax5combobox', comboboxEvent.keyUp.bind(this, queIdx)).unbind("keydown.ax5combobox").bind("keydown.ax5combobox", comboboxEvent.keyDown.bind(this, queIdx));

                data = null;
                item = null;
                queIdx = null;
                return this;
            };
        }(),
            syncComboboxOptions = function () {
            var setSelected = function setSelected(queIdx, O) {
                if (!O) {
                    this.queue[queIdx].selected = [];
                } else {
                    this.queue[queIdx].selected.push(jQuery.extend({}, O));
                    /*
                     콤보박스는 selected가 없을 때 options의 첫번째 아이템이 selected가 되지 않는다.
                     if (this.queue[queIdx].multiple) this.queue[queIdx].selected.push(jQuery.extend({}, O));
                     else this.queue[queIdx].selected[0] = jQuery.extend({}, O);
                     */
                }
            };

            return function (queIdx, options) {
                var item = this.queue[queIdx];
                var po,
                    elementOptions,
                    newOptions,
                    focusIndex = 0;
                setSelected.call(this, queIdx, false); // item.selected 초기화

                if (options) {
                    item.options = options;
                    item.indexedOptions = [];

                    // combobox options 태그 생성
                    po = [];
                    po.push('<option value=""></option>');

                    item.options.forEach(function (O, OIndex) {
                        /// @gindex : index of optionGroup
                        /// @index : index of options (if you use optionGroup then the index is not unique)
                        if (O.optgroup) {
                            O['@gindex'] = OIndex;
                            O.options.forEach(function (OO, OOIndex) {
                                OO['@index'] = OOIndex;
                                OO['@findex'] = focusIndex;
                                po.push('<option value="' + OO[item.columnKeys.optionValue] + '" ' + (OO[item.columnKeys.optionSelected] ? ' selected="selected"' : '') + '>' + OO[item.columnKeys.optionText] + '</option>');
                                if (OO[item.columnKeys.optionSelected]) {
                                    setSelected.call(self, queIdx, OO);
                                }

                                item.indexedOptions.push({
                                    '@findex': focusIndex, value: OO[item.columnKeys.optionValue], text: OO[item.columnKeys.optionText]
                                });
                                focusIndex++;
                            });
                        } else {
                            O['@index'] = OIndex;
                            O['@findex'] = focusIndex;
                            po.push('<option value="' + O[item.columnKeys.optionValue] + '" ' + (O[item.columnKeys.optionSelected] ? ' selected="selected"' : '') + '>' + O[item.columnKeys.optionText] + '</option>');
                            if (O[item.columnKeys.optionSelected]) {
                                setSelected.call(self, queIdx, O);
                            }

                            item.indexedOptions.push({
                                '@findex': focusIndex, value: O[item.columnKeys.optionValue], text: O[item.columnKeys.optionText]
                            });
                            focusIndex++;
                        }
                    });
                    item.optionItemLength = focusIndex;
                    item.$select.html(po.join(''));
                } else {
                    /// select > options 태그로 스크립트 options를 만들어주는 역할
                    elementOptions = U.toArray(item.$select.get(0).options);
                    // select option 스크립트 생성
                    newOptions = [];
                    elementOptions.forEach(function (O, OIndex) {
                        var option = {};
                        option[item.columnKeys.optionValue] = O.value;
                        option[item.columnKeys.optionText] = O.text;
                        option[item.columnKeys.optionSelected] = O.selected;
                        option['@index'] = OIndex;
                        option['@findex'] = focusIndex;
                        if (O.selected) setSelected.call(self, queIdx, option);
                        newOptions.push(option);
                        focusIndex++;

                        option = null;
                    });
                    item.options = newOptions;
                    item.indexedOptions = newOptions;

                    item.$select.prepend('<option value=""></option>');
                    item.$select.get(0).options[0].selected = true;
                }

                po = null;
                elementOptions = null;
                newOptions = null;
                return item.options;
            };
        }(),
            getQueIdx = function getQueIdx(boundID) {
            if (!U.isString(boundID)) {
                boundID = jQuery(boundID).data("data-ax5combobox-id");
            }
            if (!U.isString(boundID)) {
                console.log(ax5.info.getError("ax5combobox", "402", "getQueIdx"));
                return;
            }
            return U.search(this.queue, function () {
                return this.id == boundID;
            });
        },
            getSelected = function getSelected(_item, o, selected) {
            if (typeof selected === "undefined") {
                return _item.multiple ? !o : true;
            } else {
                return selected;
            }
        },
            clearSelected = function clearSelected(queIdx) {

            this.queue[queIdx].options.forEach(function (n) {
                if (n.optgroup) {
                    n.options.forEach(function (nn) {
                        nn.selected = false;
                    });
                } else {
                    n.selected = false;
                }
            });
        };

        var nodeTypeProcessor = {
            '1': function _(queIdx, node, editable) {
                var text = (node.textContent || node.innerText).replace(/^[\s\r\n\t]*|[\s\r\n\t]*$/g, '');
                var item = this.queue[queIdx];
                var selectedIndex, option;
                if (node.getAttribute("data-ax5combobox-selected-text") == text) {
                    selectedIndex = node.getAttribute("data-ax5combobox-selected-label");
                    option = item.selected[selectedIndex];
                    return {
                        index: {
                            gindex: option["@gindex"],
                            index: option["@index"],
                            value: option[cfg.columnKeys.optionValue]
                        }
                    };
                } else if (!node.getAttribute("data-ax5combobox-selected-text")) {
                    if (text != "") {
                        if (!editable) {}

                        var option;
                        if (item.optionFocusIndex > -1 && (option = item.indexedOptions[item.optionFocusIndex]) && option[cfg.columnKeys.optionText].substr(0, text.length) === text) {
                            return {
                                index: {
                                    gindex: option["@gindex"],
                                    index: option["@index"],
                                    value: option[cfg.columnKeys.optionValue]
                                }
                            };
                        } else {
                            return this.queue[queIdx].editable || editable ? text : undefined;
                        }
                    } else {
                        return undefined;
                    }
                } else {
                    return text;
                }
            },
            '3': function _(queIdx, node, editable) {
                var text = (node.textContent || node.innerText).replace(/^[\s\r\n\t]*|[\s\r\n\t]*$/g, '');
                var item = this.queue[queIdx];

                if (text != "") {
                    var $option;
                    if (item.optionFocusIndex > -1) $option = this.activecomboboxOptionGroup.find('[data-option-focus-index="' + item.optionFocusIndex + '"]');
                    if (item.optionFocusIndex > -1 && $option.get(0) && $option.attr("data-option-value")) {
                        return {
                            index: {
                                gindex: $option.attr("data-option-group-index"),
                                index: $option.attr("data-option-index")
                            }
                        };
                    } else {
                        return item.editable || editable ? text : undefined;
                    }
                } else {
                    return undefined;
                }
            }
        };
        /// private end

        /**
         * Preferences of combobox UI
         * @method ax5combobox.setConfig
         * @param {Object} config - 클래스 속성값
         * @returns {ax5combobox}
         * @example
         * ```
         * ```
         */
        this.init = function () {
            this.onStateChanged = cfg.onStateChanged;
            this.onChange = cfg.onChange;
            jQuery(window).bind("resize.ax5combobox-display-" + this.instanceId, function () {
                alignComboboxDisplay.call(this);
            }.bind(this));
        };

        /**
         * bind combobox
         * @method ax5combobox.bind
         * @param {Object} item
         * @param {String} [item.id]
         * @param {String} [item.theme]
         * @param {Boolean} [item.multiple]
         * @param {Element} item.target
         * @param {Object[]} item.options
         * @returns {ax5combobox}
         */
        this.bind = function (item) {
            var comboboxConfig = {},
                queIdx;

            item = jQuery.extend(true, comboboxConfig, cfg, item);
            if (!item.target) {
                console.log(ax5.info.getError("ax5combobox", "401", "bind"));
                return this;
            }

            item.$target = jQuery(item.target);

            if (!item.id) item.id = item.$target.data("data-ax5combobox-id");
            if (!item.id) {
                item.id = 'ax5combobox-' + ax5.getGuid();
                item.$target.data("data-ax5combobox-id", item.id);
            }
            item.name = item.$target.attr("data-ax5combobox");
            if (item.options) {
                item.options = JSON.parse(JSON.stringify(item.options));
            }

            // target attribute data
            (function (data) {
                if (U.isObject(data) && !data.error) {
                    item = jQuery.extend(true, item, data);
                }
            })(U.parseJson(item.$target.attr("data-ax5combobox-config"), true));

            queIdx = U.search(this.queue, function () {
                return this.id == item.id;
            });

            if (queIdx === -1) {
                this.queue.push(item);
                bindComboboxTarget.call(this, this.queue.length - 1);
            } else {
                this.queue[queIdx] = jQuery.extend(true, {}, this.queue[queIdx], item);
                bindComboboxTarget.call(this, queIdx);
            }

            comboboxConfig = null;
            queIdx = null;
            return this;
        };

        /**
         * open the optionBox of combobox
         * @method ax5combobox.open
         * @param {(String|Number|Element)} boundID
         * @param {Number} [tryCount]
         * @returns {ax5combobox}
         */
        this.open = function () {
            var onExpand = function onExpand(item) {
                item.onExpand.call({
                    self: this,
                    item: item
                }, function (O) {
                    if (this.waitOptionsCallback) {
                        var data = {};
                        var item = this.queue[this.activecomboboxQueueIndex];

                        /// 현재 selected 검증후 처리
                        (function (item, O) {
                            var optionsMap = {};
                            O.options.forEach(function (_O, _OIndex) {
                                _O["@index"] = _OIndex;
                                optionsMap[_O[item.columnKeys.optionValue]] = _O;
                            });
                            if (U.isArray(item.selected)) {
                                item.selected.forEach(function (_O) {
                                    if (optionsMap[_O[item.columnKeys.optionValue]]) {
                                        O.options[optionsMap[_O[item.columnKeys.optionValue]]["@index"]][item.columnKeys.optionSelected] = true;
                                    }
                                });
                            }
                        })(item, O);

                        item.$display.find('[data-ax5combobox-display="label"]').html(getLabel.call(this, this.activecomboboxQueueIndex));
                        item.options = syncComboboxOptions.call(this, this.activecomboboxQueueIndex, O.options);

                        alignComboboxDisplay.call(this);

                        /// 템플릿에 전달할 오브젝트 선언
                        data.id = item.id;
                        data.theme = item.theme;
                        data.size = "ax5combobox-option-group-" + item.size;
                        data.multiple = item.multiple;
                        data.lang = item.lang;
                        data.options = item.options;
                        this.activecomboboxOptionGroup.find('[data-els="content"]').html(jQuery(ax5.mustache.render(getOptionsTmpl.call(this, item.columnKeys), data)));
                    }
                }.bind(this));
            };
            return function (boundID, tryCount) {
                this.waitOptionsCallback = null;

                /**
                 * open combobox from the outside
                 */
                var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                var item = this.queue[queIdx];
                var data = {},
                    focusTop,
                    selectedOptionEl;

                if (item.$display.attr("disabled")) return this;

                if (this.openTimer) clearTimeout(this.openTimer);
                if (this.activecomboboxOptionGroup) {
                    if (this.activecomboboxQueueIndex == queIdx) {
                        return this;
                    }

                    if (tryCount > 2) return this;
                    this.close();
                    this.openTimer = setTimeout(function () {
                        this.open(queIdx, (tryCount || 0) + 1);
                    }.bind(this), cfg.animateTime);

                    return this;
                }

                item.optionFocusIndex = -1; // optionGroup이 열리면 포커스 인덱스 초기화 -1로
                if (item.selected && item.selected.length > 0) {
                    item.optionSelectedIndex = item.selected[0]["@findex"];
                }

                /// 템플릿에 전달할 오브젝트 선언
                data.id = item.id;
                data.theme = item.theme;
                data.size = "ax5combobox-option-group-" + item.size;
                data.multiple = item.multiple;

                data.lang = item.lang;
                item.$display.attr("data-combobox-option-group-opened", "true");

                if (item.onExpand) {
                    // onExpand 인 경우 UI 대기모드 추가
                    data.waitOptions = true;
                }
                data.options = item.options;

                this.activecomboboxOptionGroup = jQuery(ax5.mustache.render(getOptionGroupTmpl.call(this, item.columnKeys), data));
                this.activecomboboxOptionGroup.find('[data-els="content"]').html(jQuery(ax5.mustache.render(getOptionsTmpl.call(this, item.columnKeys), data)));
                this.activecomboboxQueueIndex = queIdx;

                alignComboboxOptionGroup.call(this, "append"); // alignComboboxOptionGroup 에서 body append
                jQuery(window).bind("resize.ax5combobox-" + this.instanceId, function () {
                    alignComboboxOptionGroup.call(this);
                }.bind(this));

                if (item.selected && item.selected.length > 0) {
                    selectedOptionEl = this.activecomboboxOptionGroup.find('[data-option-index="' + item.selected[0]["@index"] + '"]');
                    if (selectedOptionEl.get(0)) {
                        focusTop = selectedOptionEl.position().top - this.activecomboboxOptionGroup.height() / 3;
                        this.activecomboboxOptionGroup.find('[data-els="content"]').stop().animate({ scrollTop: focusTop }, item.animateTime, 'swing', function () {});
                    }
                }

                //item.$displayLabel.val('');
                /*
                 setTimeout((function () {
                 focusLabel.call(this, queIdx);
                 }).bind(this), 1);
                 */

                jQuery(window).bind("keyup.ax5combobox-" + this.instanceId, function (e) {
                    e = e || window.event;
                    onBodyKeyup.call(this, e);
                    U.stopEvent(e);
                }.bind(this));

                jQuery(window).bind("click.ax5combobox-" + this.instanceId, function (e) {
                    e = e || window.event;
                    onBodyClick.call(this, e);
                    U.stopEvent(e);
                }.bind(this));

                onStateChanged.call(this, item, {
                    self: this,
                    state: "open",
                    item: item
                });

                // waitOption timer
                if (item.onExpand) {
                    this.waitOptionsCallback = true;
                    onExpand.call(this, item);
                }

                data = null;
                focusTop = null;
                selectedOptionEl = null;
                return this;
            };
        }();

        /**
         * @method ax5combobox.update
         * @param {(Object|String)} item
         * @returns {ax5combobox}
         */
        this.update = function (_item) {
            this.bind(_item);
            return this;
        };

        /**
         * @method ax5combobox.val
         * @param {(String|Number|Element)} boundID
         * @param {(String|Object|Array)} [value]
         * @param {Boolean} [Selected]
         * @returns {ax5combobox}
         */
        this.val = function () {
            var processor = {
                'index': function index(queIdx, value, selected, setValueType) {
                    // 클래스 내부에서 호출된 형태, 그런 이유로 옵션그룹에 대한 상태를 변경 하고 있다.
                    var item = this.queue[queIdx];

                    if (U.isString(value.index.gindex)) {
                        if (typeof item.options[value.index.gindex] !== "undefined") {
                            item.options[value.index.gindex].options[value.index.index][item.columnKeys.optionSelected] = getSelected(item, item.options[value.index.gindex].options[value.index.index][item.columnKeys.optionSelected], selected);
                            self.activecomboboxOptionGroup.find('[data-option-group-index="' + value.index.gindex + '"][data-option-index="' + value.index.index + '"]').attr("data-option-Selected", item.options[value.index.gindex].options[value.index.index][item.columnKeys.optionSelected].toString());
                        }
                    } else {
                        if (typeof item.options[value.index.index] !== "undefined") {
                            item.options[value.index.index][item.columnKeys.optionSelected] = getSelected(item, item.options[value.index.index][item.columnKeys.optionSelected], selected);

                            self.activecomboboxOptionGroup.find('[data-option-index="' + value.index.index + '"]').attr("data-option-Selected", item.options[value.index.index][item.columnKeys.optionSelected].toString());
                        }
                    }

                    if (typeof setValueType === "undefined" || setValueType !== "justSetValue") {
                        syncComboboxOptions.call(this, queIdx, item.options);
                        syncLabel.call(this, queIdx);
                        alignComboboxOptionGroup.call(this);
                        U.selectRange(item.$displayLabel, "end"); // 포커스 end || selectAll
                    }
                },
                'arr': function arr(queIdx, values, selected) {
                    values.forEach(function (value) {
                        if (U.isString(value) || U.isNumber(value)) {
                            processor.value.call(self, queIdx, value, selected, "justSetValue");
                        } else {
                            for (var key in processor) {
                                if (value[key]) {
                                    processor[key].call(self, queIdx, value, selected, "justSetValue");
                                    break;
                                }
                            }
                        }
                    });

                    syncComboboxOptions.call(this, queIdx, this.queue[queIdx].options);
                    syncLabel.call(this, queIdx);
                    alignComboboxOptionGroup.call(this);
                    U.selectRange(this.queue[queIdx].$displayLabel, "end"); // 포커스 end || selectAll
                },
                'value': function value(queIdx, _value, selected, setValueType) {
                    var item = this.queue[queIdx];
                    var addOptions;
                    var optionIndex = U.search(item.options, function () {
                        return this[item.columnKeys.optionValue] == _value;
                    });
                    if (optionIndex > -1) {
                        item.options[optionIndex][item.columnKeys.optionSelected] = getSelected(item, item.options[optionIndex][item.columnKeys.optionSelected], selected);
                    } else {
                        // 새로운 값 추가
                        optionIndex = item.options.length;
                        addOptions = {
                            "@index": optionIndex,
                            hide: true,
                            addedOption: true
                        };
                        addOptions[item.columnKeys.optionValue] = _value;
                        addOptions[item.columnKeys.optionText] = _value;
                        item.options.push(addOptions);
                        item.options[optionIndex][item.columnKeys.optionSelected] = getSelected(item, item.options[optionIndex][item.columnKeys.optionSelected], selected);
                    }
                    if (typeof setValueType === "undefined" || setValueType !== "justSetValue") {
                        syncComboboxOptions.call(this, queIdx, this.queue[queIdx].options);
                        syncLabel.call(this, queIdx);
                        alignComboboxOptionGroup.call(this);
                        U.selectRange(this.queue[queIdx].$displayLabel, "end"); // 포커스 end || selectAll
                    }
                },
                'text': function text(queIdx, value, selected, setValueType) {},
                'clear': function clear(queIdx) {

                    // 임시추가된 options 제거
                    /*
                     this.queue[queIdx].selected = [];
                     this.queue[queIdx].options = U.filter(this.queue[queIdx].options, function () {
                     return !this.addedOption;
                     });
                     */

                    clearSelected.call(this, queIdx);
                    syncComboboxOptions.call(this, queIdx, this.queue[queIdx].options);
                    focusLabel.call(this, queIdx);
                    focusClear.call(this, queIdx);

                    if (this.activecomboboxOptionGroup) {
                        this.activecomboboxOptionGroup.find('[data-option-index]').attr("data-option-Selected", "false");
                    }
                    this.queue[queIdx].optionSelectedIndex = -1;
                }
            };

            return function (boundID, value, selected, internal) {
                var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                if (queIdx === -1) {
                    console.log(ax5.info.getError("ax5combobox", "402", "val"));
                    return;
                }

                if (typeof value == "undefined") {
                    return this.queue[queIdx].selected;
                } else if (U.isArray(value)) {
                    processor.clear.call(this, queIdx);
                    processor.arr.call(this, queIdx, this.queue[queIdx].multiple || value.length == 0 ? value : [value[value.length - 1]], selected);
                } else if (U.isString(value) || U.isNumber(value)) {
                    if (typeof value !== "undefined" && value !== null && !this.queue[queIdx].multiple) {
                        clearSelected.call(this, queIdx);
                    }
                    processor.value.call(this, queIdx, value, selected);
                    syncLabel.call(this, queIdx);
                } else {
                    if (value === null) {
                        processor.clear.call(this, queIdx);
                        syncLabel.call(this, queIdx);
                    } else {
                        if (!this.queue[queIdx].multiple) {
                            clearSelected.call(this, queIdx);
                        }
                        for (var key in processor) {
                            if (value[key]) {
                                processor[key].call(this, queIdx, value, selected);
                                break;
                            }
                        }
                        syncLabel.call(this, queIdx);
                    }
                }

                if (typeof value !== "undefined") {
                    onStateChanged.call(this, this.queue[queIdx], {
                        self: this,
                        item: this.queue[queIdx],
                        state: internal ? "changeValue" : "setValue",
                        value: this.queue[queIdx].selected,
                        internal: internal
                    });
                }

                boundID = null;
                return this;
            };
        }();

        /**
         * @method ax5combobox.close
         * @returns {ax5combobox}
         */
        this.close = function (item) {
            if (this.closeTimer) clearTimeout(this.closeTimer);
            if (!this.activecomboboxOptionGroup) return this;

            item = this.queue[this.activecomboboxQueueIndex];
            item.optionFocusIndex = -1;
            item.$display.removeAttr("data-combobox-option-group-opened").trigger("focus");

            this.activecomboboxOptionGroup.addClass("destroy");

            jQuery(window).unbind("resize.ax5combobox-" + this.instanceId).unbind("click.ax5combobox-" + this.instanceId).unbind("keyup.ax5combobox-" + this.instanceId);

            this.closeTimer = setTimeout(function () {
                if (this.activecomboboxOptionGroup) this.activecomboboxOptionGroup.remove();
                this.activecomboboxOptionGroup = null;
                this.activecomboboxQueueIndex = -1;

                onStateChanged.call(this, item, {
                    self: this,
                    state: "close"
                });
            }.bind(this), cfg.animateTime);
            this.waitOptionsCallback = null;
            return this;
        };

        /**
         * @method ax5combobox.enable
         * @param boundID
         * @returns {ax5combobox}
         */
        this.enable = function (boundID) {
            var queIdx = getQueIdx.call(this, boundID);
            this.queue[queIdx].$display.removeAttr("disabled");
            this.queue[queIdx].$input.removeAttr("disabled");

            onStateChanged.call(this, this.queue[queIdx], {
                self: this,
                state: "enable"
            });

            return this;
        };

        /**
         * @method ax5combobox.disable
         * @param boundID
         * @returns {ax5combobox}
         */
        this.disable = function (boundID) {
            var queIdx = getQueIdx.call(this, boundID);
            this.queue[queIdx].$display.attr("disabled", "disabled");
            this.queue[queIdx].$input.attr("disabled", "disabled");

            onStateChanged.call(this, this.queue[queIdx], {
                self: this,
                state: "disable"
            });

            return this;
        };

        // 클래스 생성자
        this.main = function () {
            if (arguments && U.isObject(arguments[0])) {
                this.setConfig(arguments[0]);
            } else {
                this.init();
            }
        }.apply(this, arguments);
    };
    //== UI Class

    root.combobox = function () {
        if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
        return axClass;
    }(); // ax5.ui에 연결
})(ax5.ui, ax5.ui.root);

/**
 * ax5combobox jquery extends
 * @namespace jQueryExtends
 */

/**
 * @method jQueryExtends.ax5combobox
 * @param {String} methodName
 * @example
 * ```js
 * jQuery('[data-ax5combobox="ax1"]').ax5combobox();
 * ```
 */

ax5.ui.combobox_instance = new ax5.ui.combobox();
jQuery.fn.ax5combobox = function () {
    return function (config) {
        if (ax5.util.isString(arguments[0])) {
            var methodName = arguments[0];

            switch (methodName) {
                case "open":
                    return ax5.ui.combobox_instance.open(this);
                    break;
                case "close":
                    return ax5.ui.combobox_instance.close(this);
                    break;
                case "setValue":
                    return ax5.ui.combobox_instance.val(this, arguments[1], arguments[2]);
                    break;
                case "getValue":
                    return ax5.ui.combobox_instance.val(this);
                    break;
                case "enable":
                    return ax5.ui.combobox_instance.enable(this);
                    break;
                case "disable":
                    return ax5.ui.combobox_instance.disable(this);
                    break;
                default:
                    return this;
            }
        } else {
            if (typeof config == "undefined") config = {};
            jQuery.each(this, function () {
                var defaultConfig = {
                    target: this
                };
                config = jQuery.extend({}, config, defaultConfig);
                ax5.ui.combobox_instance.bind(config);
            });
        }
        return this;
    };
}();