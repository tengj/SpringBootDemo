/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var addTabs = function (obj) {
    id = "tab_" + obj.id;
    var mainHeight=$(document).height()-120;
    $(".active").removeClass("active");
    //如果TAB不存在，创建一个新的TAB
    if (!$("#" + id)[0]) {
        //创建新TAB的title
        title = '<li role="presentation" id="tab_' + id + '" style="margin-right: 4px;"><a href="#' + id + '" aria-controls="' + id + '" role="tab" data-toggle="tab">' + obj.title+'&nbsp;</a>';
        //是否允许关闭
        if (obj.close) {
            title += ' <i class="close-tab icon-remove"></i>';
        }
        title += '</li>';
        //是否指定TAB内容
        if (obj.content) {
            content = '<div role="tabpanel" class="tab-pane" id="' + id + '">' + obj.content + '</div>';
        } else {//没有内容，使用IFRAME打开链接
            content = '<div role="tabpanel" class="tab-pane" id="' + id + '"><iframe id="iframe_'+id+'"  class="mainFrame" src="' + obj.url + '" scrolling="no" frameborder="0" width="100%" height="'+mainHeight+'" style="border: 0;"></iframe></div>';
        }
        //加入TABS
        $(".nav-tabs").append(title);
        $(".tab-content").append(content);
        $("#iframe_"+id).load(function(){
    		var mainheight = $(this).contents().find("body").height();
    		if(mainheight<400){
    			mainheight = 400;
    		}
    		$(this).height(mainheight);
    	});
    }
     
    //激活TAB
    $("#tab_" + id).addClass('active');
    $("#" + id).addClass("active");
};

var closeTab = function (id) {
    //如果关闭的是当前激活的TAB，激活他的前一个TAB
    if ($("li.active").attr('id') == "tab_" + id) {
        $("#tab_" + id).prev().addClass('active');
        $("#" + id).prev().addClass('active');
    }
    //关闭TAB
    $("#tab_" + id).remove();
    $("#" + id).remove();
};

