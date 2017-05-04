// ax5.ui.calendar.tmpl
(function () {

    const PALETTE = ax5.ui.palette;

    let bodyTmpl = function (columnKeys) {
        return `

                `;
    };


    PALETTE.tmpl = {
        "bodyTmpl": bodyTmpl,

        get: function (tmplName, data, columnKeys) {
            return ax5.mustache.render(PALETTE.tmpl[tmplName].call(this, columnKeys), data);
        }
    };

})();