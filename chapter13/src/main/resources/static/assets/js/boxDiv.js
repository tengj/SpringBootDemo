(function($) {
	var idName;
	$.fn.box = function() {
		var method = arguments[0];
		if (methods[method]) {
			method = methods[method];
			arguments = Array.prototype.slice.call(arguments, 1);
		} else if (typeof (method) == "object" || !method) {
			method = methods.init;
		} else {
			$.error("Method" + method + "does not exist on jQuery.dialog");
			return this;
		}
		return method.apply(this, arguments);
	};
	/**
	 * 参数
	 */
	var params={
			title : '您有新的提示消息',
			display:'none',
			height:"200px",
			width:"300px",
			message:[]
	}
	var methods = {
		/**
		 * 初始化
		 */
		init : function(options) {
			var settings = $.extend({}, params, options);
			var MsgPop = $(this)[0];// 获取窗口这个对象,即ID为winpop的对象
			var MsgTitle=$("#"+MsgPop.id +" .title")[0];
			MsgPop.style.display = settings['display'];// 那么将隐藏的窗口显示出来
			$("#"+MsgPop.id +" .title .title").html(settings['title']);
			if(settings["message"].length>0){
				$("#"+MsgPop.id +" .con").append("<ul>");
				for (var int = 0; int < settings["message"].length; int++) {
					$("#"+MsgPop.id +" .con ul").append("<li>"+settings["message"][int]["title"]+"</li>");
				}
				$("#"+MsgPop.id +" .con").append("</ul>");
			}
			$("#"+MsgPop.id).animate({
			      height:settings['height'],
			      width:settings['width']
			});
			params=settings;
		},
		open : function() {//打开窗口
				var MsgPop = $(this)[0];// 获取窗口这个对象,即ID为winpop的对象
				MsgPop.style.display = "block";// 那么将隐藏的窗口显示出来
					$("#"+MsgPop.id).animate({
						 height:params['height'],
					      width:params['width']
					});
		},
		close : function() {//关闭窗口
			var MsgPop = $(this)[0];// 获取窗口这个对象,即ID为winpop的对象
			$("#"+MsgPop.id).animate({
			      height:'0px',
			});
			setTimeout(function(){
				MsgPop.style.display = "none";// 将窗口隐藏
			},800)
			
		},
	}

})(jQuery);
