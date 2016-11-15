/*
 * Copyright (c) 2016. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

// ax5.ui.grid.excel
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var base64 = function (s) {
        return window.btoa(unescape(encodeURIComponent(s)));
    };
    var uri = "data:application/vnd.ms-excel;base64,";

    var getExcelTmpl = function () {
        return `\ufeff<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">
<head>
<!--[if gte mso 9]>
<xml>
    <x:ExcelWorkbook>
        <x:ExcelWorksheets>
            {{#worksheet}}
            <x:ExcelWorksheet>
                <x:Name>{{name}}</x:Name>
                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
            </x:ExcelWorksheet>
            {{/worksheet}}
        </x:ExcelWorksheets>
    </x:ExcelWorkbook>
</xml>
<![endif]-->
</head>
<body>
{{#tables}}{{{body}}}{{/tables}}
</body>
</html>
`;
    };

    var tableToExcel = function (table, fileName) {
        var link, a, output;
        var tables = [].concat(table);

        output = ax5.mustache.render(getExcelTmpl(), {
            worksheet: (function () {
                var arr = [];
                tables.forEach(function (t, ti) {
                    arr.push({name: "Sheet" + (ti + 1)});
                });
                return arr;
            })(),
            tables: (function () {
                var arr = [];
                tables.forEach(function (t, ti) {
                    arr.push({body: t});
                });
                return arr;
            })()
        });

        var isChrome = navigator.userAgent.indexOf("Chrome") > -1;
        var isSafari = !isChrome && navigator.userAgent.indexOf("Safari") > -1;
        
        var isIE = /*@cc_on!@*/false || !!document.documentMode; // this works with IE10 and IE11 both :)
        if (isIE) {
            if (typeof Blob !== "undefined") {
                //use blobs if we can
                //convert to array
                var blob1 = new Blob([output], {type: "text/html"});
                window.navigator.msSaveBlob(blob1, fileName);
            } else {
                //otherwise use the iframe and save
                //requires a blank iframe on page called txtArea1
                var $iframe = jQuery('<iframe id="' + this.id + '-excel-export" style="display:none"></iframe>');
                jQuery(document.body).append($iframe);
                var iframe = window[this.id + '-excel-export'];
                iframe.document.open("text/html", "replace");
                iframe.document.write(output);
                iframe.document.close();
                iframe.focus();
                iframe.document.execCommand("SaveAs", true, fileName);
                $iframe.remove();
            }
        }
        else if(isSafari){
            // 사파리는 지원이 안되므로 그냥 테이블을 클립보드에 복사처리
            //tables
            var blankWindow = window.open('about:blank', this.id + '-excel-export', 'width=600,height=400');
            blankWindow.document.write(output);
            blankWindow = null;
        }
        else {
            link = uri + base64(output);
            a = document.createElement("a");
            a.download = fileName;
            a.href = link;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

        return true;
    };

    GRID.excel = {
        export: tableToExcel
    };
})();