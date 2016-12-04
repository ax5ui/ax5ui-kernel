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

    let progressBox = function (columnKeys) {
        return `
<div data-ax5uploader-progressbox="{{instanceId}}" class="{{theme}}">
    <div class="ax-progressbox-body">
        <div class="ax-pregressbox-content">
            <div class="progress">
              <div class="progress-bar progress-bar-striped active" role="progressbar" style="width: 0">
                <span class="sr-only">0% Complete</span>
              </div>
            </div>
        </div>
        {{#btns}}
            <div class="ax-progressbox-buttons">
            {{#btns}}
                {{#@each}}
                <button data-pregressbox-btn="{{@key}}" class="btn btn-default {{@value.theme}}">{{@value.label}}</button>
                {{/@each}}
            {{/btns}}
            </div>
        {{/btns}}
    </div>
    <div class="ax-progressbox-arrow"></div>
</div>
`;
    };

    UPLOADER.tmpl = {
        "uploadProgress": uploadProgress,
        "inputFile": inputFile,
        "inputFileForm": inputFileForm,
        "progressBox": progressBox,

        get: function (tmplName, data, columnKeys) {
            return ax5.mustache.render(UPLOADER.tmpl[tmplName].call(this, columnKeys), data);
        }
    };

})();