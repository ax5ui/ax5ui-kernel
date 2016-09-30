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

    <style>
        body > .container {
            padding: 60px 15px 0;
        }

        .footer {
            margin-top: 60px;
            bottom: 0;
            width: 100%;
            height: 60px;
            background-color: #f5f5f5;
        }
    </style>

    <script src="<?=$bower_url?>/jquery/dist/jquery.min.js"></script>
    <script src="<?=$bower_url?>/ax5core/dist/ax5core.js"></script>
    <script src="<?=$ax5_url?>/ax5grid.js"></script>
</head>
<body style="padding: 20px;">

<!-- Fixed navbar -->
<nav class="navbar navbar-default navbar-fixed-top">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">Project name</a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <li class="active"><a href="#">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div><!--/.nav-collapse -->
    </div>
</nav>

<div class="container">
    <div class="page-header">
        <h1>Sticky footer with fixed navbar</h1>
    </div>

    <div style="position: relative; height:400px;" id="grid-parent">
        <div data-ax5grid="first-grid" data-ax5grid-config='{showLineNumber: true, showRowSelector: true}' style="height: 100%;"></div>
    </div>
</div>

<footer class="footer">
    <div class="container">
        <p class="text-muted">Place sticky footer content here.</p>
    </div>
</footer>

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
                sortable: true,
                multiSort: true,
                remoteSort: function () {
                    gridView.sortInfo = this.sortInfo;
                    gridView.setData();
                },
                header: {
                    align: "center",
                    columnHeight: 28,
                    onClick: function(item) {
                        console.log(item);
                        console.log(this.columns);
                    }
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
                            {key: "cost", label: "금액", formatter: "money", align: "right"}
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
                        gridView.pageNo = this.page.selectPage;
                        gridView.setData();
                    }
                }
            });
            return this;
        },
        pageNo: 0,
        sortInfo: {},
        len: 20,
        setData: function () {
            var page = (gridView.pageNo || 0) + 1;
            $.post('json_data.php',
                {
                    len: gridView.len,
                    page: page,
                    sort: gridView.sortInfo,
                    mode: 'read'
                }, function(data) {
                if(data.status == 'success') {
                    firstGrid.setData(data.data);
                }}, 'JSON'
            );

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