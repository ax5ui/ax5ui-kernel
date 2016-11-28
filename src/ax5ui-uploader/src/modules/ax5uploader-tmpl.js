// ax5.ui.uploader.tmpl
(function () {

    var UPLOADER = ax5.ui.uploader;

    var uploadProgress = function(columnKeys) {
        return `
        `;
    };

    UPLOADER.tmpl = {
        "uploadProgress": uploadProgress,

        get: function (tmplName, data, columnKeys) {
            return ax5.mustache.render(TOAST.tmpl[tmplName].call(this, columnKeys), data);
        }
    };

})();