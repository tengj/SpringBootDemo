(function(factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        factory();
    }
}(function() {
    var common = {};
    //用户登录超时时操作
    (common.globalAjaxSetup = function() {
        var win = window.top || window;
        var appUrl = encodeURIComponent(win.location.href);
        var loginUrlRes = '&service=' + (appUrl.indexOf('jsessionid') > -1 ? appUrl.substr(0, appUrl.indexOf('jsessionid')) : appUrl);
        $.ajaxSetup({
            type: 'POST',
            complete: function(xhr, status) {
                var res = xhr.responseText;
                try {
                    res = eval('(' + res + ')');
                    if (res.status == false && res.msg == 'SESSION_OUT') {
                        // fly.top.fly.tip({
                        //     content: message.get('SESSION_OUT'),
                        //     css: 'danger'
                        // });

                        if (!fly.top.userName) {
                            window.top.util.tip(message.get('PELEASE_LOGIN'));
                            return false;
                        }
                        setTimeout(function() {
                            win.location.href = res.data.url + loginUrlRes;
                        }, 800);
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        });
    })();

    // 对于数字每三位一个逗号 例如：12,345,678
    common.formatNumber = function(number) {
        // 如果数据为null，则用0代替 
        if (number === null || number === undefined || number == '0') {
            return '0';
        } else {
            var pointNumber = number - parseInt(number);

            var b = parseInt(number),
                absB = (b < 0 ? Math.abs(b) : b).toString(),
                len = absB.length,
                retNum;

            if (len <= 3) {
                return number;
            } else if (len > 3) {
                var r = len % 3;
                retNum = r > 0 ? absB.slice(0, r) + "," + absB.slice(r, len).match(/\d{3}/g).join(",") : absB.slice(r, len).match(/\d{3}/g).join(",");

                if (b < 0) {
                    retNum = '-' + retNum;
                };
            }

            if (pointNumber != 0) {
                return retNum + '.' + number.toString().split('.')[1];
            } else {
                return retNum;
            }

        }
    };
    /**
     * [setGridEmpty 表格空数据处理]
     * @param {[number]} num [表格的列数，为了合并列来显示的]
     */
    common.setGridEmpty = function(num) {
        var emptyDom = '<tr><td colspan="' + num + '"><div class="empty-show">没有数据</div></td></tr>';
        $('.grid').find('tbody').html(emptyDom);
    };

    /**
     * [setEllClass 给grid的表格]
     * @param {[String]} col [宽度]
     * @param {[String]} col [名称]
     * @param {[object]} row [行对象]
     */
    common.setEllClass = function(width) {
        return function(col, row) {
            var data = row[col];

            if (data.toString().length > 0) {
                data = data.toString().replace(/"/g, "'");
            } else {
                data = '-';
            }
            return ("<div class='ell' title=\"{data}\" style=\"width:" + width + "px\">{data}</div>").replace(/{data}/g, data);
        };
    };

    /**
     * 设置表格按钮
     * @param {[type]} url [请求的接口]
     * @param {[type]} param [参数]
     * @param {[type]} success [ajax成功调用的方法]
     * @param {[type]} error [ajax失败调用的方法]
     */
    /*common.ajaxRequest = function(url, param, success, error) {
        $.ajax({
            url: url,
            type: 'POST',
            data: param,
            //dataType: "json",  //by ddqian2 让AJAX自己去识别类别
            success: success,
            error: error
        });
    };*/
    /**
     * 设置表格按钮
     * @param {[type]} url [请求的接口]
     * @param {[type]} param [参数]
     * @param {[type]} success [ajax成功调用的方法]
     * @param {[type]} error [ajax失败调用的方法]
     * @param {[type]} complete [ajax调用完成后的方法]
     */
    common.ajaxRequest = function(url, param, success, error, complete) {
        $.ajax({
            url: url,
            type: 'POST',
            data: param,
            success: success,
            error: error,
            complete: complete
        });
    };

    /**
     * [setVmValue observable赋值]
     * @param  {[type]} obj [定义的observable名称]
     * @param  {[type]} data [传入赋值对象]
     * @2016-11-01 by xinfan
     */
    common.setVmValue = function(obj,data){
        for(var i = 0; i < data.length; i++){
            obj.set(data[i].name,data[i].value);
        }
    };

    /**
     * dialog对话框
     * @param {[type]} content [显示的内容]
     * @param {[type]} okCb [确定是执行的方法]
     * @param {[type]} cancelCb [取消时执行的方法]
     */
    common.sysConfirm = function(content, okCb, cancelCb) {
        var d = fly.top.fly.dialog({
            id: "sysconfirm",
            content: content,
            padding: '15px 20px',
            width: 300 || '', // 宽度 不支持百分比
            height: 100 || '', // 高度 不支持百分比
            title: "系统提示",
            okValue: '确定',
            cancelValue: "取消",
            ok: okCb,
            cancel: true
        });

        return d;
    };

    common.sysDeleteConfirm = function(content, w, h, okCb, cancelCb) {
        var d = fly.top.fly.dialog({
            id: "sysconfirm",
            content: content,
            width: w, // 宽度 不支持百分比
            height: h, // 高度 不支持百分比
            title: "系统提示",
            okValue: '确定',
            cancelValue: "取消",
            ok: okCb,
            cancel: true
        });
        return d;
    };



    /**
     * [getNowFormatDate 获取当前日期并格式化]
     * @return {[type]} [当前日期 yyyy-MM-dd hh:mm:ss]
     */
    common.getNowFormatDate = function() {
        var date = new Date();
        var seperator1 = '-';
        var seperator2 = ':';
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = '0' + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = '0' + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate + ' ' + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
        return currentdate;
    };

    /**
     * 将14位数字字符串转日期格式
     * @param str 14位字符串
     * @return 日期
     */
    common.dateToNum = function(str) {
        return str.replace(/[^0-9]/g, '');
    };

    /**
     * [获取到对象数组中的属性生成字符串数组 ]
     * @param  {[object]} data [数据对象]
     * @param  {[String]} name [需要处理的属性]
     * @return {[Srray]}      [返回字符串数组]
     */
    common.getDataArrayByName = function(data, name) {
        var array = [];
        for (var i = 0; i < data.length; i++) {
            array.push(data[i][name]);
        };
        return array;
    };

    // 获取url中的中文值
    common.getQueryString = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURI(r[2]);
        }
        return '';
    };

    /**
     * 移出遮罩
     * @return {[type]} [description]
     */
    common.removeMask = function() {
        if (window.top.$('.fly-mask').length) {
            util.removeMask();
        }
    };

    // 获取元素位置
    common.getElemPos = function(obj) {
        var pos = {
            "top": 0,
            "left": 0
        };
        if (obj.offsetParent) {
            while (obj.offsetParent) {
                pos.top += obj.offsetTop;
                pos.left += obj.offsetLeft;
                obj = obj.offsetParent;
            }
        } else if (obj.x) {
            pos.left += obj.x;
        } else if (obj.x) {
            pos.top += obj.y;
        }
        return {
            x: pos.left,
            y: pos.top
        };
    }

    // replaceAll
    String.prototype.replaceAll = function(oldV, newV) {
        var reg = new RegExp(oldV, 'g');
        return this.replace(reg, newV);
    }

    // HTML CODE 替换
    common.HTMLCodeReplace = function(dataObj) {
        var codeMap = {
            "&lt;": "<",
            "&gt;": ">",
            "&#40;": "(",
            "&#41;": ")",
            "&#39;": "'"
        }; //特殊字符MAP

        // 循环遍历内容
        for (var i = 0; i < dataObj.length; i++) {
            var item = dataObj[i];

            // 取值
            var $inputObj = $('[name="' + item + '"]'),
                val = $inputObj.val();

            // 替换全部CODE
            for (var code in codeMap) {
                val = val.replaceAll(code, codeMap[code]);
            }

            // 替换
            $inputObj.val(val);
        }
    }

    /**
     *判断是否安装flash
     *
     */
    common.getFlashInfo = function() {
        var swf, data = {};
        if (!!window.ActiveXObject || "ActiveXObject" in window) { //ie
            try {
                var swf = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                // alert("已安装插件"); 
                if (swf) {
                    VSwf = swf.GetVariable("$version");
                    flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
                    // 
                    if (flashVersion > 11) {
                        data.flashVersion = true;
                        data.flag = true;
                        return data;
                    } else {
                        data.flashVersion = false;
                        data.flag = true;
                        return data;
                    }

                } else {
                    data.flashVersion = false;
                    data.flag = false;
                    return data;
                }
            } catch (e) {
                // alert("没有安装插件"); 
                data.flashVersion = false;
                data.flag = false;
                return data;
            }
        }
        //chrome firefox
        if (navigator.userAgent.indexOf("Firefox") > 0 || navigator.userAgent.indexOf("Chrome") > 0) {
            swf = navigator.plugins["Shockwave Flash"];
            if (swf) {
                //alert("已安装插件");
                var words = swf.description.split(" ");
                for (var i = 0; i < words.length; ++i) {
                    if (isNaN(parseInt(words[i]))) continue;
                    flashVersion = parseInt(words[i]);
                }
                if (flashVersion > 11) {
                    data.flashVersion = true;
                    data.flag = true;
                    return data;
                } else {
                    data.flashVersion = false;
                    data.flag = true;
                    return data;
                }

            } else {
                //alert("没有安装插件");
                data.flashVersion = false;
                data.flag = false;
                return data;
            }
        }
    };

    // 暂无数据
    // @param: emptyObj: 空数据需要添加到的DOMID (string)
    common.addEmpty = function(emptyObj) {

        var $emptyObj = $("#" + emptyObj),
            $prevObj = $emptyObj.prev(),
            _objHeight = $emptyObj.height(),
            _marginTopH = _objHeight / 2 - 25, // 25px:暂无数据的高度 / 2
            htmlObj = [
                '<div class="emptyData">',
                '    <table class="wp-100">',
                '        <tbody>',
                '            <tr>',
                '                <td>',
                '                    <div class="emptyData-container">',
                '                        <div class="emptyData-left empty-wrap"></div>',
                '                        <div class="emptyData-right empty-wrap">暂无数据~</div>',
                '                    </div>',
                '                </td>',
                '            </tr>',
                '        </tbody>',
                '    </table>',
                '</div>'
            ].join('');

        $emptyObj.empty().append(htmlObj);

        if ($prevObj && $prevObj.length) {
            $emptyObj.css({
                'width': $prevObj.width()
            });
            $prevObj.css({
                "overflow-x": "visible"
            });
        }

        // 修改高度、宽度
        $emptyObj.find('.emptyData-container').css('padding-top', _marginTopH);
    };
    // 可上传的文件扩展名 *.gif; *.jpg; *.png; *.jpeg; *.JPG; *.JPEG; *.PNG; *.GIF
    common.fileTypes = ['.gif', '.jpg', '.png', '.jpeg', '.GIF', '.JPG', '.PNG', '.JPEG'];
    /*
     * 一次上传所有文件的总大小10M ,单位字节
     */
    common.ONCE_UPLOAD_FILE_SIZE = 10485760;

    Array.prototype.sum = function() {

        var temp = 0;

        for (var i = 0, len = this.length; i < len; i++) {
            temp += this[i] >> 0;
        }
        return temp;
    };

    common.dateFormatter = function() {

        // 时间的格式处理 
        fly.template.helper('dateFormatter', function(str) {
            if (!str) {
                return '-';
            }
            var newStr = '';
            if (str.length >= 12) {
                newStr = str.substring(0, 4) + '-' + str.substring(4, 6) + '-' + str.substring(6, 8) + ' ' + str.substring(8, 10) + ':' + str.substring(10, 12);
            } else if (str.length == 8) {
                newStr = str.substring(0, 4) + '-' + str.substring(4, 6) + '-' + str.substring(6, 8);
            } else {
                newStr = str;
            }
            return newStr;
        });
    };

    (common.numberToString = function() {
        fly.template.helper('numberToString', function(str) {
            return common.formatNumber(str);
        });
    })(),

    // 帮扶日志的展开和关闭 
    common.logShowAndHideFun = function() {
        fly.template.helper('logIntroFormatter', function(str) {
            if (str.length > 100) {
                return str.substring(0, 100) + '...';
            }
        });

        // 帮扶日志的展开和关闭 
        $('#helpLogWrap').on('click', '.log-show', function() {
            var $this = $(this),
                $closeDom = $this.closest('.log-intro'),
                allArticle = $closeDom.attr('title'),
                flag = $this.hasClass('log-open');
            if (flag) {
                $closeDom.find('.log-article').text(allArticle);
                $this.addClass('log-close').removeClass('log-open').attr('title', '收起').text('收起');
            } else {
                var newArticle = allArticle.length > 100 ? (allArticle.substring(0, 100) + '...') : allArticle;
                $closeDom.find('.log-article').text(newArticle);
                $this.addClass('log-open').removeClass('log-close').attr('title', '展开').text('展开');
            }
        });
    };

    /**
     * [setGridEmpty 表格空数据处理]
     * @param {[number]} num [表格的列数，为了合并列来显示的]
     */
    common.setGridEmpty = function(num) {
        var emptyDom = '<tr><td colspan="' + num + '"><div class="empty-show">没有数据</div></td></tr>';
        $('.grid').find('tbody').html(emptyDom);
    };
    /**
     * [setGridEmptyBySelector 表格空数据处理]
     * @param {[number]} num [表格的列数，为了合并列来显示的]
     * @param selector jquery选择器
     */
    common.setGridEmptyBySelector = function(selector,num) {
        var emptyDom = '<tr><td colspan="' + num + '"><div class="empty-show">没有数据</div></td></tr>';
        $(''+selector).find('tbody').html(emptyDom);
    };

    common.getAddressDataObj = function() {
        var dataObj = {
        		// 省默认值
        	provinceValue:'340000000000',
            // 省的数据源
            province: fly.dataSource({
                read: {
                    url: CONTEXTPATH + '/dict/getAddress.do?sjbm=0',
                    dataType: 'json'
                },
                server: true

            }),

            // 市的数据源            
            city: fly.dataSource({
                read: {
                    url: CONTEXTPATH + '/dict/getAddress.do',
                    dataType: 'json'
                },
                server: true
            }),
            // 县的数据源            
            county: fly.dataSource({
                read: {
                    url: CONTEXTPATH + '/dict/getAddress.do',
                    dataType: 'json'
                },
                server: true
            }),
            // 乡镇的数据源            
            town: fly.dataSource({
                read: {
                    url: CONTEXTPATH + '/dict/getAddress.do',
                    dataType: 'json'
                },
                server: true
            }),
            //村的数据源            
            village: fly.dataSource({
                read: {
                    url: CONTEXTPATH + '/dict/getAddress.do',
                    dataType: 'json'
                },
                server: true
            }),
            //组的数据源            
            group: fly.dataSource({
                read: {
                    url: CONTEXTPATH + '/resources/json/group.json',
                    dataType: 'json'
                },
                server: true
            }),
            //年度数据源            
            yearSource: fly.dataSource({
                data: [{
                    text: '2013',
                    value: '2013'
                }, {
                    text: '2014',
                    value: '2014'
                }, {
                    text: '2015',
                    value: '2015'
                }, {
                    text: '2016',
                    value: '2016'
                }, {
                    text: '2017',
                    value: '2017'
                }, {
                    text: '2018',
                    value: '2018'
                }, {
                    text: '2019',
                    value: '2019'
                }, {
                    text: '2020',
                    value: '2020'
                }, {
                    text: '2021',
                    value: '2021'
                }, {
                    text: '2022',
                    value: '2022'
                }, {
                    text: '2023',
                    value: '2023'
                }, {
                    text: '2024',
                    value: '2024'
                }, {
                    text: '2025',
                    value: '2025'
                }, {
                    text: '2026',
                    value: '2026'
                }, {
                    text: '2027',
                    value: '2027'
                }, {
                    text: '2028',
                    value: '2028'
                }, {
                    text: '2029',
                    value: '2029'
                }, {
                    text: '2030',
                    value: '2030'
                }]
            })
        };
        return dataObj;
    };
    common.roundInt = function(n){
        n = Math.round(n);
        // 取字符串首位
        var x, y, z;
        // 第一位数字
        x = y = n.toString().substring(0,1);
        // 组成第一位数据后面拖0
        for (var i = 1; i < n.toString().length; i++){
            x = x + '0';
        }
        // 整除取10的整数倍
        z = parseInt(x)/parseInt(y);
        return Math.ceil(Math.ceil(n/z) * z);
    };
    common.generateMixed = function(n) {
        var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var res = "";
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * 35);
            res += chars[id];
        }
        return res;
    };
    common.cyfp_auth_code = 'A_620400000000';
    common.permission = function() {
        //权限控制，根据请求的head读权限
        //查看权限--query
        //删除--delete
        //编辑--edit
        //新增--add
        //        var codes = []; 
        //        $.ajax({
        //            type: 'HEAD', // 获取头信息，type=HEAD即可
        //            url : window.location.href,
        //            complete: function( xhr,data ){
        //                // 获取相关Http Response header
        //            	 setTimeout(function(){
        //	                var codes = xhr.getResponseHeader('operationCodes')
        //	                        .replace("[","")
        //	                        .replace("]","")
        //	                        .replace(" ","");
        //	                codes = codes.split(",");
        //	                $.each(codes, function(i,item){
        //	                	item = item.replace(/\s+/g,"");               	
        //	                    $(".js-permission-" + item).show();
        //	                })
        //	                $("body").on('DOMSubtreeModified propertychange', function(){
        //	                    $.each(codes, function(i,item){
        //	                        $(".js-permission-" + item).show();
        //	                    })
        //	                });
        //            	 },1000);
        //                
        //            }
        //        });

    };

    //小数转百分数
    common.toPercent = function(obj, n) {
        n = n || 2;
        return (Math.round(obj * Math.pow(10, n + 2)) / Math.pow(10, n) ).toFixed(n) + '%';
    };

    //js字符串截断
    common.cutStr = function(str,num){
        var val = str;
        var length = 0;
        var newVal="";
        for (var i = 0; i < val.length; i++) {
            if (val.charCodeAt(i) > 255){ //汉字还是字母
                length = length + 2;
            }else{
                length = length + 1;
            }
            if(length > num){
                newVal= str.substring(0,i) + '...';
                return newVal;
            }
        }
        return str;
    };

    //数组降序
    common.sortby =function(name) {
        return function (o, p) {
            var a, b;
            if (typeof o === "object" && typeof p === "object" && o && p) {
                a = o[name];
                b = p[name];
                if (a === b) {
                    return 0
                }
                if (typeof a === typeof b) {
                    return a > b ? -1 : 1
                }
                return typeof a > typeof b ? -1 : 1
            } else {
                throw("error")
            }
        }
    };


    // 数组去重 
    Array.prototype.unique = function() {
        var res = [this[0]];
        for (var i = 1; i < this.length; i++) {
            var repeat = false;
            for (var j = 0; j < res.length; j++) {
                if (this[i] == res[j]) {
                    repeat = true;
                    break;
                }
            }
            if (!repeat) {
                res.push(this[i]);
            }
        }
        return res;
    };

    // 删除数组
    common.removeArray =function(data, arrayData) {
        if(arrayData == '') return false;
        for (var i = 0; i < data.length; i++){
            for (var j = 0; j < arrayData.length; j++){
                if(data[i] == arrayData[j]){
                    data.splice(i,1);
                    common.removeArray(data,arrayData);
                    return data;
                }
            }
        }
    }

    window.common = common;
    return common;
}));
