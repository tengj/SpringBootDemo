/* 统一提示语信息 */

(function(factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        factory();
    }
}(function() {

    var data = {
    	"PELEASE_LOGIN":"请重新登录!",
    	"SESSION_OUT":"登录已超时，请重新登录!",
        "EXIT_CONFIRM": "确定退出？",
        "DEFAULT": "数据加载失败",
        "LOADING_ERROR": "数据加载失败",
        "LOADING": "数据加载中...",
        "LOADING_SUCCESS": "数据加载成功",
        "SAVE_SUCCESS" :"保存成功",
        "DELETE_CONFIRM": "确定删除？",
        "DELETE_SUCCESS": "删除成功",
        "DELETE_FAIL": "删除失败",
        "REQUEST_FAIL":"请求失败",
        "ERROR_UPLOAD_FILES_LARGE":"上传文件过大（每张图片最大5M）",
        "ERROR_INVALID_FILES_TYPE":"该文件是不被支持的文件类型!",
    	"PRJECT_NO_CANNOT_BE_NULL":"项目编号不能为空",
		"PROJECT_CANNOT_CHANGE":"当前项目状态已更改不能变更，请重新检索！",
		"PROJECT_CHANGE_FAILED":"项目变更提交失败，请重试",
		"PROJECT_CANNOT_ADD_RECORD":"该项目处于不可添加记录状态！",
		"MSG_PROJECT_CANNOT_APPLY":"该项目不可以申请！",
		"MSG_PROJECT_CANNOT_DELETE":"该项目不可以删除！",
		"MSG_PROJECT_CANNOT_APPROVAL":"该项目不可以审核！",
		"MSG_PROJECT_CANNOT_PLAYBACK":"该项目不可以被打回！",
		"MSG_PROJECT_CANNOT_BEGAN":"该项目不可以被实施！",
		"MSG_NOT_EXIST_PROJECT":"该项目不存在！",
		"OPERATE_SUCCESS":"操作成功！",
		"OPERATE_FAIL":"操作失败！",
		"PLEASE_WAIT":"正在处理，请稍后...",
		"CAN_NOT_GREAT_PRE_AMOUNT":"项目分摊预算金额不能大于预算金额！",
		"MSG_EMPTY_ADD_RECORD":"添加的记录信息为空！",
		"MSG_EMPTY_VISIT_TIME":"走访时间不能为空！",
		"MSG_BEYOND_BENEFIT_NUM":"添加的受益对象总数超过该项目受益对象上限！",
		"MSG_FAIL_ADD_RECORD":"添加记录失败！",
		"MSG_FAIL_ACCEPTANCE_FINISH":"该项目尚未实施完成或已结项！",
		"MSG_PROJECT_ALREADY_PAYMENT_FINISH":"该项目已经支付完成！",
		"MSG_CAN_NOT_PAYMENT":"该项目处于不可支付状态！",
		"MSG_PROJECT_COUNT_MAX_TODAY":"今日可新增项目数量已达最大值!",
		"MSG_PLEASE_ADD_RECORD":"请至少添加一条记录！",
		"MSG_POVERTY_CAUSE_ERROR_INFO":"致贫原因加载失败！",
		"MSG_POOR_PROPERTIES_ERROR_INFO":"贫困属性统计失败！",
		"MSG_POVERTY_SITUATION_ERROR_INFO":"脱贫情况统计失败！",
		"MSG_QUERY_COUNTRY_LIST_FAIL":"贫困县脱贫成效排名查询失败!",

        "SYS_ERROR": "系统出错"
    };

    var message = {
        get: function(key) {
            if (!key) {
                return data['DEFAULT'];
            }
            var keys = key.split(','),
                msg = [];
            for (var i = 0, l = keys.length; i < l; i++) {
                if (data[keys[i]]) {
                    msg.push(data[keys[i]]);
                }
            }

            if (msg.length == 0) {
            	if (key){
            		return key;
            	} else {
            		return data['DEFAULT'];
            	}
            }
            return msg.join('<br/>');
        }
    };

    window.message = message;
    return message;
}));
