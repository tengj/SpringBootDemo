//这个是分页图标，必须添加
function updatePagerIcons(table) {
    var replacement =
        {
            'ui-icon-seek-first' : 'icon-double-angle-left bigger-140',
            'ui-icon-seek-prev' : 'icon-angle-left bigger-140',
            'ui-icon-seek-next' : 'icon-angle-right bigger-140',
            'ui-icon-seek-end' : 'icon-double-angle-right bigger-140'
        };
    $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function(){
        var icon = $(this);
        var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
        if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
    });
}


//重写alert
window.alert = function(msg, callback){
    parent.layer.alert(msg, function(index){
        parent.layer.close(index);
        if(typeof(callback) === "function"){
            callback("ok");
        }
    });
}

//重写confirm式样框
window.confirm = function(msg, callback){
    parent.layer.confirm(msg, {btn: ['确定','取消']},
        function(){//确定事件
            if(typeof(callback) === "function"){
                callback("ok");
            }
        });
}