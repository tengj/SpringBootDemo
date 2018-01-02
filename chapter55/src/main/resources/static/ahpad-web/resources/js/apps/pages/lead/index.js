require.config(requireConfig);
require(['jquery',
    'fly',
    'common',
    'util',
    'message',
    '../apps/pages/lead/paint-lib',
    '../apps/pages/head',
    '../plugins/raphael.min',
    '../apps/pages/lead/map-svg'
], function($, fly, common, util, message, paint) {

    var baseUrl = CONTEXTPATH + '/resources',
        proveCode = '340000000000',
        proveName = '安徽省',
        count = 0,
        maxAjaxNum = 6;

    // 创建基本视图对象
    var vm = window.vm = fly.observable({
        emptyVisi: true,
        // 主菜单
        leadNav: fly.dataSource({
            data: []
        }),
        currentCode: '',
        codeName: '安徽省',
        //作战目标
        fightGoal: function(code){
            $.ajax({
                url: CONTEXTPATH + '/homepage/queryTargetData',
                type: 'POST',
                data: {
                    areaCode: code
                },
                dataType: 'JSON',
                success: function(res){
                    count++;
                    vm.handle();
                    var resData = res.data;
                    for (var item in resData){
                        vm.set(item, common.formatNumber(resData[item]));
                    }
                },
                error: function(){
                    count++;
                    vm.handle();
                }
            })
        },
        //作战目标
        fightTeam: function(code){
            $.ajax({
                url: CONTEXTPATH + '/homepage/queryCombatTroopsData',
                type: 'POST',
                data: {
                    areaCode: code
                },
                dataType: 'JSON',
                success: function(res){
                    count++;
                    vm.handle();
                    var resData = res.data;
                    for (var item in resData){                        
                        vm.set(item, common.formatNumber(resData[item]));
                    }
                },
                error: function(){
                    count++;
                    vm.handle();
                }
            })
        },
        //地图钻取
        maplev1: true,
        maplev2: false,
        povertyMap: function (pracityCode) {
            drawAnhui('National');
            function drawAnhui(level) {
                var imgPersonSrc = baseUrl+'/img/lead/icon-person.png';
                var imgStarSrc = baseUrl+'/img/lead/icon-star.png';
                var R = Raphael("anhui", 520, 680);
                //调用绘制地图方法
                paintMap(R);
                var textAttr = {"fill": "#000","font-size": "16px","font-weight": "bold","text-anchor":"middle"},
                    labentextAttr = {"fill": "#000","font-size": "12px"},
                    numberAttr = {"fill": "#fff","font-size": "16px","font-weight": "bold","text-anchor":"middle"},
                    circleAttr = {"fill": "#f00","stroke": "#fff","stroke-width": 2},
                    rectAttr = {"fill": "#ff8956","stroke": "#ff8956"},
                    mapTransAtt = {"fill": "#fff","stroke": "transparent","cursor":"pointer","opacity": 0};               

                var data = [],
                    numMap = [];
                common.ajaxRequest(CONTEXTPATH + '/homepage/queryProvinceMapData', {
                    areaCode: pracityCode
                }, function (res) {
                    if (res.status) {
                        data = res.data;
                        numMap = res.data;
                        for (var state in anhui) {
                            if(anhui.hasOwnProperty(state)){
                                (function (st, state) {
                                    var current = null;
                                    for (var city in data){
                                        if(data.hasOwnProperty(city)){
                                            if (data[city].cityName == anhui[state]['name']){
                                                anhui[state].cdata = data[city];
                                                anhui[state].citycode = data[city].cityCode;
                                                current = data[city];
                                                break;
                                            }
                                        }
                                    }
                                    //获取当前图形的中心坐标
                                    var xx = st.getBBox().x + (st.getBBox().width / 2);
                                    var yy = st.getBBox().y + (st.getBBox().height / 2);
                                    var fixCX = 20; //圆圈的位置偏移
                                    var fixRX = 10; //红色圆角矩形的位置偏移
                                    //设计根据数字大小自动宽度
                                    var numBgWidth = '',
                                        currentNum = current != null ? current.num : 0;
                                    numBgWidth = 28 + (currentNum.toString().length) * 12;

                                    //***修改部分地图文字偏移坐标
                                    switch (anhui[state]['name']) {
                                        case "淮北市":
                                            xx -= 20;
                                            yy += 10;
                                            break;
                                        case "亳州市":
                                            xx -= 16;
                                            yy += 20;
                                            break;
                                        case "芜湖市":
                                            xx += 16;
                                            yy -= 15;
                                            break;
                                        case "合肥市":
                                            xx -= 10;
                                            yy -= 10;
                                            break;
                                        case "六安市":
                                            xx -= 10;
                                            yy += 10;
                                            break;
                                        case "滁州市":
                                            xx -= 15;
                                            yy += 30;
                                            break;
                                        case "蚌埠市":
                                            xx -= 30;
                                            yy += 5;
                                            break;
                                        case "淮南市":
                                            xx -= 10;
                                            break;
                                        case "宿州市":
                                            xx += 5;
                                            yy += 20;
                                            break;
                                        case "阜阳市":
                                            //xx += 10;
                                            yy += 25;
                                            break;
                                        case "安庆市":
                                            xx -= 15;
                                            yy -= 20;
                                            break;
                                        case "池州市":
                                            xx -= 15;
                                            yy -= 25;
                                            break;
                                        case "黄山市":
                                            xx -= 25;
                                            yy += 15;
                                            break;
                                        case "宣城市":
                                            xx -= 25;
                                            // yy += 15;
                                            break;
                                        case "铜陵市":
                                            xx -= 25;
                                            // yy -= 5;
                                            break;
                                        case "马鞍山市":
                                            xx -= 15;
                                            yy += 5;
                                            break;
                                        default:
                                    }

                                    //写入文字
                                    anhui[state]['text'] = R.text((xx + fixCX), (yy + 20), anhui[state]['name']).attr(textAttr);
                                    anhui[state]['point'] = R.circle((xx + fixCX), yy, 4).attr(circleAttr);
                                    if (anhui[state].hasNation){
                                        anhui[state]['img'] = R.image( baseUrl + '/img/lead/icon-haspoverty.png', (xx + 10), yy - 10, 20, 20);
                                    }
                                    anhui[state]['numberBg'] = R.rect((xx + fixCX - (numBgWidth /2)), (yy - 32), numBgWidth, 22, 10).attr(rectAttr);
                                    //anhui[state]['numberBg'] = R.image(imgPersonSrc, (xx + fixCX + fixRX + 5), (yy - 8), 15, 16);
                                    anhui[state]['number'] = R.text((xx + fixCX), (yy - 20), currentNum).attr(numberAttr);
                                    // 绘制地图透明层，用于事件
                                    anhui[state]['click'] = R.path(st.attrs.path).attr(mapTransAtt);
                                    //区域点击事件
                                    anhui[state]['click'][0].onclick = function () {
                                        vm.set('maplev1', false);
                                        vm.set('maplev2', true);
                                        var CT = Raphael("city", 620, 680);
                                        //调用绘制地图方法
                                        switch (anhui[state]['name']) {
                                            case "淮北市":
                                                paintHuaibei(CT);
                                                glocityCode = anhui[state].citycode;
                                                drawCity(
                                                    CT,
                                                    huaibei,
                                                    glocityCode ? glocityCode : null
                                                );
                                                vm.reloadData(anhui[state]['name'],6,glocityCode);
                                                break;
                                            case "亳州市":
                                                paintBozhou(CT);
                                                glocityCode = anhui[state].citycode;
                                                drawCity(
                                                    CT,
                                                    bozhou,
                                                    glocityCode ? glocityCode : null
                                                );
                                                vm.reloadData(anhui[state]['name'],6,glocityCode);
                                                break;
                                            case "芜湖市":
                                                paintWuhu(CT);
                                                glocityCode = anhui[state].citycode;
                                                drawCity(
                                                    CT,
                                                    wuhu,
                                                    glocityCode ? glocityCode : null,
                                                    [["镜湖区", -10, 10], ["鸠江区", 5, 5]]
                                                );
                                                vm.reloadData(anhui[state]['name'],6,glocityCode);
                                                break;
                                            case "合肥市":
                                                paintHefei(CT);
                                                glocityCode = anhui[state].citycode;
                                                drawCity(
                                                    CT,
                                                    hefei,
                                                    glocityCode ? glocityCode : null,
                                                    [["庐阳区", 5, 10], ["蜀山区", -10, 5], ["肥西县", -20, 20], ["巢湖市", -20, 40]]
                                                );
                                                vm.reloadData(anhui[state]['name'],6,glocityCode);
                                                break;
                                            case "六安市":
                                                paintLiuan(CT);
                                                glocityCode = anhui[state].citycode;
                                                drawCity(
                                                    CT,
                                                    liuan,
                                                    glocityCode ? glocityCode : null,
                                                    [["庐阳区", 5, 10], ["蜀山区", -10, 5], ["肥西县", -20, 20], ["巢湖市", -20, 40]]
                                                );
                                                vm.reloadData(anhui[state]['name'],6,glocityCode);
                                                break;
                                            case "滁州市":
                                                paintChuzhou(CT);
                                                glocityCode = anhui[state].citycode;
                                                drawCity(
                                                    CT,
                                                    chuzhou,
                                                    glocityCode ? glocityCode : null,
                                                    [["南谯区", 0, 12],["凤阳县", 30, 20]]
                                                );
                                                vm.reloadData(anhui[state]['name'],6,glocityCode);
                                                break;
                                            case "蚌埠市":
                                                paintBengbu(CT);
                                                glocityCode = anhui[state].citycode;
                                                drawCity(
                                                    CT,
                                                    bengbu,
                                                    glocityCode ? glocityCode : null
                                                );
                                                vm.reloadData(anhui[state]['name'],6,glocityCode);
                                                break;
                                            case "淮南市":
                                                paintHuainan(CT);
                                                glocityCode = anhui[state].citycode;
                                                drawCity(
                                                    CT,
                                                    huainan,
                                                    glocityCode ? glocityCode : null,
                                                    [["田家庵区", 5, -10]]
                                                );
                                                vm.reloadData(anhui[state]['name'],6,glocityCode);
                                                break;
                                            case "宿州市":
                                                paintSuzhou(CT);
                                                glocityCode = anhui[state].citycode;
                                                drawCity(
                                                    CT,
                                                    suzhou,
                                                    glocityCode ? glocityCode : null,
                                                    [["田家庵区", 35, 10]]
                                                );
                                                vm.reloadData(anhui[state]['name'],6,glocityCode);
                                                break;
                                            case "阜阳市":
                                                paintFuyang(CT);
                                                glocityCode = anhui[state].citycode;
                                                drawCity(
                                                    CT,
                                                    fuyang,
                                                    glocityCode ? glocityCode : null,
                                                    [["庐阳区", 5, 10], ["蜀山区", -10, 5], ["肥西县", -20, 20], ["巢湖市", -20, 40]]
                                                );
                                                vm.reloadData(anhui[state]['name'],6,glocityCode);
                                                break;
                                            case "安庆市":
                                                paintAnqing(CT);
                                                glocityCode = anhui[state].citycode;
                                                drawCity(
                                                    CT,
                                                    anqing,
                                                    glocityCode ? glocityCode : null,
                                                    [["庐阳区", 5, 10], ["蜀山区", -10, 5], ["肥西县", -20, 20], ["巢湖市", -20, 40]]
                                                );
                                                vm.reloadData(anhui[state]['name'],6,glocityCode);
                                                break;
                                            case "池州市":
                                                paintChizhou(CT);
                                                glocityCode = anhui[state].citycode;
                                                drawCity(
                                                    CT,
                                                    chizhou,
                                                    glocityCode ? glocityCode : null,
                                                    [["庐阳区", 5, 10], ["蜀山区", -10, 5], ["肥西县", -20, 20], ["巢湖市", -20, 40]]
                                                );
                                                vm.reloadData(anhui[state]['name'],6,glocityCode);
                                                break;
                                            case "黄山市":
                                                paintHuangshan(CT);
                                                glocityCode = anhui[state].citycode;
                                                drawCity(
                                                    CT,
                                                    huangshan,
                                                    glocityCode ? glocityCode : null,
                                                    [["庐阳区", 5, 10], ["蜀山区", -10, 5], ["肥西县", -20, 20], ["巢湖市", -20, 40]]
                                                );
                                                vm.reloadData(anhui[state]['name'],6,glocityCode);
                                                break;
                                            case "宣城市":
                                                paintXuancheng(CT);
                                                glocityCode = anhui[state].citycode;
                                                drawCity(
                                                    CT,
                                                    xuancheng,
                                                    glocityCode ? glocityCode : null,
                                                    [["庐阳区", 5, 10], ["蜀山区", -10, 5], ["肥西县", -20, 20], ["巢湖市", -20, 40]]
                                                );
                                                vm.reloadData(anhui[state]['name'],6,glocityCode);
                                                break;
                                            case "铜陵市":
                                                paintTongling(CT);
                                                glocityCode = anhui[state].citycode;
                                                drawCity(
                                                    CT,
                                                    tongling,
                                                    glocityCode ? glocityCode : null,
                                                    [["铜陵县", 30, -30]]
                                                );
                                                vm.reloadData(anhui[state]['name'],6,glocityCode);
                                                break;
                                            case "马鞍山市":
                                                paintMaanshan(CT);
                                                glocityCode = anhui[state].citycode;
                                                drawCity(
                                                    CT,
                                                    maanshan,
                                                    glocityCode ? glocityCode : null,
                                                    [["庐阳区", 5, 10], ["蜀山区", -10, 5], ["肥西县", -20, 20], ["巢湖市", -20, 40]]
                                                );
                                                vm.reloadData(anhui[state]['name'],6,glocityCode);
                                                break;
                                            default:
                                        }
                                    }
                                })(anhui[state]['path'], state);
                            }
                        }
                    }
                    count++;
                    vm.handle();
                }, function () {
                    count++;
                    vm.handle();
                    fly.tip({
                        content: '数据异常',
                        css: 'warning',
                        delay: 2000
                    });
                });
            }

            /**
             * 城市区县设计
             * Author xinfan 2016/09/06
             * *****************************
             * CT 全局SVG容器
             * cityname 城市名称
             * movePoint 中心点坐标偏移量
             * *****************************
             */
            function drawCity(CT, cityname, areaCode, movePoint) {
                var positionX = document.getElementById("city").offsetWidth;
                var positionY = document.getElementById("city").offsetHeight;
                var imgPersonSrc = baseUrl+'/img/lead/icon-person.png';
                var imgStarSrc = baseUrl+'/img/lead/icon-star.png';

                var textAttr = {"fill": "#000", "font-size": "14px", "cursor": "text"},
                    // 中心圆颜色
                    circleAttr = {"fill": "#f00", "stroke": "#fff", "stroke-width": 2, "cursor": "pointer"},
                    circleHover = {"fill": "#2164bb", "stroke": "#9bc8fe", "stroke-width": 6, "cursor": "pointer"},
                    circleDftAttr = {"fill": "#f00","stroke": "#fff","stroke-width": 2},
                    circleRectAttr = {"fill": "#2164bb", "stroke": "#9bc8fe", "stroke-width": 4},
                    rectBoxAttr = {"fill": "#fff", "stroke": "#325dd7","fill-opacity":1},
                    rectLineAttr = {"fill": "#325dd7", "stroke": "#325dd7", "stroke-width": 2};
                var cityStateData = [];
                common.ajaxRequest(
                    CONTEXTPATH + '/homepage/queryCountyMapData', {
                    areaCode: areaCode ? areaCode : ''
                }, function (res) {
                    count++;
                    vm.handle();
                    if(res.status){
                        var stateLength = 0,
                            planNumArr = [],
                            maxPlanNum = '';
                        for (var state in cityname) {
                            if(cityname.hasOwnProperty(state)) {
                                (function (st, state) {
                                    var current = null;
                                    for (var countyname in res.data){
                                        if(res.data.hasOwnProperty(countyname)) {
                                            for (var i = 0; i < res.data[countyname].length; i++){
                                                if (res.data[countyname][i].countyName == cityname[state]['name'] && parseInt(res.data[countyname][i].year) === new Date(parseInt(CUR_DATE)).getFullYear()){
                                                    cityname[state].pdata = res.data[countyname];
                                                    cityname[state].pnum = parseInt(res.data[countyname][i].planPovertyNum);
                                                    cityname[state].pflag = parseInt(res.data[countyname][i].poorFlag);
                                                    planNumArr.push(cityname[state].pnum);
                                                    //返回当前市的区数量
                                                    stateLength += 1;
                                                }
                                            }
                                        }
                                    }
                                    //取得最大的计划脱贫数
                                    maxPlanNum = Math.max.apply(null, planNumArr);
                                    //获取当前图形的中心坐标
                                    var xx = st.getBBox().x + (st.getBBox().width / 2);
                                    var yy = st.getBBox().y + (st.getBBox().height / 2) - 10;
                                    var fixCX = 35; //圆圈的位置偏移
                                    var fixRX = 10; //红色圆角矩形的位置偏移

                                    //指定区县设置位置偏移，由外部传入区域、x轴偏移、y轴偏移
                                    if (movePoint) {
                                        var xp = '', yp = '', stateName = '';
                                        for (var i = 0; i < movePoint.length; i++) {
                                            xp = movePoint[i][1];
                                            yp = movePoint[i][2];
                                            stateName = movePoint[i][0];
                                            if (cityname[state]['name'] == stateName) {
                                                if (xp > 0) {
                                                    xx += Math.abs(xp);
                                                } else {
                                                    xx -= Math.abs(xp);
                                                }
                                                if (yp > 0) {
                                                    yy += Math.abs(yp);
                                                } else {
                                                    yy -= Math.abs(yp);
                                                }
                                            }
                                        }
                                    }

                                    var pointLineW = '',
                                        percentHot = '';
                                    if(!cityname[state].pflag){
                                        percentHot = 0;
                                    }else{
                                        if(cityname[state].pnum / maxPlanNum < 0.4 && cityname[state].pnum / maxPlanNum > 0){
                                            percentHot = 16;
                                        }else{
                                            if(cityname[state].pnum == 0 || maxPlanNum == 0){
                                                percentHot = 12;
                                            }
                                            else{
                                                percentHot = cityname[state].pnum / maxPlanNum * 40
                                            }
                                        }
                                    }
                                    //写入文字
                                    cityname[state]['hover'] = CT.circle(xx, yy, percentHot).attr({"fill": "#d9eeff", "stroke": "#2164bb","stroke-width": 2,'stroke-dasharray':['-'], "opacity": 0.8});
                                    cityname[state]['text'] = CT.text((xx - fixCX), yy, cityname[state]['name']).attr(textAttr);
                                    cityname[state]['point'] = CT.circle(xx, yy, !cityname[state].pflag ? 4 : 8).attr(!cityname[state].pflag ? circleDftAttr : circleHover);
                                    //初始化矩形宽高
                                    var rectWidth = 620,
                                        rectHeight = 240,
                                        rectXX, rectYY, diffXX, diffYY, lineXX, lineYY;
                                    //对象化矩形区域
                                    var rt = CT.set(),
                                        pt = CT.set(),
                                        xt = CT.set();
                                    //区域交互
                                    cityname[state]['point'].mouseover(function () {
                                        if(!cityname[state].pflag){
                                            return;
                                        }
                                        this.animate({"fill-opacity": 1, 'transform': "s1.3 1.3"}, 300);
                                        //计算矩形y坐标和点y坐标的差值
                                        //diffXX = positionX - xx - rectWidth;
                                        diffXX = positionX / 2;
                                        diffYY = positionY - rectHeight - yy - 50;
                                        //计算得出矩形的最终坐标
                                        //rectXX = diffXX >= 0 ? 10 : (xx - rectWidth > 0 ? 30 : positionX - rectWidth - 10);
                                        rectXX = diffXX >= xx + 40 ? 0 : positionX - rectWidth;
                                        rectYY = diffYY >= 0 ? yy + 50 : (yy - rectHeight > 0 ? yy - rectHeight - 60 : 90);
                                        //设计直线终点坐标
                                        lineXX = xx;
                                        lineYY = diffYY >= 0 ? rectYY + 15 : rectYY + rectHeight - 15;
                                        //对象化矩形
                                        var path0 = [
                                            'M', lineXX, ' ', diffYY >= 0 ? yy + 5 : yy - 5,
                                            'L', lineXX, ' ', lineYY
                                        ].join('');
                                        //矩形容器对象化
                                        rt.push(
                                            //矩形容器
                                            CT.rect(rectXX + 5, rectYY + 5, rectWidth - 10, rectHeight - 10, 10).attr(rectBoxAttr).animate({
                                                x: rectXX,
                                                y: rectYY,
                                                width: rectWidth,
                                                height: rectHeight
                                            }, 500, "elastic"),
                                            //直线
                                            CT.path(path0).attr(rectLineAttr),
                                            //容器内的圆点
                                            CT.circle(xx, lineYY, 1).attr(circleRectAttr).animate({
                                                "fill-opacity": 1,
                                                'transform': "s5 5"
                                            }, 400)
                                        );

                                        //获取数据
                                        var cityData = [],
                                            cloneCData = [],
                                            inData = [],
                                            planData = [];
                                        //判断是否有数据
                                        if(cityname[state].pdata){
                                            cityData = cityname[state].pdata;
                                            cloneCData = [].concat(cityname[state].pdata);
                                            //获取当前年
                                            var currYear = new Date(parseInt(CUR_DATE)).getFullYear();
                                            for (var i = 0; i < cityData.length; i++) {
                                                if (parseInt(cityData[i].year) === currYear){
                                                    cloneCData.splice(i, 1);
                                                    //本年计划及完成数据
                                                    inData = cityData[i];
                                                }
                                            }
                                            //来年计划数据
                                            planData = cloneCData;
                                            //第一个大饼图
                                            drawChart(CT, rectXX, rectYY, 1, inData, pt, true);
                                            //后面计划的小饼图
                                            drawChart(CT, rectXX, rectYY, 3, planData, xt, false);
                                        }else{
                                            fly.tip({
                                                content: "数据异常",
                                                css: 'info',
                                                delay: 2000
                                            });
                                        }

                                    }).mouseout(function () {
                                        this.animate({"fill-opacity": 0.8, 'transform': "s1 1"}, 300);
                                        setTimeout(function(){
                                            rt.remove();
                                            pt.remove();
                                            xt.remove();
                                        },100)
                                    });
                                })(cityname[state]['path'], state);
                            }
                        }
                    }else{
                        fly.tip({
                            content: '数据异常',
                            css: 'danger',
                            delay: 2000
                        });
                    }
                }, function () {
                    count++;
                    vm.handle();
                    fly.tip({
                        content: '数据异常',
                        css: 'warning',
                        delay: 2000
                    });
                })
            }

            /**
             * 地图钻取到市级后画出饼状图
             * Author xinfan 2016/09/06
             * *****************************
             * CT 全局SVG容器
             * rectXX,rectYY 矩形SVG的x,y坐标
             * num 决定画几个饼状图
             * data 数据模型
             * xt 画布中的svg对象
             * pieFlag 决定是否为主图
             * *****************************
             */
            function drawChart(CT, rectXX, rectYY, num, data, xt, pieFlag) {
                var perData = [],
                    pPath = [],
                    pt = [],
                //UI效果预设
                    pieWdRed = {"fill": "#4c9efd", "stroke": "none", "opacity": 0, "font-size": 22, "text-anchor": "end"},
                    circleWdGray = {"fill": "#666", "stroke": "none","opacity": 0,"font-size": 12,"text-anchor": "middle"},
                    circleWdRed = {"fill": "#4c9efd","stroke": "none","opacity": 0,"font-size": 16,"text-anchor": "middle"},
                    pieAttrRed = {"stroke-width": 2, "stroke": "none", "fill": "#4c9efd"},
                    pieAttrBlue = {"stroke-width": 2, "stroke": "none", "fill": "#34BFDC"},
                    pieAttrGray = {"stroke-width": 2, "stroke": "none", "fill": "#CCC"},
                    pieAttrWhite = {"stroke-width": 2, "stroke": "none", "fill": "#FFF"},
                    lineWdRed = {"fill": "#4c9efd", "stroke": "none", "opacity": 0, "font-size": 16, "text-anchor": "end"},
                    lineWdSRed = {"fill": "#4c9efd", "stroke": "none", "opacity": 0, "font-size": 12, "text-anchor": "end"},
                    lineWdBlue = {"fill": "#4c9efd", "stroke": "none", "opacity": 0, "font-size": 12, "text-anchor": "end"},
                    lineWdGray = {"fill": "#CCC", "stroke": "none", "opacity": 0, "font-size": 12, "text-anchor": "end"},
                    lineRed = {"stroke": "#4c9efd"},
                    lineBlue = {"stroke": "#4c9efd"},
                    lineGray = {"stroke": "#CCC"},
                //半径预设
                    r1 = 40,
                    r2 = 60,
                    r3 = 20,
                    r4 = 34,
                //动画预设
                    fadeIn = [{opacity: 1}, 100],
                    fadeInEff = fadeIn[0],
                    fadeInTim = fadeIn[1];

                //根据参数判断为第一个大圆
                if (pieFlag && num == 1) {
                    var xline = 120,
                        yline = [45, 5],
                        perData0 = data.planPovertyNum == 0 ? 0.0001 : data.realPovertyNum / data.planPovertyNum,
                        pPath0 = drawPath(rectXX + 20, rectYY + 15, r1, r2, xline, yline, perData0);
                    xt.push(
                        //已脱贫（红）
                        CT.path(pPath0[0]).attr(pieAttrRed),//环状饼图
                        CT.path(pPath0[2]).attr({"stroke": "#4c9efd"}),//线
                        CT.text(pPath0[4][0], pPath0[4][1], common.getNowFormatDate().substr(0,4) + "年\n已脱贫数量").attr(lineWdRed), //字上
                        CT.text(pPath0[6][0], pPath0[6][1], common.formatNumber(data.realPovertyNum)).attr(pieWdRed), //字下
                        CT.circle(pPath0[8], pPath0[9] + r2, r1).attr(pieAttrWhite),//内圆
                        CT.text(pPath0[8], pPath0[9] + r2 - 13, "计划脱贫数").attr(circleWdGray),
                        CT.text(pPath0[8], pPath0[9] + r2 + 5, common.formatNumber(data.planPovertyNum)).attr(circleWdRed),
                        //未脱贫（灰）
                        CT.path(pPath0[1]).attr(pieAttrGray)//环状饼图
                    ).attr({"opacity": 0}).animate(fadeInEff, fadeInTim);
                } else { //判断为后面的小圆
                    var xline = 70,
                        yline = [40, 10],
                        rectXXNum = rectXX + 160;
                    for (var i = 0; i <= num; i++) {
                        pt[i] = xt;
                        perData[i] = data[i].planPovertyNum == 0 ? 0.0001 : 0;
                        pPath[i] = drawPath(rectXXNum, rectYY + 70, r3, r4, xline, yline, perData[i]);
                        rectXXNum += 100;

                        // 判断后三个显示文字、颜色
                        var realPNum = data[i].realPovertyNum,
                            lastLine = '',
                            lastText = '',
                            lastStyle = '',
                            lastPieStyle = '',
                            lastNum = '';
                        //计划
                        if (realPNum === 0) {
                            lastNum = data[i].planPovertyNum;
                            lastLine = data[i].planPovertyNum == 0 ? lineGray : lineBlue;
                            lastText = data[i].year + (data[i].planPovertyNum === 0 ? "年\n没有计划" : "年\n计划脱贫数量");
                            lastStyle = data[i].planPovertyNum == 0 ? lineWdGray : lineWdBlue;
                            lastPieStyle = data[i].planPovertyNum == 0 ? pieAttrGray : pieAttrBlue;
                        } else {
                            //已脱贫
                            lastNum = realPNum;
                            lastLine = lineRed;
                            lastText = data[i].year + "年\n已脱贫数量";
                            lastStyle = lineWdSRed;
                            lastPieStyle = pieAttrRed;
                        }

                        pt[i].push(
                            //环状饼图
                            CT.path(pPath[i][0]).attr(lastPieStyle),
                            CT.path(pPath[i][2]).attr(lastLine),//线
                            CT.circle(pPath[i][8], pPath[i][9] + r4, r3).attr(pieAttrWhite),//内圆
                            CT.text(pPath[i][4][0],pPath[i][4][1],lastText).attr(lastStyle),//字上
                            //data[i].year + ()).attr(data[i].planPovertyNum == 0 ? lineWdGray : lineWdBlue),
                            CT.text(pPath[i][6][0], pPath[i][6][1], lastNum).attr(lastStyle), //字下
                            //未脱贫（灰）
                            CT.path(pPath[i][1]).attr(lastPieStyle)//环状饼图
                        ).attr({"opacity": 0}).animate(fadeInEff, fadeInTim);
                    }
                }
                return xt;
            }

            /**
             * 构建饼状图的坐标、路径
             * Author xinfan 2016/09/06
             * *****************************
             * rectXX,rectYY 矩形SVG的x,y坐标
             * r1,r2 圆饼的外径、内径
             * xline,yline 区别大小饼状图的线条长度及文字大小
             * percent 数据百分比
             * *****************************
             */
            function drawPath(rectXX, rectYY, r1, r2, xline, yline, percent) {
                var drawPercent = percent >= 1 ? 0.9999 : (percent == 0 ? 0.0001 : percent);
                //开始计算各点的位置，见后图
                //r1是内圆半径，r2是外圆半径
                var PI = Math.PI,
                    p1 = {   //起始位置
                        x: rectXX + 60,
                        y: rectYY + 80
                    },
                    p4 = {  // 终点
                        x: p1.x,
                        y: p1.y + r2 - r1
                    },
                    p2 = {  //外圆弧
                        x: p1.x - r2 * Math.sin(2 * PI * (1 - drawPercent)),
                        y: p1.y + r2 - r2 * Math.cos(2 * PI * (1 - drawPercent))
                    },
                    p3 = {  //内圆弧
                        x: p4.x - r1 * Math.sin(2 * PI * (1 - drawPercent)),
                        y: p4.y + r1 - r1 * Math.cos(2 * PI * (1 - drawPercent))
                    },
                //饼
                    pathP0 = [
                        'M', p1.x, ' ', p1.y,
                        'A', r2, ' ', r2, ' 0 ', percent > 0.5 ? 1 : 0, ' 1 ', p2.x, ' ', p2.y,
                        'L', p3.x, ' ', p3.y,
                        'A', r1, ' ', r1, ' 0 ', percent > 0.5 ? 1 : 0, ' 0 ', p4.x, ' ', p4.y,
                        'Z'
                    ].join(''),
                    pathP1 = [
                        'M', p1.x, ' ', p1.y,
                        'A', r2, ' ', r2, ' 1 ', percent > 0.5 ? 0 : 1, ' 0 ', p2.x, ' ', p2.y,
                        'L', p3.x, ' ', p3.y,
                        'A', r1, ' ', r1, ' 1 ', percent > 0.5 ? 0 : 1, ' 1 ', p4.x, ' ', p4.y,
                        'Z'
                    ].join(''),
                //线
                    pathL0 = [
                        'M', drawPercent <= 0.09 ? p1.x - r2 * Math.sin(2 * PI * (1 - drawPercent / 2)) : p1.x + 10, ' ', drawPercent <= 0.09 ? p1.y + 2 : p1.y + 10,
                        'L', drawPercent <= 0.09 ? p1.x + 10 : p1.x + 20, ' ', p1.y - 20,
                        'L', drawPercent <= 0.09 ? p1.x + xline + 10 : p1.x + xline + 10, ' ', p1.y - 20
                    ].join(''),
                    pathL1 = [
                        'M', drawPercent >= 0.91 ? p1.x - r2 * Math.sin(2 * PI * (drawPercent / 2)) : p4.x - 20, ' ', drawPercent >= 0.91 ? p4.y - 22 : p4.y - 15,
                        'L', drawPercent >= 0.91 ? p1.x - 20 : p1.x - 30, ' ', p1.y - 10,
                        'L', drawPercent >= 0.91 ? p1.x - (xline - 30) : p1.x - (xline - 20), ' ', p1.y - 10
                    ].join(''),
                //线字
                    pathL0wd = [drawPercent <= 0.09 ? p1.x + xline + 10 : p1.x + xline + 10, p1.y - yline[0]],
                    pathL1wd = [drawPercent >= 0.91 ? p1.x - (xline - 30) : p1.x - (xline - 20), p1.y - yline[0]],
                //饼字
                    pathP0wd = [drawPercent <= 0.09 ? p1.x + xline + 10 : p1.x + xline + 10, p1.y - yline[1]],
                    pathP1wd = [drawPercent >= 0.91 ? p1.x - (xline - 30) : p1.x - (xline - 20), p1.y - yline[1]];
                return [
                    pathP0, //饼图1 obj[0]
                    pathP1, //饼图2 obj[1]
                    pathL0, //线1 obj[2]
                    pathL1, //线2 obj[3]
                    pathL0wd, //线字1 obj[4]
                    pathL1wd, //线字2 obj[5]
                    pathP0wd, //饼字1 obj[6]
                    pathP1wd, //饼字2 obj[7]
                    p1.x, // obj[8]
                    p1.y // obj[9]
                ]
            }
        },
        //致贫原因
        povertyReason: function (pracityCode) {
            var data = [];
            common.ajaxRequest(CONTEXTPATH + '/homepage/querypovertyCauses', {
                code:pracityCode
            }, function (res) {
                count++;
                vm.handle();
                if (res.status) {
                    data = res.data;
                    paint.povertyResRank('povertyReason', data);
                }
            }, function () {
                count++;
                vm.handle();
                fly.tip({
                    content: "数据异常",
                    css: 'warning',
                    delay: 2000
                });
            });
        },
        //贫困属性统计
        normalPoverty: '',
        normalPovertyed: '',
        normalScale: '',
        lowPoverty: '',
        lowPovertyed: '',
        lowScale: '',
        fivePoverty: '',
        fivePovertyed: '',
        fiveScale: '',        
        //切换属性事件
        povertyTabEvt: function(){
            $(document).on('click', '.tab-item', function(){
                $('.tab-item').removeClass('active');
                if ($(this).hasClass('active')) {
                    return
                } else {
                    $(this).addClass('active');
                    var type = $(this).data('type');
                    var data = [].concat(vm.poverTyAttrData.view().toJSON());
                    $('#povertyAttr').empty();
                    switch (type) {
                        case 'normal':
                            paint.povertyAttrRank('povertyAttr',data[0])
                            break;
                        case 'low':
                            paint.povertyAttrRank('povertyAttr',data[1])
                            break;
                        case 'five':
                            paint.povertyAttrRank('povertyAttr',data[2])
                            break;
                    }
                }
            });
        },
        poverTyAttrData: fly.dataSource({
            data: []
        }),
        /**
         * 贫困户属性绘制
         * @code 当前行政编码
         * @param 绘制参数
         */
        povertyAttr: function (code, callback) {
            common.ajaxRequest(CONTEXTPATH + '/homepage/queryPoorProperties',{
                code: code
            },function(res){
                count++;
                vm.handle();
                if (res.status) {
                    data = res.data;
                    //缓存数据
                    vm.poverTyAttrData.data(data);
                    for (var i = 0; i < data.length; i++){
                        var percentRes = parseFloat((data[i].outPovertyNum / data[i].totality).toPrecision(12));
                        data[i].percent = (percentRes == 0 ? 0 : (percentRes < 0.0001 ? 0.0001 : percentRes));
                    }

                    vm.set('normalPoverty', data[0].totality);
                    vm.set('normalPovertyed', data[0].outPovertyNum);
                    vm.set('normalScale', data[0].totality == 0 ? '0%' : common.toPercent(data[0].percent, 2));
                    vm.set('lowPoverty', data[1].totality);
                    vm.set('lowPovertyed', data[1].outPovertyNum);
                    vm.set('lowScale', data[1].totality == 0 ? '0%' : common.toPercent(data[1].percent, 2));
                    vm.set('fivePoverty', data[2].totality);
                    vm.set('fivePovertyed', data[2].outPovertyNum);     
                    vm.set('fiveScale', data[2].totality == 0 ? '0%' :  common.toPercent(data[2].percent, 2));
                    callback && callback(data);             
                }
            },function(){
                count++;
                vm.handle();
                fly.tip({
                    content: '数据异常',
                    css: 'warning',
                    delay: 2000
                });
            });
        },
        
        //扶贫脱贫情况绘制
        povertyInfo: function (code) {
            var data = [];
            common.ajaxRequest(
                CONTEXTPATH + '/homepage/queryPovertySituationPopulation', {
                code:code
            }, function (res) {
                count++;
                vm.handle();
                if (res.status) {
                    data = res.data;
                    var currentYear = new Date(parseInt(CUR_DATE)).getFullYear();
                    //　绘制柱状图数据
                    paint.drawMutRank('povertyInfo', data, currentYear);
                }
            }, function(){                
                count++;
                vm.handle();
                fly.tip({
                    content: '数据异常',
                    css: 'warning',
                    delay: 2000
                });
            });
        },
        //新闻模块
        moreAchieve: function(){
            window.location.href = CONTEXTPATH + '/indexlist.do?href=achieve';
        },
        fhywSource: fly.dataSource({
            data: []
        }),
        zcfgSource: fly.dataSource({
            data: []
        }),
        fpxmSource: fly.dataSource({
            data: []
        }),
        achieveData: function(){
            $.ajax({
                url: CONTEXTPATH + '/system/notice/bigDeedList',
                type: 'POST',
                dataType: 'JSON',
                success: function(res){           
                    count++;
                    vm.handle();
                    if (res.status){
                        for (var item in res.data){
                            $.map(res.data[item], function(i){
                                i.title = common.cutStr(i.noticeTitle,42);
                            })
                        }
                        vm.fhywSource.data(res.data.fhyw);
                        vm.fpxmSource.add(res.data.fpxm[0]);
                        vm.zcfgSource.add(res.data.zcfg[0]);
                    }
                },
                error: function(){
                    count++;
                    vm.handle();
                    fly.tip({
                        content: '数据异常',
                        css: 'warning',
                        delay: 2000
                    });
                }
            })
        },
        openMsg: function (e) {
            var url = CONTEXTPATH + '/pages/msg-view.do?noticeId=' + e.data.noticeId;
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
        //扶贫项目情况
        projectInfo: function(code){
            $.ajax({
                url: CONTEXTPATH + '/homepage/getProjectMsg',
                type: 'POST',
                data: {
                    code: code
                },
                dataType: 'JSON',
                success: function(res){
                    count++;
                    vm.handle();
                    if (res.status){
                        var data = fly.evalJSON(res.data).data;
                        vm.set('emptyVisi', data.length === 0 ? false : true);
                        $('#projectTab').empty();
                        $('#projectCont').empty();
                        for (var i = 0; i < data.length; i++){
                            data[i].percent = parseFloat(parseFloat((data[i].helpMoney / data[i].invest).toPrecision(12)).toFixed(2));
                            var _li = ('<li class="'+ (i === 0 ? 'active' : '') + '" style="width: ' + (100 / data.length) + '%">' + data[i].projectTypeName + '</li>');
                            var _tabCont = ('<div id="projectItem' + (i + 1) + '" class="project-item '+ (i === 0 ? 'project-item-active' : '') + '"></div>');
                            $('#projectTab').append(_li);
                            $('#projectCont').append(_tabCont);
                            paint.drawMutcicle('projectItem' + (i+1), data[i]);
                        }
                    }
                },
                error: function(){
                    count++;
                    vm.handle();
                    fly.tip({
                        content: '数据异常',
                        css: 'warning',
                        delay: 2000
                    });
                }
            })
        },
        //脱贫成效排名
        moreRank: function(){
            window.location.href = CONTEXTPATH + '/indexlist.do?href=effect-ranking';
        },
        povertyRank: fly.dataSource({
            read: {
                url: CONTEXTPATH + '/homepage/getCountryList',
                type: 'POST',
                dataType: 'JSON',
                dataFilter: function(res){
                    count++;
                    vm.handle();
                    res = fly.evalJSON(res);
                    if (res.status){
                        var data = fly.evalJSON(res.data).data;
                        $.map(data, function(i){
                            i.percent = common.toPercent(i.ratio / 100, 2);
                            i.overType = (i.ratio > 100) ? '超额完成' : '完成率';
                        });
                        //根据投入比例进行排序
                        if (data.length > 0){
                            data.sort(common.sortby('ratio'));
                        }
                        return fly.toJSON(data);
                    }
                },
                error: function(){
                    count++;
                    vm.handle();
                    fly.tip({
                        content: '数据异常',
                        css: 'warning',
                        delay: 2000
                    });
                }
            }
        }),
        //城市地图返回事件
        cityGoback: function(){
            vm.set('maplev1', true);
            vm.set('maplev2', false);
            $('#city').children('svg').remove();
            vm.reloadData(proveName,6,proveCode);
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
            $('#povertyReason').empty();
            // 清除贫困户属性统计
            $('#povertyAttr').empty();
            $('#povertyAttr').next().find('.tab-item').removeClass('active').stop().parent().find('[data-type=normal]').addClass('active');
            
            $('#povertyInfo').empty();
            $('#projectCont').find('.project-item').empty();
            count = 0;
            maxAjaxNum = num;
            // 设置当前页面code
            vm.set('currentCode', code);
            vm.set('codeName', name);
            vm.set('codeNameSmall', name);
            vm.vmInitChange(code);
        },
        //切换市初始化
        vmInitChange: function(code){
            util.mask();
            vm.fightGoal(code);
            vm.fightTeam(code);
            vm.povertyReason(code);
            // 贫困户属性初始化
            vm.set('currentCode', code);
            vm.povertyAttr(code, function(data){                
                //初始化时绘制数据
                paint.povertyAttrRank('povertyAttr',data[0]);
            });
            vm.povertyTabEvt();
            // 扶贫脱贫情况 
            vm.povertyInfo(code);
            // 扶贫项目情况 
            vm.projectInfo(code);
        },
        //初始化
        vmInit: function(code){
            util.mask();
            vm.povertyMap(code);
            vm.fightGoal(code);
            vm.fightTeam(code);
            vm.povertyReason(code);
            // 贫困户属性初始化
            vm.set('currentCode', code);
            vm.povertyAttr(code, function(data){                
                //初始化时绘制数据
                paint.povertyAttrRank('povertyAttr',data[0]);
            });
            vm.povertyTabEvt();
            // 扶贫脱贫情况 
            vm.povertyInfo(code);
            // 扶贫项目情况 
            vm.projectInfo(code);
            // 大事记
            vm.achieveData();
            // 脱贫成效排名
            vm.povertyRank.fetch();
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

        //切换事件 安徽省扶贫项目情况 tab切换
        $('#projectTab').on('click', 'li',function(){
            var _li = $('#projectTab').find('li');
            _li.removeClass('active');
            $(this).addClass('active');
            $('.project-item').eq($(this).index()).addClass('project-item-active').siblings().removeClass('project-item-active');
        });
    });
});
