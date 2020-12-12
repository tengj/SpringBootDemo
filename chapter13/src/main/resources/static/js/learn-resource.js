var loading;
$(function(){
    $(window).resize(function(){
        $("#jqGrid").setGridWidth($(window).width()*0.95);
    });
    console.info(baseURL+"/learn/queryLeanList");
    $("#jqGrid").jqGrid({
        url:baseURL+"learn/queryLeanList",
        datatype: "json",
        mtype: 'POST',
        height:window.screen.height-550,
        colModel: [
            { label: 'id', name: 'id', width: 75,hidden:true},
            { label: '作者', name: 'author', width: 200 },
            { label: '教程名称', name: 'title', width: 200 },
            { label: '地址', name: 'url', width: 200 ,hidden:true},
            { label: '地址', name: 'opt', width: 200,formatter: function(cellvalue, options, cell){
                return '<a  href="'+cell.url+'" class="btn btn-purple btn-sm" target="_blank"><i class="fa fa-cog  fa-spin" aria-hidden="true"></i>点我</a>';
            }}
        ],
        pager: "#jqGridPager",
        rowNum:10,
        rowList:[10,30,45], //可调整每页显示的记录数
        viewrecords: true,//是否显示行数
        altRows: true,  //设置表格 zebra-striped 值
        gridview: true, //加速显示
        multiselect: true,//是否支持多选
        multiselectWidth: 40, //设置多选列宽度
        multiboxonly: true,
        shrinkToFit:true, //此属性用来说明当初始化列宽度时候的计算类型，如果为ture，则按比例初始化列宽度。如果为false，则列宽度使用colModel指定的宽度
        forceFit:true, //当为ture时，调整列宽度不会改变表格的宽度。当shrinkToFit为false时，此属性会被忽略
        autowidth: true,
        loadComplete : function() {
            var table = this;
            setTimeout(function(){
                updatePagerIcons(table);
            }, 0);
        },
        gridComplete:function(){
            //隐藏grid底部滚动条
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" });
        },

        //jsonReader来跟服务器端返回的数据做对应
        jsonReader : {
            root: "page.list", //包含实际数据的数组
            page: "page.pageNum", //当前页
            total: "page.pages", //总页数
            records: "page.total", //查询出的总记录数
            repeatitems : false //指明每行的数据是可以重复的，如果设为false，则会从返回的数据中按名字来搜索元素，这个名字就是colModel中的名字
        },
    emptyrecords: '没有记录!',
        loadtext: '正在查询服务器数据...'
    });

});

var vm = new Vue({
    el:'#app',
    data:{
        title: null,
        qryAuthor: null,
        qryTitle: null,
        learn: {}
    },
    methods: {
        query: function () {
            vm.reload();
        },
        add:function(){
            vm.title="新增教程";
            vm.learn={},
            $("#addModal").modal({
                keyboard : false,
                show : true,
                backdrop : "static"
            });
        },
        update:function(){
            var rows=$("#jqGrid").getGridParam('selarrrow');
            if(rows==0){
                // $.messager.alert("温馨提示","请选择一行记录！");
                layer.msg('请选择一行记录！', {icon: 7,time: 2000}); //2秒关闭（如果不配置，默认是3秒）
                return;
            }else if(rows.length>1){
                // $.messager.alert("温馨提示","不能同时修改多条记录！");
                layer.msg('不能同时修改多条记录！', {icon: 7,time: 2000}); //2秒关闭（如果不配置，默认是3秒）
                return;
            }else{
                vm.title="修改教程";
                vm.learn = $("#jqGrid").jqGrid('getRowData', rows[0]);
                $("#addModal").modal({
                    keyboard : false,
                    show : true,
                    backdrop : "static"
                });
            }
        },
        saveOrUpdate:function(){
            if(!$(".form-horizontal").valid()){
                return false;
            }
            var url = vm.learn.id == null ? "learn/add" : "learn/update";
            $.ajax({
                type: "POST",
                url: baseURL+url,
                contentType: "application/json",
                dataType:"json",
                data: JSON.stringify(vm.learn),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(){
                            $("#addModal").modal('hide');
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                },
                error: function (data) {
                    console.info("error: " + data.responseText);
                }
            });
        },
        del: function () {
            var ids=$("#jqGrid").getGridParam('selarrrow');
            if(ids.length>0){
                $.messager.confirm("温馨提示", "是否确定删除所选记录？", function() {
                    $.ajax({
                        type:"post",
                        url:baseURL+"learn/delete",
                        cache: false,
                        contentType: "application/json",
                        data: JSON.stringify(ids),
                        beforeSend : function(){
                            loading=layer.load("正在删除中...");
                        },
                        success:function(r){
                            if(r.code == 0){
                                alert('操作成功', function(){
                                    vm.reload();
                                });
                            }else{
                                alert(r.msg);
                            }
                        },error:function(){
                            $.messager.alert("温馨提示","请求错误!");
                        },
                        complete : function(){
                            layer.close(loading);
                        }
                    });
                });
            }else{
                //两种风格的提示,layer或者messager自己选择一种用即可。
                // $.messager.alert("温馨提示","至少选择一行记录！");
                layer.msg('至少选中一行记录！', {icon: 7,time: 2000}); //2秒关闭（如果不配置，默认是3秒）
            }
        },
        cancel: function(){
            $("#addModal").modal('hide');
        },
        reload: function () {
            var page = $("#jqGrid").jqGrid('getGridParam','page');
            $("#jqGrid").jqGrid('setGridParam',{
                postData:{'condition':{author:vm.qryAuthor,title:vm.qryTitle}},
                page:page
            }).trigger("reloadGrid");
        }
    }
});