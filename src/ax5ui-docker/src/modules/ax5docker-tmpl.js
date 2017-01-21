// ax5.ui.docker.tmpl
(function () {

    let DOCKER = ax5.ui.docker;

    let panels = function (columnKeys) {
        return ` 
        
        `;
    };

    DOCKER.tmpl = {
        "panels": panels,
        get: function (tmplName, data, columnKeys) {
            return ax5.mustache.render(DOCKER.tmpl[tmplName].call(this, columnKeys), data);
        }
    };

})();