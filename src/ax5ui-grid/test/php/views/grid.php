<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, user-scalable=no">

    <title>GRID</title>

    <link rel="stylesheet" type="text/css" href="<?=$bower_url?>/bootstrap/dist/css/bootstrap.min.css"/>
    <link rel="stylesheet" type="text/css" href="<?=$bower_url?>/ax5ui-mask/dist/ax5mask.css"/>
    <link rel="stylesheet" type="text/css" href="<?=$bower_url?>/ax5ui-calendar/dist/ax5calendar.css"/>
    <link rel="stylesheet" href="<?=$bower_url?>/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="<?=$ax5_url?>/ax5grid.css"/>

    <script src="<?=$bower_url?>/jquery/dist/jquery.min.js"></script>
    <script src="<?=$bower_url?>/ax5core/dist/ax5core.js"></script>
    <script src="<?=$ax5_url?>/ax5grid.js"></script>
</head>
<body style="padding: 20px;">

<div style="position: relative;height:400px;" id="grid-parent">
    <div data-ax5grid="first-grid" data-ax5grid-config='{showLineNumber: true, showRowSelector: true}' style="height: 100%;"></div>
</div>

<div style="padding: 5px;">
    <h3>height</h3>
    <button class="btn btn-default" data-set-height="300">300px</button>
    <button class="btn btn-default" data-set-height="400">400px</button>
    <button class="btn btn-default" data-set-height="800">800px</button>
    <button class="btn btn-default" data-set-height="100%">100%</button>
</div>
<div style="padding: 5px;">
    <h3>row</h3>
    <button class="btn btn-default" data-grid-control="row-add">add</button>
    <button class="btn btn-default" data-grid-control="row-remove">remove</button>
    <button class="btn btn-default" data-grid-control="row-update">update</button>
</div>
<div style="padding: 5px;">
    <h3>column</h3>
    <button class="btn btn-default" data-grid-control="column-add">add</button>
    <button class="btn btn-default" data-grid-control="column-remove">remove</button>
    <button class="btn btn-default" data-grid-control="column-update">update</button>
</div>
<div style="padding: 5px;">
    <h3>etc.</h3>
    <button class="btn btn-default" data-grid-control="width-resize">width resize</button>
    <button class="btn btn-default" data-grid-control="delete-all">delete all</button>
</div>

<script>


    var firstGrid = new ax5.ui.grid();

    ax5.ui.grid.formatter["myType"] = function () {
        return "myType" + (this.value || "");
    };
    ax5.ui.grid.formatter["capital"] = function(){
        return (''+this.value).toUpperCase();
    };

    ax5.ui.grid.collector["myType"] = function () {
        return "myType" + (this.value || "");
    };

    var gridView = {
        initView: function () {
            firstGrid.setConfig({
                target: $('[data-ax5grid="first-grid"]'),
                columns: [
                    {
                        key: "companyJson['대표자명']",
                        label: "필드A",
                        width: 80,
                        styleClass: function () {
                            return "ABC";
                        },
                        enableFilter: true,
                        align: "center",
                        editor: {type:"text"}
                    },
                    {key: "b", label: "필드B", align: "center"},
                    {
                        key: undefined, label: "필드C", columns: [
                        {key: "price", label: "단가", formatter: "money", align: "right"},
                        {key: "amount", label: "수량", formatter: "money", align: "right"},
                        {key: "cost", label: "금액", align: "right", formatter: "money"}
                    ]
                    },
                    {key: "saleDt", label: "판매일자", align: "center"},
                    {key: "customer", label: "고객명"},
                    {key: "saleType", label: "판매타입"}
                ]
            });
            return this;
        },
        setData: function (_pageNo) {
            /*
             firstGrid.setData({
             list: sampleData,
             page: {
             currentPage: _pageNo || 0,
             pageSize: 50,
             totalElements: 500,
             totalPages: 100
             }
             });
             */
            $.get('json_data.php?len=10', function(data) {
                firstGrid.setData(data);
            }, 'JSON');

            return this;
        }
    };

    $(document.body).ready(function () {

        gridView
            .initView()
            .setData();

        $('[data-set-height]').click(function () {
            var height = this.getAttribute("data-set-height");
            if (height == "100%") {
                $("#grid-parent").css({height: 500});
            } else {
                $("#grid-parent").css({height: "auto"});
            }
            firstGrid.setHeight(height);
        });

        $('[data-grid-control]').click(function () {
            switch (this.getAttribute("data-grid-control")) {
                case "row-add":
                    $.get('json_data.php?len=1', function(data) {
                        firstGrid.addRow(data);
                    }, 'JSON');
                    break;
                case "row-remove":
                    firstGrid.removeRow();
                    break;
                case "row-update":
                    firstGrid.updateRow($.extend({}, firstGrid.list[1], {price: 100, amount: 100, cost: 10000}), 1);
                    break;
                case "column-add":
                    firstGrid.addColumn({key: "b", label: "필드B"});
                    break;
                case "column-remove":
                    firstGrid.removeColumn();
                    break;
                case "column-update":
                    firstGrid.updateColumn({key: "b", label: "필드B"}, 0);
                    break;
                case "width-resize":

                    $("#grid-parent").css({width: 400});
                    ax5.ui.grid_instance.forEach(function (g) {
                        g.align();
                    });

                    break;
            }
        });

    });
    //694470860800
</script>

</body>
</html>