// ax5.ui.calendar.tmpl
(function () {

    const PALETTE = ax5.ui.palette;

    const tmpl_frame = function (columnKeys) {
        return `
<div data-ax5palette-container="root">
    <div data-ax5palette-container="colors"></div>
    <div data-ax5palette-container="controls"></div>
</div>
`;
    };

    const tmpl_colors = function (columnKeys) {
        return `
{{#colors.list}}
<div data-ax5palette-color="{{label}}">
    <div data-panel="color-preview" style="padding:{{colors.preview.cellPadding}}px;width:{{colors.preview.cellWidth}}px;">
        <div data-panel="color-box" style="width:{{colors.preview.width}}px;height:{{colors.preview.height}}px;"><div data-panel="color" style="background-color:{{value}};"></div></div>
    </div>
    <div data-panel="color-label" style="width:{{colors.label.width}}px;">{{label}}</div>
    <div data-panel="color-slider">
        <div data-panel="color-track" style="height:{{colors.slider.trackHeight}}px;background: linear-gradient(-90deg, red, orange); ">
            <div data-panel="color-handle" data-color-lighten="0">
                
            </div>
        </div>
    </div>
</div>
{{/colors.list}}
`;
    };


    PALETTE.tmpl = {
        "frame": tmpl_frame,
        "colors": tmpl_colors,

        get: function (tmplName, data, columnKeys) {
            return ax5.mustache.render(PALETTE.tmpl[tmplName].call(this, columnKeys), data);
        }
    };

})();