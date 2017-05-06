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
{{#colors}}
<div data-ax5palette-color="{{label}}">
    <div data-panel="color-preview" style="background:{{value}};"></div>
    <div data-panel="color-label">{{label}}</div>
    <div data-panel="color-slider">
        <div data-panel="color-track">
            <div data-panel="color-handle"></div>
        </div>
    </div>
</div>
{{/colors}}
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