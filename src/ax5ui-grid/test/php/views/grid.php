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
                header: {
                    align: "center",
                    columnHeight: 28
                },
                body: {
                    align: "center",
                    columnHeight: 28,
                    onClick: function () {
                        console.log(this);
                        // this.self.select(this.dindex);
                    },
                },
                columns: [
                    {key: "id", label: "ID", align: "center"},
                    {
                        key: "company",
                        label: "회사",
                        width: 80,
                        enableFilter: true,
                        align: "center",
                        editor: {type:"text"}
                    },
                    {key: "ceo", label: "대표이사", align: "center"},
                    {
                        key: undefined,
                        label: "주문내역",
                        columns: [
                            {key: "price", label: "단가", formatter: "money", align: "right"},
                            {key: "amount", label: "수량", formatter: "money", align: "right"},
                            {key: "cost", label: "금액", align: "right", formatter: "money"}
                        ]
                    },
                    {key: "sale_date", label: "판매일자", align: "center"},
                    {key: "customer", label: "고객명"},
                    {key: "sale_type", label: "판매타입"}
                ],
                page: {
                    navigationItemCount: 9,
                    height: 30,
                    display: true,
                    firstIcon: '<i class="fa fa-step-backward" aria-hidden="true"></i>',
                    prevIcon: '<i class="fa fa-caret-left" aria-hidden="true"></i>',
                    nextIcon: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                    lastIcon: '<i class="fa fa-step-forward" aria-hidden="true"></i>',
                    onChange: function () {
                        console.log(this);
                        gridView.setData(this.page.selectPage);
                    }
                }
            });
            return this;
        },
        setData: function (_pageNo) {
            var page = (_pageNo || 0) + 1;
            $.get('json_data.php?len=10&page=' + page, function(data) {
                if(data.status == 'success') {
                    firstGrid.setData(data.data);
                }
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

    });
    //694470860800
</script>

</body>
</html>