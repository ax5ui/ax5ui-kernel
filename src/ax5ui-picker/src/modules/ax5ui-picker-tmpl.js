// ax5.ui.picker.tmpl
(function () {
    var PICKER = ax5.ui.picker;
    var U = ax5.util;

    var pickerTmpl = function () {
        return `
<div class="ax5-ui-picker {{theme}}" id="{{id}}" data-picker-els="root">
    {{#title}}
        <div class="ax-picker-heading">{{title}}</div>
    {{/title}}
    <div class="ax-picker-body">
        <div class="ax-picker-content" data-picker-els="content" style="width:{{contentWidth}}px;"></div>
        {{#btns}}
            <div class="ax-picker-buttons">
            {{#btns}}
                {{#@each}}
                <button data-picker-btn="{{@key}}" class="btn btn-default {{@value.theme}}">{{@value.label}}</button>
                {{/@each}}
            {{/btns}}
            </div>
        {{/btns}}
    </div>
    <div class="ax-picker-arrow"></div>
</div>
`;
    };

    PICKER.tmpl = {
        "pickerTmpl": pickerTmpl,

        get: function (tmplName, data, columnKeys) {
            return ax5.mustache.render(PICKER.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();