define(['jquery',
    'fly',
    'common',
    'message',
    'util',
    'uploadify'
], function ($, fly, common, message, util) {
    //获取当前页面名称
    var controlName = window.location.href.substring(window.location.href.lastIndexOf('/') + 1, window.location.href.lastIndexOf('.do'));
    //获取当前页面编号
    var _index = fly.utils.getQueryString('_index');
    _index = _index && _index >= 0 ? _index : 0;
    var defaultUrl = '',
        navListCache = {};

    //初始化indexinfo对象
    var ivm = fly.observable({
        //左侧菜单
        initNavStyle: function (code) {
            var leftMenuItem = $('#left_menu').find(".menu-item");
            leftMenuItem.next(".menu-children").hide().stop().first().show();
            var menuArrow = $(".menu-arrow"),
                menuItem = $(".menu-item");
            menuArrow.addClass("menu-arrow-close");
            menuItem.first().addClass("menu-item-select").stop().find('.menu-arrow').removeClass("menu-arrow-close").addClass("menu-arrow-open");
            leftMenuItem.last().addClass("menu-item-last").stop().next(".menu-children").last().addClass("menu-item-last");
        },
        //头部菜单初始化
        initTopNavMenu: function () {
            var webcontextUrl = ivm.navTopList.data()[_index].url;
            defaultUrl = webcontextUrl;
            if (webcontextUrl && webcontextUrl != null && webcontextUrl != '') {
                $('#pageFrame').attr('src', ivm.navTopList.data()[_index].type == 'MENU' ? BASE_PATH + webcontextUrl : webcontextUrl);
            }
            $('.main-nav-inner li').eq(_index).addClass("active").children('i').addClass('active');
        },
        // 左侧菜单,使用配置的数据
        platMainImg: '',
        platMainTitle: '',
        platMainUrl: '',
        platMainOpen: '',
        // 子系统首页点击
        platMainClick: function(e){
            var _this = $(e.currentTarget),
                defaultUrl = _this.attr('url');
            if (_this.attr('openwin') === 'true') {
                window.location.href = CONTEXTPATH + '/analysis.do';
            } else {                
                if (defaultUrl && defaultUrl != null && defaultUrl != "") {
                    $('#pageFrame').attr('src', BASE_PATH + defaultUrl);
                }
            }
        },
        navList: fly.dataSource({
            data: []
        }),
        // 顶部菜单
        navTopList: fly.dataSource({
            data: []
        }),
        // 上方快捷方式菜单
        navTopData: fly.dataSource({
            data: []
        }),
        navTopClick: function(e){
            var item = e.data;
            ivm.navTopData.data([]);
            ivm.loadMenu(item.code);
            ivm.set('platMainOpen', item.openUrl ? 'true' : 'false');
            ivm.set('platMainUrl', item.url);
            ivm.set('platMainImg', item.platimg);
            ivm.set('platMainTitle', item.title);
            $(e.currentTarget).addClass('active').siblings("li").removeClass('active');
            $(e.currentTarget).children('i').addClass('active').parent().siblings("li").children('i').removeClass('active');
            // 打开各自默认的页面并加载各自web的菜单
            if (item.url && item.url != null && item.url != "") {
                $('#pageFrame').attr('src', item.type === 'MENU' ? BASE_PATH + item.url : item.url);
            }
        },
        loadMenu: function (navId) {
            // 加载指定的菜单数据，如果已经加载不再重复加载
            if (navId && navListCache[navId] != null) {
                // 已经加载则直接重新bind
                ivm.navList.data(navListCache[navId]);
                ivm.initNavStyle(navId);
            }
        },
        addEvent: function () {
            $(document).on('click', '.menu-item', function (e) {
                var menuItem = $(".menu-item");
                menuItem.removeClass("menu-item-select");
                $(this).addClass("menu-item-select");
                if ($(this).find('.menu-arrow').length == 0) {
                    $('#pageFrame').attr('src', $(this).attr('data-url'));
                }
                var _$that = $(this);
                var eCurMenuArrow = _$that.find(".menu-arrow");
                if (eCurMenuArrow.hasClass("menu-arrow-open")) {
                    eCurMenuArrow.removeClass("menu-arrow-open").addClass("menu-arrow-close");
                } else {
                    eCurMenuArrow.removeClass("menu-arrow-close").addClass("menu-arrow-open");
                    _$that.siblings('.menu-item').find(".menu-arrow").removeClass("menu-arrow-open").addClass("menu-arrow-close");
                    _$that.next(".menu-children").siblings('.menu-children').hide();
                }
                $(e.currentTarget).next(".menu-children").toggle();
                $('.menu-children li a').removeClass("menu-c-active");
            });
            //点击菜单加载页面
            $(document).on('click', '.menu-children li a', function (e) {
                $('#topMenuWrap').addClass('hide');
                $('#pageFrame').css('paddingTop', '0');
                $('.menu-children li a').removeClass("menu-c-active");
                $(this).addClass("menu-c-active");
                document.getElementById('iframe_wrap').style.height = $(window).height() - 165;
                var urlHf = $(this).attr('data-src');
                $('#pageFrame').attr('src', (urlHf.substr(0,7).toLowerCase() === 'http://') ? urlHf : (BASE_PATH + urlHf));
            });
        }
    });
    fly.bind('#indexWrap', ivm);
    window.ivm = ivm;
    //初始公共对象
    var gvm = fly.observable({
        msgNum: 0,
        msgNavList: fly.dataSource({
            data: []
        }),
        sysNavList: fly.dataSource({
            data: []
        }),
        //消息数量
        loadMsgNum: function () {
            $.ajax({
                url: CONTEXTPATH + '/system/notice/searchAllNewNoticeCnt.do',
                type: 'POST',
                data: {},
                dataType: "json",
                success: function (res) {
                    if (res.status) {
                        var resNum = '';
                        if (parseInt(res.data) > 99) {
                            resNum = '99+'
                        } else {
                            resNum = res.data;
                        }
                        gvm.set('msgNum', resNum);
                    } else {
                        gvm.set('msgNum', 0);
                    }
                },
                error: function (a, b, c) {
                }
            });
        },
        //新增消息列表
        loadMsgList: function () {
            $.ajax({
                url: CONTEXTPATH + '/system/notice/searchNewNotice.do',
                type: 'POST',
                data: {},
                dataType: "json",
                success: function (res) {
                    if (res.status) {                        
                        if (res.data.length > 0) {
                            gvm.msgNavList.data([]);
                            for (var i = 0; i < res.data.length; i++) {
                                gvm.msgNavList.add(res.data[i]);
                            }

                        } else {
                            $('#msgNavList').html('<li style="padding:15px 0;height:inherit; text-align: center">暂无消息</li>');
                        }
                    } else {                        
                        $('#msgNavList').html('<li style="padding:15px 0;height:inherit; text-align: center">暂无消息</li>');
                    }
                },
                error: function (a, b, c) {
                }
            });
        },
        loadNav: function () {
            var navData = [],
                ndata = [];
            $.ajax({
                url: CONTEXTPATH + '/common/getNavData.do',
                type: 'POST',
                data: {},
                dataType: "json",
                success: function (res) {
                    if (res.success) {
                        var resData = res.data.items;
                        //缓存克隆数据
                        navData = [].concat(resData);
                        //系统管理菜单;
                        for (var i = 0; i < resData.length; i++) {
                            //系统管理菜单排除
                            if (resData[i].title === '系统管理') {
                                gvm.sysNavList.data(resData[i].items);
                                navData.splice(i);
                            }
                        }
                        //顶部导航的图标icon，UAAC暂时不支持上传此图，以title匹配
                        $.map(navData, function(item){
                            switch (item.title) {
                                case '扶贫对象管理' :
                                    item.iconClass = 'ico-nav-peo';
                                    break;
                                case '扶贫资金管理' :
                                    item.iconClass = 'ico-nav-cog';
                                    break;
                                case '扶贫项目管理' :
                                    item.iconClass = 'ico-nav-folder';
                                    break;
                                case '责任落实监管' :
                                    item.iconClass = 'ico-nav-server';
                                    break;
                                case '脱贫成效评估' :
                                    item.iconClass = 'ico-nav-doc';                                        
                                    break;
                                case '数据分析展现' :
                                    item.iconClass = 'ico-nav-graph';
                                    item.openUrl = true;                                   
                                    break;
                            }
                        })
                        //如果是子系统框架
                        if (controlName === 'indexinfo') {
                            for (var i = 0; i < navData.length; i++) {
                                navData[i].platimg = CONTEXTPATH + "/common/getAuthIcon.do?authCode=" + resData[i].code;
                                navData[i]._index = i;
                                for (var j = 0; j < resData[i].items.length; j++) {
                                    // 将本地数据的子菜单图标导入
                                    navData[i].items[j].icon = CONTEXTPATH + "/common/getAuthIcon.do?authCode=" + resData[i].items[j].code;
                                    if (resData[i].items[j].items != null && resData[i].items[j].items.length > 0) {
                                        if (resData[i].items[j].type == "URL") {
                                            //资金项目里面需要的顶部菜单数组
                                            var topItemsList = navData[i].items[j].topitems = resData[i].items[j].items.slice(0);
                                            resData[i].items[j].items = common.removeArray(resData[i].items[j].items.slice(0),resData[i].items[j].items);
                                            for (var k = 0; k < topItemsList.length; k++) {
                                                topItemsList[k].icon = CONTEXTPATH + "/common/getAuthIcon.do?authCode=" + topItemsList[k].code;
                                            }
                                        } else if (resData[i].items[j].type == "MENU") {
                                            for (var k = 0; k < resData[i].items[j].items.length; k++) {
                                                navData[i].items[j].items[k].icon = CONTEXTPATH + "/resources/img/icon/arrow.png";
                                            }
                                        }
                                    }
                                }
                                // navData中的items移除第0个（首页）
                                navData[i].items.splice(0, 1);
                                // 临时存储
                                navListCache[navData[i].code] = navData[i].items;
                                ndata.push(navData[i]);
                            }
                            ivm.navList.data(navData[_index].items);
                            ivm.navTopList.data(navData);
                            ivm.addEvent();
                            ivm.initTopNavMenu();
                            ivm.initNavStyle();

                            // 左上方默认使用第一个系统的图片和名称
                            ivm.loadMenu(navData[_index].code);
                            ivm.set('platMainOpen', navData[_index].openUrl);
                            ivm.set('platMainUrl', navData[_index].url);
                            ivm.set('platMainImg', BASE_PATH + navData[_index].platimg);
                            ivm.set('platMainTitle', navData[_index].title);
                        }
                        //如果大首页
                        if (controlName === 'lead'){
                            vm.leadNav.data(navData);
                        }
                    } else {
                        fly.tip({
                            content: "菜单获取失败",
                            css: 'danger'
                        });
                    }
                },
                error: function (a, b, c) {
                }
            });
        },
        openReset: function () {
            top.fly.dialog({
                id: 'changePwdDialog',
                title: '密码修改',
                content: $('#changePasswd'),
                width: 340,
                height: 160,
                padding: '20px'
            });

        },
        openUserInfo: function () {
            uvm.loadUvm();
            top.fly.dialog({
                id: 'updataInfoDialog',
                title: '账号管理',
                content: $('#updataInfo'),
                width: 680,
                height: 580,
                padding: '10px 15px'
            });
        },
        dropEvent: function () {
            //登录退出
            $(document).on('click', '.exit-a', function () {
                fly.top.fly.dialog({
                    title: '退出',
                    content: '是否确认退出？',
                    // width: 100,
                    height: 20,
                    padding: '30px 80px',
                    okValue: '确认',
                    cancelValue: '取消',
                    ok: function () {
                        window.parent.open("<c:url value='/logout.do'/>", '_parent', '');
                        window.location.href = $('#myUrl').html() + "&service=" + encodeURIComponent(window.location.href.replace("#", ""));
                    },
                    cancel: true
                });
            });
            // 返回首页
            $(document).on('click', '.back-home', function () {
                window.location.href = CONTEXTPATH + '/lead.do';
            });

            // 通用下拉
            $(document).on('click', '.hd-drop', function () {
                $('.hd-drop').eq($('.hd-drop').index(this)).siblings('.hd-drop').children('.hd-dropdown').hide();
                if ($(this).children('.hd-dropdown').is(':visible')) {
                    $(this).children('.hd-dropdown').hide();
                } else {
                    $(this).children('.hd-dropdown').show();
                }
            });
            $(document).on('mouseleave', '.hd-drop', function () {
                $(this).children('.hd-dropdown').hide();
            });
        },
        openMsg: function (e) {
            var url = CONTEXTPATH + '/pages/msg-view.do?noticeId=' + $(e.toElement).data('id');
            top.fly.dialog({
                id: 'msgDetail',
                title: '通知消息',
                url: url,
                width: 980,
                height: 480,
                padding: '0',
                close: function (){
                    gvm.loadMsgNum();
                    gvm.loadMsgList();
                }
            });
        },
        openMoreMsg: function (e) {
            var url = CONTEXTPATH + '/pages/msg-list.do';
            top.fly.dialog({
                id: 'msgList',
                title: '通知消息',
                url: url,
                width: 980,
                height: 480,
                padding: '0',
                close: function (){
                    gvm.loadMsgNum();
                    gvm.loadMsgList();
                }
            });
        },
        openSysMenu: function (e) {
            var url = $(e.toElement).data('href');
            var hrefName = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.do'));
            if (controlName != 'indexlist') {
                window.open(CONTEXTPATH + '/indexlist.do?href=' + hrefName, '_self');
            } else {
                gvm.listFrame(url);
            }
        },
        listFrame: function (url) {
            document.getElementById('iframe_wrap').style.height = $(window).height() - 165;
            $('#pageFrame').attr('src', BASE_PATH + url);
        }
    });
    fly.bind('#indexHeader', gvm);
    window.gvm = gvm;

    //修改密码弹框对象
    var pvm = fly.observable({
        saveEvent: function () {
            var saveData = $('#changePasswd').data('flyForm').data();
            if (saveData === null) {
                return false;
            }

            if (pvm.get('form.rnewPasswd') !== pvm.get('form.newPasswd')) {
                fly.tip({
                    content: '两次输入的新密码不一致',
                    css: 'warning'
                });
                return false;
            }

            util.mask(message.get('LOADING'));
            common.ajaxRequest(CONTEXTPATH + '/user/changePassword.do', {
                userId: $('#userId').val(),
                oldPasswd: pvm.get('form.oldPasswd'),
                newPasswd: pvm.get('form.rnewPasswd')
            }, function (res) {
                util.removeMask();
                if (res.flag) {
                    fly.tip({
                        content: '密码修改成功',
                        css: 'success'
                    });
                    pvm.destroyCurrentDialog();
                    window.parent.open("<c:url value='/logout.do'/>", '_parent', '');
                    window.location.href = $('#myUrl').html() + "&service=" + encodeURIComponent(window.location.href.replace("#", ""));
                } else {
                    fly.tip({
                        content: '原始密码错误',
                        css: 'danger'
                    });
                }
            })
        },
        cancelEvent: function () {
            pvm.destroyCurrentDialog();
        },
        form: {
            oldPasswd: '',
            newPasswd: '',
            rnewPasswd: ''
        },
        //销毁弹框
        destroyCurrentDialog: function () {
            setTimeout(function () {
                top.fly.dialog.get('changePwdDialog').destroy();
                pvm.set('form', {});
            }, 200);
        }
    });
    //修改密码校验
    fly.bind($('#changePasswd').flyForm({
        valid: {
            oldPasswd: {
                title: '原始密码',
                max: 20,
                required: true
            },
            newPasswd: {
                title: '新密码',
                max: 20,
                required: true
            },
            rnewPasswd: {
                title: '确认新密码',
                max: 20,
                required: true
            }
        }
    }), pvm);
    window.pvm = pvm;

    //更新用户信息对象
    var uvm = fly.observable({
        form: {
            loginName: '',
            name: '',
            sfzh: '',
            mobilePhone: '',
            email: '',
            sex: '',
            birthday: '',
            nation: '',
            officePhone: '',
            education: '',
            zzmm: '',
            zipcode: '',
            address: '',
            orgId: '',
            fullName: '',
            zw: ''
        },
        fileid: '',
        loginNameEnable: false,
        sfzhEnable: false,
        sexDict: fly.dataSource({
            read: {
                url: CONTEXTPATH + '/dict/getDictionary.do?lxjp=XB'
            }
        }),
        nationDict: fly.dataSource({
            read: {
                url: CONTEXTPATH + '/dict/getDictionary.do?lxjp=MZ'
            }
        }),
        educationDict: fly.dataSource({
            read: {
                url: CONTEXTPATH + '/dict/getDictionary.do?lxjp=XL'
            }
        }),
        zzmmDict: fly.dataSource({
            read: {
                url: CONTEXTPATH + '/dict/getDictionary.do?lxjp=ZZMM'
            }
        }),
        saveEvent: function () {
            var saveData = $('#updataInfo').data('flyForm').data();
            if (saveData === null) {
                return false;
            }

            //保存头像filed
            saveData.fileid = uvm.fileid;

            util.mask(message.get('LOADING'));
            common.ajaxRequest(CONTEXTPATH + '/user/changeUserInfo.do', saveData, function (res) {
                util.removeMask();
                res = fly.evalJSON(res);
                if (res.returnFlag) {
                    fly.tip({
                        content: '用户信息更新成功',
                        css: 'success'
                    });
                    uvm.destroyCurrentDialog();
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                } else {
                    fly.tip({
                        content: '用户信息更新失败',
                        css: 'danger'
                    });
                }
            })
        },
        cancelEvent: function () {
            uvm.destroyCurrentDialog();
        },
        //销毁弹框
        destroyCurrentDialog: function () {
            setTimeout(function () {
                top.fly.dialog.get('updataInfoDialog').destroy();
                uvm.set('form', {});
            }, 200);
        },
        //上传图片
        uploadImg: function () {
            $('#phoneWarp').uploadify({
                auto: true,
                swf: CONTEXTPATH + '/resources/js/plugins/uploadify/uploadify.swf',
                uploader: CONTEXTPATH + '/attachment/upload.do',
                //uploader: CONTEXTPATH + '/user/changeUserPhoto.do?userId=' + $('input#userLoginId').val(),
                debug: false,
                formData: {},
                itemTemplate: false,
                width: 150,
                height: 20,
                multi: false, // 是否能选择多个文件
                fileTypeExts: '*.gif; *.jpg; *.png; *.jpeg; *.JPG; *.JPEG; *.PNG; *.GIF; *.BMP', // 允许上传的文件后缀
                fileTypeDesc: '*.gif; *.jpg; *.png; *.jpeg; *.JPG; *.JPEG; *.PNG; *.GIF; *.BMP', // 文件描述
                fileCount: 1,
                fileSizeLimit: "3MB", //设置单个文件大小限制，允许使用 (B, KB, MB, 或 GB) 为单位
                simUploadLimit: 5,
                fileNumLimit: 5,
                removeCompleted: false,
                buttonText: '头像上传',
                buttonClass: 'phone-img-btn',
                onError: function () {
                    $.fly.tip({
                        content: '上传失败',
                        css: 'warning'
                    });
                },
                onUploadStart: function () {
                },
                onUploadSuccess: function (file, data, response) {

                    var resData = fly.evalJSON(data);
                    if (resData.flag == "false") {
                        var resultMsg = resData.result;
                        if (resultMsg == "UPLOAD_LARGE_FAIL") {
                            fly.tip({
                                content: '上传文件过大（每张图片最大3M）',
                                css: 'danger'
                            });
                            $('.upload-box').find('#uploadImg-queue').remove();
                            return false;
                        }
                        fly.tip({
                            content: resultMsg,
                            css: 'danger'
                        });
                        return false;
                    }
                    var filePath = resData.data[0].filePath;
                    uvm.set('fileid', filePath);
                    $('input#fileId').val(filePath);

                    var srcImg = CONTEXTPATH + '/attachment/downloadByPath.do?filePath=' + filePath;
                    $('#phoneImg').css('background', 'none');
                    $('#phoneImg').attr('src', srcImg);
                },
                onInit: function () {

                },
                onSelect: function () {

                },
                onSelectError: function (file, s, b) {
                    if (this.queueData.errorMsg != null) {
                        fly.tip({
                            content: '\n该文件不是被支持的图片类型',
                            css: 'danger'
                        });
                    }
                }
            });
        },
        loadUvm: function () {
            common.ajaxRequest(CONTEXTPATH + '/user/getUserInfo.do?=', null, function (res) {
                var data = [];
                if (res) {
                    data = $.extend(res.user, res.userDetail);
                    data.fullName = res.organization.fullName;
                    for (var x in data) {
                        uvm.set('form.' + x, data[x]);
                    }
                    $('input#loginName').addClass('readonly').attr({'readonly': true});
                    $('input#sfzh').addClass('readonly').attr({'readonly': true});
                    $('input#fullName').addClass('readonly').attr({'readonly': true});
                    $('input#zw').addClass('readonly').attr({'readonly': true});
                } else {
                    return [];
                }
            }, function () {

            })
        }
    });
    fly.bind($('#updataInfo').flyForm({
        valid: {
            name: {
                title: '真实姓名',
                max: 20,
                required: true
            },
            mobilePhone: {
                title: '手机号码',
                max: 11,
                pattern: /(^(\d{3,4}-)?\d{7,8})$|(^[0-9]*\d{11}$)/i,
                required: true
            },
            email: {
                title: '电子邮箱',
                max: 20,
                pattern: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
                required: false
            },
            officePhone: {
                title: '办公电话',
                max: 10,
                pattern: /(^(\d{3,4}-)?\d{7,8})$|(^[0-9]*\d{11}$)/i,
                required: false
            },
            zipcode: {
                title: '邮政编码',
                max: 6,
                pattern: /^$|(^[0-9]\d{0,19}$)/i,
                required: false
            },
            address: {
                title: '邮政编码',
                max: 200,
                required: false
            }
        }
    }), uvm);
    window.uvm = uvm;
});
