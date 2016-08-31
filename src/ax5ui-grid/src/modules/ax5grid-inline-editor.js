// ax5.ui.grid.inlineEditor
(function () {

    var GRID = ax5.ui.grid;


    var edit_text = {
        editMode: "popup",
        getHtml: function (_root, _editor) {
            return '<input type="text" data-ax5grid-editor="text" value="" >';
        },
        init: function (_root, _editor, _$parent) {
            var $el;
            _$parent.append($el = jQuery(this.getHtml(_root, _editor)));
            this.bindUI(_root, $el, _editor, _$parent);
            return $el;
        },
        bindUI: function(_root, _$el, _editor, _$parent){

        }
    };
    var edit_money = {
        editMode: "popup",
        getHtml: function (_root, _editor) {
            return '<input type="text" data-ax5grid-editor="money" value="" >';
        },
        init: function (_root, _editor, _$parent) {
            var $el;
            _$parent.append($el = jQuery(this.getHtml(_root, _editor)));
            this.bindUI(_root, $el, _editor, _$parent);
            return $el;
        },
        bindUI: function(_root, _$el, _editor, _$parent){
            _$el.data("binded-ax5ui", "ax5formater");
            _$el.ax5formatter({
                pattern: "money"
            });
        }
    };
    var edit_number = {
        editMode: "popup",
        getHtml: function (_root, _editor) {
            return '<input type="text" data-ax5grid-editor="number" value="" >';
        },
        init: function (_root, _editor, _$parent) {
            var $el;
            _$parent.append($el = jQuery(this.getHtml(_root, _editor)));
            this.bindUI(_root, $el, _editor, _$parent);
            return $el;
        },
        bindUI: function(_root, _$el, _editor, _$parent){
            _$el.data("binded-ax5ui", "ax5formater");
            _$el.ax5formatter({
                pattern: "number"
            });
        }
    };
    var edit_date = {
        editMode: "popup",
        getHtml: function (_root, _editor) {
            return '<input type="text" data-ax5grid-editor="calendar" value="" >';
        },
        init: function (_root, _editor, _$parent) {
            var $el;
            _$parent.append($el = jQuery(this.getHtml(_root, _editor)));
            this.bindUI(_root, $el, _editor, _$parent);
            return $el;
        },
        bindUI: function(_root, _$el, _editor, _$parent){
            var self = _root;
            _$el.data("binded-ax5ui", "ax5picker");
            _$el.ax5picker({
                direction: "auto",
                content: {
                    type: 'date',
                    formatter: {
                        pattern: 'date'
                    }
                },
                onStateChanged: function () {
                    if (this.state == "close") {
                        GRID.body.inlineEdit.deActive.call(self, "RETURN");
                    }
                }
            });
        }
    };
    var edit_select = {
        editMode: "popup",
        getHtml: function (_root, _editor) {
            var eConfig = {
                columnKeys: {
                    optionValue: "value", optionText: "text"
                }
            };
            jQuery.extend(true, eConfig, _editor.config);

            var po = [];
            po.push('<select data-ax5grid-editor="select">');
            for (var oi = 0, ol = eConfig.options.length; oi < ol; oi++) {
                po.push('<option value="' + eConfig.options[oi][eConfig.columnKeys.optionValue] + '">',
                    eConfig.options[oi][eConfig.columnKeys.optionText],
                    '</option>');
            }
            po.push('</select>');
            return po.join('');
        },
        init: function (_root, _editor, _$parent) {
            var $el;
            _$parent.append($el = jQuery(this.getHtml(_root, _editor)));
            this.bindUI(_root, $el, _editor, _$parent);
            return $el;
        },
        bindUI: function(_root, _$el, _editor, _$parent){

            /*
            _$el.on("change", function(){
               console.log(this.value);
            });
            */
        }
    };
    var edit_checkbox = {
        editMode: "inline",
        getHtml: function (_root, _editor, _value) {
            var lineHeight = (_root.config.body.columnHeight - _root.config.body.columnPadding * 2 - _root.config.body.columnBorderWidth);
            var checked = (_value == false || _value == "false" || _value < "1") ? "false" : "true";
            var eConfig = {
                marginTop: 2,
                height: lineHeight - 4
            };
            jQuery.extend(true, eConfig, _editor.config);
            eConfig.marginTop = (lineHeight - eConfig.height) / 2;

            return '<div data-ax5grid-editor="checkbox" data-ax5grid-checked="' + checked + '" style="height:' + eConfig.height + 'px;width:' + eConfig.height + 'px;margin-top:' + eConfig.marginTop + 'px;"></div>';
        }
    };

    GRID.inlineEditor = {
        "text": edit_text,
        "money": edit_money,
        "number": edit_number,
        "date": edit_date,
        "select": edit_select,
        "checkbox": edit_checkbox
    };

})();