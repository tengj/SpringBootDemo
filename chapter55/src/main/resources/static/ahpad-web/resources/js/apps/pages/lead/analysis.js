require.config(requireConfig);
require(['jquery',
    'fly',
    'common',
    'util',
    'message',
    '../apps/pages/lead/paint-lib',
    '../apps/pages/head',
    'raphael',
    'raphaelF',
    '../apps/pages/lead/map-ah-path',
    'countdown'
], function($, fly, common, util, message, paint) {
    var baseUrl = CONTEXTPATH + '/resources',
        proveCode = '340000000000',
        proveName = '安徽省',
        count = 0,
        maxAjaxNum = 7;

    // 创建基本视图对象
    var vm = window.vm = fly.observable({
        currentCode: '',
        codeName: '安徽省',
        //地图
        selProvinceActive: true,
        selProvinceEvt: function(){
            if (vm.selProvinceActive){
                return false;
            } else {
                vm.set('selProvinceActive', true);
                $('#map').empty();
                vm.povertyMap(proveCode);
                vm.reloadData(proveName, 6, proveCode);
            }
        },
        povertyMapCache: [],
        povertyMap: function(code){
            var mapCache = false, resData;
            if (vm.povertyMapCache.length == 0){
                $.ajax({
                    url: CONTEXTPATH + '/index/queryPkrlt.do',
                    type: 'POST',
                    async: false,
                    data: {code: code},
                    dataType: 'JSON',
                    success: function(res){
                        count++;
                        vm.handle();
                        var data = res.data;
                        vm.set('povertyMapCache', [].concat(data));
                        resData = data;
                    },
                    error: function(){
                        count++;
                        vm.handle();
                        util.tip('数据异常', 'danger');
                    }
                });
            } else {
                resData = vm.povertyMapCache;
            }
            // 绘制底图数据
            paint.drawProvince('map', resData, province.anhui, false, function(R, province){
                // 绘制地图透明层，用于事件
                var hoverPath = R.set();
                // 颜色配置 
                var cicleAttr = {"fill": "#f00","stroke": "#fff","stroke-width": 2},
                    hoverPathAttr = {'fill': '#fdb72b', 'stroke': '#fff', 'stroke-width': 3, 'stroke-linejoin': 'round', 'stroke-linecap': 'round'},
                    textAttr = {"fill": "#333","font-size": "16px","font-weight": "bold","text-anchor":"middle"},
                    popBGAttr = {"fill": "#333","fill-opacity": 0.9,"stroke": "none","font-size": "16px","font-weight": "bold","text-anchor":"middle"},
                    blueAttr = {"fill": "#5caeff","stroke": "none"},
                    greenAttr = {"fill": "#63d782","stroke": "none"},
                    purpleAttr = {"fill": "#bd85eb","stroke": "none"},
                    whiteTxtAttr = {"fill": "#FFF", "stroke": "none", "font-size": "16px;","text-anchor":"start"};                         
                for (var state in province){
                    (function (st, state) {
                        province[state]['click'].node.onclick = function(){
                            vm.set('selProvinceActive', false);
                            var x = province[state]['x'],
                                y = province[state]['y'],
                                item = province[state]['item'];
                            hoverPath.remove();
                            hoverPath.push(
                                R.path(province[state]['path']).attr(hoverPathAttr).shadow().animate({"fill-opacity": 1, 'transform': "s1.05 1.05"}, 100),
                                R.circle(x, y, 4).attr(cicleAttr),
                                R.text(x, y + 20, province[state]['name']).attr(textAttr),
                                R.rect(x + 10, y - 50, 120, 100, 5).attr(popBGAttr),
                                R.rect(x + 20, y - 35, 14, 14).attr(blueAttr),
                                R.text(x + 40, y - 27, item.pkrksl + '人').attr(whiteTxtAttr),
                                R.rect(x + 20, y - 8, 14, 14).attr(greenAttr),
                                R.text(x + 40, y, item.pkcsl + '个').attr(whiteTxtAttr),
                                R.rect(x + 20, y + 20, 14, 14).attr(purpleAttr),
                                R.text(x + 40, y + 28, item.pkxsl + '个').attr(whiteTxtAttr)
                            )
                            vm.reloadData(province[state]['name'], 6, province[state].code);
                        }
                    })(province[state], state);
                }
            });
        },
        //扶贫资金
        fundsSourcesDS: fly.dataSource({
            data: []
        }),
        fundsTypesDS: fly.dataSource({
            data: []
        }),
        povertyFund: function(code){
            $.ajax({
                url: CONTEXTPATH + '/index/queryHelpFunds.do',
                type: 'POST',
                dataType: 'JSON',
                data: {
                    code: code
                },
                success: function(res){
                    count++;
                    vm.handle();
                    var data = res.data;
                    // 资金来源、类型
                    function pieData(data, colors){
                        var resData = [],
                            values = [],
                            labels = [],
                            others = 0;
                        // 处理数据                    
                        if (data.length > 0) {
                            data.sort(common.sortby('zjsl'));
                        }
                        // 获取值、标签
                        for (var i = 0; i < data.length; i++){
                            if (i < 5) {
                                resData.push({
                                    name: data[i].bmmc,
                                    num: data[i].zjsl,
                                    color: colors[i]
                                });
                            } else {
                                others = others + data[i].zjsl
                            }
                        }
                        if (data.length > 5) {
                            resData.push({
                                name: '其他',
                                num: parseFloat(others.toPrecision(12)),
                                color: colors[5]
                            });
                        }
                        return resData;
                    }
                    var typeValues = [],
                        typeColors = ['#5baeff','#976be6','#4dcc74','#3a4bb4','#ff8050','#ffca52'],
                        typesData = data.fundsTypes,
                        sourcesValues = [],
                        sourcesColor =  ['#5baeff','#966be5','#5ed97f','#3748b0','#ff8050','#ffca52'],
                        sourcesData = data.fundsSources;
                    var resSourcesData = pieData(sourcesData, sourcesColor),
                        resTypesData = pieData(typesData, typeColors);
                    // 处理数据
                    $.map(resSourcesData, function(item){
                        item.unit = '万元';
                        sourcesValues.push(item.num);
                    });
                    $.map(resTypesData, function(item){
                        item.unit = '万元';
                        typeValues.push(item.num);
                    })
                    paint.drawPieChat('fundItem1', 220, 220, 100, sourcesValues, null, sourcesColor, null, {r: 50, color: '#fff'}, {diff:5});
                    paint.drawPieChat('fundItem2', 220, 220, 100, typeValues, null, typeColors, null, {r: 50, color: '#fff'});
                    vm.fundsTypesDS.data(resTypesData);
                    vm.fundsSourcesDS.data(resSourcesData);
                    // 资金趋势
                    paint.drawSigLine('fundItem3','trzj','万元', data.fundsTrends);
                },
                error: function(){
                    count++;
                    vm.handle();
                    util.tip('数据异常', 'danger');
                }
            })
        },
        //进度
        povertyPeo: '',
        povertyVillage: '',
        povertyCounty: '',
        progressValue: '',
        progressYear: common.toPercent((5 - (2020 - new Date(parseInt(CUR_DATE)).getFullYear())) / 5, 2),
        progressFun: function(){
            $.ajax({
                url: CONTEXTPATH + '/index/queryFpjdjk.do',
                type: 'POST',
                dataType: 'JSON',
                success: function(res){
                    count++;
                    vm.handle();
                    var data = res.data;
                    if (!data){
                        vm.set('povertyPeo', 0);
                        vm.set('povertyVillage', 0);
                        vm.set('povertyCounty', 0);
                        vm.set('progressValue', '0%');
                    } else {
                        vm.set('povertyPeo', !data.pkrk ? '' : data.pkrk);
                        vm.set('povertyVillage', !data.pkc ? '' : data.pkc);
                        vm.set('povertyCounty', !data.pkx ? '' : data.pkx);
                        vm.set('progressValue', !data.fpjd ? '' : (data.fpjd + '%'));
                    }
                },
                error: function(){
                    count++;
                    vm.handle();
                    util.tip('数据异常', 'danger');
                }
            })
        },
        //扶贫主体
        povertySubject: function(code){
            $.ajax({
                url: CONTEXTPATH + '/index/queryhelpBody.do',
                type: 'POST',
                data: {
                    code: code
                },
                dataType: 'JSON',
                success: function(res){
                    count++;
                    vm.handle();
                    if (res.status){
                        var data = res.data;
                        $.map(data, function(item){
                            item.bfdwsl = parseInt(item.bfdwsl);
                            item.zcgzdsl = parseInt(item.zcgzdsl);
                            item.bfzrrsl = parseInt(item.bfzrrsl);
                        });
                        paint.drawSigRank('subjectItem1','bfdwsl','个', data);
                        paint.drawSigRank('subjectItem2','zcgzdsl','个', data);
                        paint.drawSigRank('subjectItem3','bfzrrsl','人', data);
                    }
                },
                error: function(){
                    count++;
                    vm.handle();
                    util.tip('数据异常', 'danger');
                }
            })
        },
        //脱贫成效
        povertyEffect: function(code){
            $.ajax({
                url: CONTEXTPATH + '/index/queryTpcx.do',
                type: 'POST',
                data: {
                    code: code
                },
                dataType: 'JSON',
                success: function(res){
                    count++;
                    vm.handle();
                    if (res.status){
                        var data = res.data;
                        $.map(data, function(item){
                            item.tprksl = parseInt(item.tprksl);
                            item.pkhrjsr = parseInt(item.pkhrjsr);
                            item.pkfsl = parseInt(item.pkfsl);
                        });
                        paint.drawSigLine('effectItem1','tprksl','万人', data);
                        paint.drawSigLine('effectItem2','pkhrjsr','元', data);
                        paint.drawSigLine('effectItem3','pkfsl','%', data);
                    }
                },
                error: function(){
                    count++;
                    vm.handle();
                    util.tip('数据异常', 'danger');
                }
            })
        },
        //帮扶项目
        projectSource: fly.dataSource({
            read: {
                url: CONTEXTPATH + '/index/queryhelpProject.do',
                //url: baseUrl + '/mock/getProjectList.json',
                type: 'POST',
                dataType: 'JSON',
                dataFilter: function(res){
                    count++;
                    vm.handle();
                    res = fly.evalJSON(res);
                    if (res.status) {
                        var data = res.data;
                        $.map(data, function(item){
                            item.ico = item.lxbm;
                        });
                        return fly.toJSON(data);
                    } else {                        
                        util.tip('数据异常', 'danger');
                    }
                }
            }
        }),
        //脱贫成效TOP榜
        povertyRankSource: fly.dataSource({
            read: {
                url: CONTEXTPATH + '/index/queryTpcxTop.do',
                //url: baseUrl + '/mock/getPovertyTop.json',
                type: 'POST',
                dataType: 'JSON',
                dataFilter: function(res){
                    count++;
                    vm.handle();
                    res = fly.evalJSON(res);
                    if (res.status) {
                        var data = res.data;
                        return fly.toJSON(data);
                    } else {
                        util.tip('数据异常', 'danger');
                    }
                }
            }
        }),
        //事件对象
        eventFun: function(){
            //切换事件
            $('#panelSubjctTab').on('click', 'span',function(){
                var _li = $('#panelSubjctTab').find('span');
                _li.removeClass('active');
                $(this).addClass('active');
                $('.subject-item').eq($(this).index()).addClass('subject-item-active').siblings().removeClass('subject-item-active');
            });
            $('#panelEffectTab').on('click', 'span',function(){
                var _li = $('#panelEffectTab').find('span');
                _li.removeClass('active');
                $(this).addClass('active');
                $('.effect-item').eq($(this).index()).addClass('effect-item-active').siblings().removeClass('effect-item-active');
            });
            $('#panelRanktopTab').on('click', 'span',function(){
                var _li = $('#panelRanktopTab').find('span');
                _li.removeClass('active');
                $(this).addClass('active');
                $('.ranktop-item').eq($(this).index()).addClass('ranktop-item-active').siblings().removeClass('ranktop-item-active');
            });
            $('#panelFundTab').on('click', 'span',function(){
                var _li = $('#panelFundTab').find('span');
                _li.removeClass('active');
                $(this).addClass('active');
                $('.fund-item').eq($(this).index()).addClass('fund-item-active').siblings().removeClass('fund-item-active');
            });

            //当前年
            var myDate = new Date(parseInt(CUR_DATE));
            var currentYear = myDate.getFullYear();
            $('#yearList').children('span').each(function(){
                if ($(this).text() === currentYear.toString()){
                    $(this).addClass('active');
                }
            });

            //倒计时
            function checkTime(i, isDay){
                if (!isDay) {
                    i = (i < 10) ? '0' + i : i
                } else {
                    if (i < 1000 && i >= 100){
                        i = '0' + i;
                    } else if (i < 100 && i >= 10){
                        i = '00' + i
                    } else if (i < 10) {
                        i = '000' + i
                    }
                }
                return i; 
            } 
            var ts = new Date(2020,11,30,23,59,59),
                ls = ts - parseInt(CUR_DATE),
                dd = checkTime(parseInt(ls / 1000 / 60 / 60 / 24 , 10),true),
                hh = checkTime(parseInt(ls / 1000 / 60 / 60 % 24 , 10)),
                mm = checkTime(parseInt(ls / 1000 / 60 % 60, 10)),
                ss = checkTime(parseInt(ls / 1000 % 60, 10));            
            $("#countdown").countdown({
                image: CONTEXTPATH + '/resources/js/plugins/countdown/img/digits.png',
                startTime: dd + ':' + hh + ':' + mm + ':' + ss
            });
        },
        //ajax计数
        handle: function(){
            if (count === maxAjaxNum) {
                util.removeMask();
            }
        },
        //重新加载数据
        reloadData: function(name,num,code){
            // 清空容器对象
            $('#fundItem1').empty();
            $('#fundItem2').empty();
            $('#fundItem3').empty();
            $('#subjectItem1').empty();
            $('#subjectItem2').empty();
            $('#subjectItem3').empty();
            $('#effectItem1').empty();
            $('#effectItem2').empty();
            $('#effectItem3').empty();
            $('#effectItem1').empty();
            count = 0;
            maxAjaxNum = num;
            // 设置当前页面code
            vm.set('currentCode', code);
            vm.set('codeName', name);
            vm.vmInitChange(code);
        },
        //切换市初始化
        vmInitChange: function(code){
            util.mask();
            vm.progressFun();
            vm.povertyFund(code);
            vm.povertySubject(code);
            vm.povertyEffect(code);
            vm.projectSource.filter({code:code});
            vm.povertyRankSource.filter({code:code});
        },
        //初始化
        vmInit: function(code){
            util.mask();
            vm.progressFun();
            vm.povertyMap(code);
            vm.povertyFund(code);
            vm.povertySubject(code);
            vm.povertyEffect(code);
            vm.projectSource.filter({code:code});
            vm.povertyRankSource.filter({code:code});
        }
    });
    fly.bind('#leadCont', vm);
    $(function () {
        vm.vmInit(proveCode);
        gvm.loadMsgNum();
        gvm.loadMsgList();
        gvm.loadNav();
        gvm.dropEvent();
        uvm.loadUvm();
        uvm.uploadImg();
        vm.eventFun();
    });
});
