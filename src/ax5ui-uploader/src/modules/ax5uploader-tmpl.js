// ax5.ui.uploader.tmpl
(function () {

    let UPLOADER = ax5.ui.uploader;

    let uploadProgress = function(columnKeys) {
        return `
        `;
    };

    let inputFile = function (columnKeys) {
        return `<input type="file" data-ax5uploader-input="{{instanceId}}" {{#multiple}}multiple{{/multiple}} accept="{{accept}}" />`;
    };

    let inputFileForm = function (columnKeys) {
        return `<form data-ax5uploader-form="{{instanceId}}" method="post" enctype="multipart/form-data"></form>`;
    };

    UPLOADER.tmpl = {
        "uploadProgress": uploadProgress,
        "inputFile": inputFile,
        "inputFileForm": inputFileForm,

        get: function (tmplName, data, columnKeys) {
            return ax5.mustache.render(UPLOADER.tmpl[tmplName].call(this, columnKeys), data);
        }
    };

})();