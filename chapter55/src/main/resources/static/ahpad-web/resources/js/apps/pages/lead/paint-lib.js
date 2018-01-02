define([
    'jquery',
    'fly',
    'common'
], function ($, fly, common) {
    var paint = {};
    var baseUrl = CONTEXTPATH + '/resources';
    /**
     * 绘制省地图，城市点击业务使用@callback处理
     * @element DOM容器
     * @data 渲染数据
     * @province 行政区划外部静态数据
     * @showNation 是否显示国家级贫困县中心五角星
     * @callback 回调函数
     */
    paint.drawProvince = function (element, data, province, showNation, callback) {
        var RWidth = document.getElementById(element).offsetWidth,
            RHeight = document.getElementById(element).offsetHeight,
            R = new Raphael(element, RWidth, RHeight);

        var textAttr = { "fill": "#000", "font-size": "16px", "font-weight": "bold", "text-anchor": "middle" },
            labentextAttr = { "fill": "#000", "font-size": "12px" },
            circleAttr = { "fill": "#f00", "stroke": "#fff", "stroke-width": 2 },
            mapTransAtt = { "fill": "#fff", "stroke": "transparent", "cursor": "pointer", "opacity": 0 };

        // 绘制路径
        for (var state in province) {
            if (province.hasOwnProperty(state)) {
                var pathAttr, item;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].cityCode === province[state]['code']) {
                        // 回传数据
                        item = data[i];
                        // 底色变化
                        if (data[i].pkfsl >= 0 && data[i].pkfsl < 2) {
                            pathAttr = { 'fill': '#a7e3fc' };
                        } else if (data[i].pkfsl >= 2 && data[i].pkfsl < 5) {
                            pathAttr = { 'fill': '#6bcafc' };
                        } else if (data[i].pkfsl >= 5 && data[i].pkfsl < 8) {
                            pathAttr = { 'fill': '#3fbcfc' };
                        } else if (data[i].pkfsl >= 8 && data[i].pkfsl < 10) {
                            pathAttr = { 'fill': '#46a1fc' };
                        } else if (data[i].pkfsl >= 10) {
                            pathAttr = { 'fill': '#a7e3fc' };
                        }
                    }
                }
                province[state]['item'] = item;
                province[state]['R'] = R.path(province[state].path).attr($.extend(pathAttr, { 'stroke': '#fff', 'stroke-width': 3, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
            }
        }
        // 添加中心点及事件
        for (var state in province) {
            if (province.hasOwnProperty(state)) {
                (function (st, state) {
                    // 获取当前图形的中心坐标
                    var xx = st.getBBox().x + (st.getBBox().width / 2);
                    var yy = st.getBBox().y + (st.getBBox().height / 2);
                    var fixCX = 20; //圆圈的位置偏移
                    var fixRX = 10; //红色圆角矩形的位置偏移
                    //***修改部分地图文字偏移坐标
                    switch (province[state]['name']) {
                        case "淮北市": xx -= 20; yy += 10; break;
                        case "亳州市": xx -= 16; yy += 20; break;
                        case "芜湖市": xx += 16; yy -= 15; break;
                        case "合肥市": xx -= 10; yy -= 10; break;
                        case "六安市": xx -= 10; yy += 10; break;
                        case "滁州市": xx -= 15; yy += 30; break;
                        case "蚌埠市": xx -= 30; yy += 5; break;
                        case "淮南市": xx -= 10; break;
                        case "宿州市": xx += 5; yy += 20; break;
                        case "阜阳市": yy += 25; break;
                        case "安庆市": xx -= 15; yy -= 20; break;
                        case "池州市": xx -= 15; yy -= 25; break;
                        case "黄山市": xx -= 25; yy += 15; break;
                        case "宣城市": xx -= 25; break;
                        case "铜陵市": xx -= 25; break;
                        case "马鞍山市": xx -= 15; yy += 5; break;
                        default:
                    }
                    // 绘制中心点
                    province[state]['text'] = R.text((xx + fixCX), (yy + 20), province[state]['name']).attr(textAttr);
                    province[state]['point'] = R.circle((xx + fixCX), yy, 4).attr(circleAttr);
                    if (showNation && province[state].hasNation) {
                        province[state]['img'] = R.image(baseUrl + '/img/lead/icon-haspoverty.png', (xx + 10), yy - 10, 20, 20);
                    }
                    // 绘制地图透明层，用于事件
                    province[state]['click'] = R.path(st.attrs.path).attr(mapTransAtt);
                    // 其它回传数据                    
                    province[state]['x'] = xx + fixCX;
                    province[state]['y'] = yy;

                })(province[state]['R'], state);
            }
        }
        // 回调区域点击事件
        callback && callback(R, province);
    }
    /**
     * 横向柱状图（致贫原因）
     * @element DOM容器
     * @data 渲染数据
     */
    paint.povertyResRank = function (element, data) {
        var paper = new Raphael(element),
            paperWidth = document.getElementById(element).offsetWidth,
            paperHeight = document.getElementById(element).offsetHeight;
        var maxNum = '',
            scaleArray = [];
        //取最大值
        for (var i = 0; i < data.length; i++) {
            scaleArray.push(data[i].scale);
        }
        maxNum = Math.max.apply(null, scaleArray);
        //取坐标
        for (var t = 0; t < data.length; t++) {
            var lengthNum = maxNum == 0 ? 0 : (paperWidth - 230) / maxNum * data[t].scale;
            var p1 = { x: 10, y: 20 + 35 * t },
                p2 = { x: p1.x + 160, y: p1.y },
                p3 = { x: p2.x, y: p2.y + 25 },
                p4 = { x: p1.x, y: p1.y + 25 };
            var p11 = { x: p2.x - 10, y: p2.y - 5 },
                p22 = { x: p11.x + lengthNum + 12, y: p11.y },
                p33 = { x: p22.x, y: p22.y + 25 },
                p44 = { x: p11.x, y: p11.y + 25 };
            //柱状图
            var path = [
                'M', p1.x, ' ', p1.y,
                'L', p2.x, ' ', p2.y,
                'L', p3.x, ' ', p3.y,
                'L', p4.x, ' ', p4.y,
                'Z'
            ].join('');
            paper.path(path).attr({ "stroke-width": 0.5, "stroke": "#E8F0FE", "fill": "#E8F0FE" });
            var path11 = [
                'M', p11.x, ' ', p11.y,
                'L', p22.x, ' ', p22.y,
                'L', p33.x, ' ', p33.y,
                'L', p44.x, ' ', p44.y,
                'Z'
            ].join('');
            paper.path(path11).attr({ "stroke-width": 0.5, "stroke": "#82AAF9", "fill": "#82AAF9" });
            var path22 = [
                'M', p44.x, ' ', p44.y,
                'L', p3.x, ' ', p3.y,
                'L', p3.x, ' ', p44.y,
                'Z'
            ].join('');
            paper.path(path22).attr({ "stroke-width": 0.5, "fill": "#3b7df0" });
            paper.text(p11.x - 20, p11.y + 17, data[t].firstReasonName).attr({
                "fill": "#6f6f6f",
                "font-size": "14px",
                "font-family": "Microsoft Yahei",
                "text-anchor": "end"
            });
            paper.text(p22.x + 4, p22.y + 12, data[t].scale + "%").attr({
                "fill": "#000000",
                "font-size": "14px",
                "font-family": "Microsoft Yahei",
                "text-anchor": "start"
            });
        }
    }
    /**
     * 单环状图（贫困属性统计）
     * @element DOM容器
     * @data 渲染数据
     */
    paint.povertyAttrRank = function (element, data) {
        var paper = new Raphael(element),
            paperWidth = document.getElementById(element).offsetWidth,
            paperHeight = document.getElementById(element).offsetHeight,

            //环图中心文字颜色
            pieWdGray = { "fill": "#666", "stroke": "none", "opacity": 1, "font-size": 22, "text-anchor": "middle" },
            //环图主色调
            pieAttrRed = { "stroke-width": 2, "stroke": "none", "fill": "#3F95F9" },
            //环图余下色调      
            pieAttrGray = { "stroke-width": 2, "stroke": "none", "fill": "#CCC" },
            //环图中心背景色
            pieAttrWhite = { "stroke-width": 2, "stroke": "none", "fill": "#FFF" },
            //线终点圆点色
            lineEndCircle = { "fill": "#3F95F9", "stroke": "none", "opacity": 1, "font-size": 18, "text-anchor": "end" },
            //线上字体色
            lineUpFont = { "fill": "#5B6ECA", "stroke": "none", "opacity": 1, "font-size": 20, "text-anchor": "end" },
            //线下字体色
            lineBottomFont = { "fill": "#65D5F7", "stroke": "none", "opacity": 1, "font-size": 20, "text-anchor": "end" },
            //线上下灰色字体色
            lineFontGray = { "fill": "#333333", "stroke": "none", "opacity": 1, "font-size": 16, "text-anchor": "end" },
            //半径预设
            r1 = 86,
            r2 = 136,
            r3 = 20,
            r4 = 34,
            //动画预设
            fadeIn = [{ opacity: 1 }, 100],
            fadeInEff = fadeIn[0],
            fadeInTim = fadeIn[1];
        // 编制
        var xline = 200,
            yline = [45, 5],
            percentRes = parseFloat(parseFloat((data.outPovertyNum / data.totality).toPrecision(12)).toFixed(2)),
            perData = (percentRes == 0 ? 0.001 : (percentRes < 0.01 ? 0.01 : percentRes)),
            pPath = paint.drawPie(100, 30, r1, r2, xline, yline, perData);

        //已脱贫
        paper.path(pPath.pieInner).attr(pieAttrRed),//环状饼图
        paper.path(pPath.line).attr({ "stroke": "#3F95F9" }),//线
        paper.circle(pPath.upWord[0], pPath.upWord[1] + 25, 4).attr(lineEndCircle)//线终点圆
        paper.text(pPath.upWord[0], pPath.upWord[1] - 15, common.formatNumber(data.totality)).attr(lineUpFont), //字上
        paper.text(pPath.upWord[0], pPath.upWord[1] + 10, data.poorPropertiesName + '总户数').attr(lineFontGray), //字上文字

        paper.text(pPath.bottomWord[0], pPath.bottomWord[1], '已脱贫户数').attr(lineFontGray), //字上文字
        paper.text(pPath.bottomWord[0], pPath.bottomWord[1] + 22, common.formatNumber(data.outPovertyNum)).attr(lineBottomFont), //字下
        paper.circle(pPath.x, pPath.y + r2, r1).attr(pieAttrWhite),//内圆
        paper.text(pPath.x, pPath.y + r2, data.poorPropertiesName).attr(pieWdGray),
        //未脱贫（灰）
        paper.path(pPath.pieOther).attr(pieAttrGray)//环状饼图

    }
    /**
     * 单环状图，双数据
     * rectXX 起始x坐标 
     * rectYY 起始y坐标
     * r1 内圆半径
     * r2 外圆半径
     * xline 折线x起始
     * yline 拆线y起始
     * percent 占比
     */
    paint.drawPie = function (rectXX, rectYY, r1, r2, xline, yline, percent) {
        var drawPercent = percent >= 1 ? 0.9999 : (percent == 0 ? 0.0001 : percent);
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
            //饼 - 亮
            pieInner = [
                'M', p1.x, ' ', p1.y,
                'A', r2, ' ', r2, ' 0 ', percent > 0.5 ? 1 : 0, ' 1 ', p2.x, ' ', p2.y,
                'L', p3.x, ' ', p3.y,
                'A', r1, ' ', r1, ' 0 ', percent > 0.5 ? 1 : 0, ' 0 ', p4.x, ' ', p4.y,
                'Z'
            ].join(''),
            // 饼 - 灰
            pieOther = [
                'M', p1.x, ' ', p1.y,
                'A', r2, ' ', r2, ' 1 ', percent > 0.5 ? 0 : 1, ' 0 ', p2.x, ' ', p2.y,
                'L', p3.x, ' ', p3.y,
                'A', r1, ' ', r1, ' 1 ', percent > 0.5 ? 0 : 1, ' 1 ', p4.x, ' ', p4.y,
                'Z'
            ].join(''),
            //线
            line = [
                'M', drawPercent <= 0.09 ? p1.x - r2 * Math.sin(2 * PI * (1 - drawPercent / 2)) : p1.x + 10, ' ', drawPercent <= 0.09 ? p1.y + 2 : p1.y + 10,
                'L', drawPercent <= 0.09 ? p1.x + 10 : p1.x + 20, ' ', p1.y - 20,
                'L', drawPercent <= 0.09 ? p1.x + xline + 10 : p1.x + xline + 10, ' ', p1.y - 20
            ].join(''),
            //线上字
            upWord = [drawPercent <= 0.09 ? p1.x + xline + 10 : p1.x + xline + 10, p1.y - yline[0]],
            //线下字
            bottomWord = [drawPercent <= 0.09 ? p1.x + xline + 10 : p1.x + xline + 10, p1.y - yline[1]];
        return {
            pieInner: pieInner,
            pieOther: pieOther,
            line: line,
            upWord: upWord,
            bottomWord: bottomWord,
            x: p1.x,
            y: p1.y
        }
    }
    /**
     * 多柱状图（绘制扶贫脱贫情况多柱状图）
     * @element DOM对象
     * @data 绘制数据
     */
    paint.drawMutRank = function (element, data) {
        //组装数据
        var myDate = new Date();
        var currentYear = myDate.getFullYear();
        // 年份
        var axisX = [];
        // 计划脱贫数组
        var planData = [];
        // 实际脱贫数组
        var outData = [];
        for (var i = 0; i < data.length; i++) {
            axisX.push(data[i].year);
            planData.push(data[i].planPovertyNum);
            outData.push(data[i].actualPovertyNum);
        }
        // 取纵坐标最大值
        var planMaxNum = Math.max.apply(null, planData) === 0 ? 10 : common.roundInt(Math.max.apply(null, planData));
        var outMaxNum = Math.max.apply(null, outData) === 0 ? 10 : common.roundInt(Math.max.apply(null, outData));
        var resMaxNum = planMaxNum > outMaxNum ? planMaxNum : outMaxNum;
        // 取纵坐标
        var axisY = [];
        for (var j = resMaxNum; j >= 0; j = j - (resMaxNum / 5)) {
            axisY.push(j);
        }
        //绘制数据
        var paper = new Raphael(element),
            paperWidth = document.getElementById(element).offsetWidth - 2,
            paperHeight = document.getElementById(element).offsetHeight,
            //柱宽度
            iw = 25,
            //顶部高度
            th = 40,
            //底部高度
            bh = 60,
            //横坐标起点
            leftgutter = 50,
            bottomgutter = 35,
            //横坐标每刻度宽度
            XW = (paperWidth - leftgutter) / axisX.length,
            //纵坐标每刻度高度
            YH = (paperHeight - bottomgutter - 20) / axisY.length,
            axisTxt = { "font": '14px Fontin-Sans, Arial', stroke: "none", fill: "#333" };
        //绘制横坐标 
        // 最左侧刻度标记竖线
        paper.path('M' + leftgutter + ' ' + 284 + 'L' + leftgutter + ' ' + 294);
        for (var i = 0, ii = axisX.length; i < ii; i++) {
            var itemX = leftgutter + (i * XW);
            // 刻度线
            paper.path('M' + itemX + ' ' + 289 + 'L' + (itemX + XW) + ' ' + 289);
            // 刻度标记竖线
            paper.path('M' + (itemX + XW) + ' ' + 284 + 'L' + (itemX + XW) + ' ' + 294);
            // 刻度值
            paper.text(leftgutter + XW * (i + .5), 304, axisX[i] + '年').attr(axisTxt);
        }
        //绘制纵坐标 
        for (var i = 0, ii = axisY.length; i < ii; i++) {
            paper.text(25, YH * (i + .9), axisY[i]).attr(axisTxt);
        }
        //根据投入比例进行排序
        var blueConf = { 'fill': '90-#4192f6:0-#69cffb:100', 'stroke': '#69cffb', 'font-size': '16px', 'text-anchor': 'end' },
            greenConf = { 'fill': '90-#48ce80:0-#90e686:100', 'stroke': '#90e686', 'font-size': '16px', 'text-anchor': 'start' },
            // 灰色虚线
            grayConf = { 'fill': 'transparent', 'stroke': '#ccc', 'stroke-dasharray': ['-'] },
            orangeConf = { 'fill': '90-#ff5332:0-#fe8c58:100', 'stroke': '#fe8c58', 'font-size': '16px', 'text-anchor': 'start' },
            transConf = { 'fill': '#000', 'stroke': '#f8f8f8', 'opacity': 0, 'cursor': 'pointer' },
            // 背景层
            backConf = { 'fill': 'transparent', 'stroke': '#b2e4fa', 'stroke-width': 1, 'font-size': '18px', 'text-anchor': 'end', 'cursor': 'pointer' },
            backConfAct = { 'fill': 'transparent', 'stroke': '#ff5332', 'stroke-width': 1, 'font-size': '18px', 'text-anchor': 'end', 'cursor': 'pointer' },
            backTopConf = { 'fill': '#3f80ed', 'stroke': '#3f80ed', 'font-size': '18px', 'text-anchor': 'end', 'cursor': 'pointer' },
            backTopConfAct = { 'fill': '#ff5332', 'stroke': '#ff5332', 'font-size': '18px', 'text-anchor': 'end', 'cursor': 'pointer' },
            whiteTxt = { 'fill': '#fff', 'font-size': '14px', 'color': '#fff', 'text-anchor': 'middle' },
            blackTxt = { 'fill': '#333', 'font-size': '14px', 'color': '#333', 'text-anchor': 'start' },
            // 柱线高(第一柱 、第二柱虚线、第二柱、超额柱)
            ly, rdoty, ry, ty,
            lH, rdotH, rH, tH,
            ct = [];

        //绘制标识
        var tipX = leftgutter + 108,
            tipY = 322;
        paper.rect(tipX, tipY, 14, 14).attr(blueConf);
        paper.rect(tipX + 128, tipY, 14, 14).attr(greenConf);
        paper.rect(tipX + 256, tipY, 14, 14).attr(orangeConf);
        paper.text(tipX + 22, tipY + 7, '计划脱贫人数').attr(blackTxt);
        paper.text(tipX + 128 + 22, tipY + 7, '实际脱贫人数').attr(blackTxt);
        paper.text(tipX + 256 + 22, tipY + 7, '超计划完成脱贫人数').attr(blackTxt);
        //缓存初始当前年
        var itemDefault = paper.set()
        // 绘制柱状图
        for (var i = 0; i < data.length; i++) {
            var itemX = leftgutter + (i * XW), // 每一柱容器宽度
                x = itemX + (XW - iw * 2 - 15) / 2, //每一柱第一个x轴起点      
                // 超额百分比和超额字符串
                isOutpercent, isOutperform;
            // 如果最大值为0
            if (resMaxNum === 10) {
                // 起点是250
                ly = 280;
                ry = 280;
                // 柱高
                lH = 6;
                rH = 6;
            } else {
                // 第一柱起点
                ly = data[i].planPovertyNum == resMaxNum ? th : (data[i].planPovertyNum === 0 ? 280 : paperHeight - (((data[i].planPovertyNum) / resMaxNum) * 240) - bh);
                // 第二柱起点
                ry = data[i].actualPovertyNum == resMaxNum ? th : (data[i].actualPovertyNum === 0 ? 280 : paperHeight - (((data[i].actualPovertyNum) / resMaxNum) * 240) - bh);
                // 虚线高等于第一柱高
                lH = rdotH = paperHeight - ly - bh;
                // 第二柱高
                rH = paperHeight - ry - bh;
                tH = paperHeight - ry - bh;
            }
            // 是否超额完成
            isOutpercent = data[i].planPovertyNum == 0 ? 0 : data[i].actualPovertyNum / data[i].planPovertyNum;
            isOutperform = isOutpercent > 1 ? '超额完成' + common.toPercent((isOutpercent - 1), 2) : '完成率' + common.toPercent((isOutpercent), 2);
            data[i].lbar = paper.rect(x, ly, iw, lH).attr(blueConf);
            data[i].rdotBar = paper.rect(x + 35, ly, iw, lH).attr(grayConf);
            if (isOutpercent > 1) {
                data[i].tbar = paper.rect(x + 35, ry, iw, rH).attr(orangeConf);
            } else {
                data[i].rbar = paper.rect(x + 35, ry, iw, rH).attr(greenConf);
            }
            // 创建交互层数组
            var itemHover = paper.set();
            // 显示当年数据
            if (currentYear && currentYear === parseInt(data[i].year)) {
                itemDefault.push(
                    // 交互背景层
                    paper.rect(itemX, 20, XW, paperHeight - 20 - bh).attr(isOutpercent > 1 ? backConfAct : backConf),
                    paper.rect(itemX, -5, XW, 24).attr(isOutpercent > 1 ? backTopConfAct : backTopConf),
                    paper.text((XW / 2) + itemX, 10, isOutperform).attr(whiteTxt),
                    // 蓝色文字右对齐
                    paper.text(x + 15 + 12, ly - 10, data[i].planPovertyNum).attr(blueConf),
                    // 绿色文字左对齐
                    (isOutpercent > 1 ? paper.text(x + 30 + 5, ry - 10, data[i].actualPovertyNum).attr(orangeConf) : paper.text(x + 30 + 5, ry - 10, data[i].actualPovertyNum).attr(greenConf))
                )
            }
            // 透明背景层
            data[i].hover = paper.rect(itemX, 0, XW, paperHeight - bh + 2).attr(transConf);
            var iData = data[i];
            (function (i, x, ly, ry, itemX, isOutpercent, isOutperform, itemDefault) {
                $(data[i].hover.node).hover(
                    function () {
                        itemDefault.remove();
                        itemHover.push(
                            // 交互背景层
                            paper.rect(itemX, 20, XW, paperHeight - 20 - bh).attr(isOutpercent > 1 ? backConfAct : backConf),
                            paper.rect(itemX, -5, XW, 24).attr(isOutpercent > 1 ? backTopConfAct : backTopConf),
                            paper.text((XW / 2) + itemX, 10, isOutperform).attr(whiteTxt),
                            // 蓝色文字右对齐
                            paper.text(x + 15 + 12, ly - 10, data[i].planPovertyNum).attr(blueConf),
                            // 绿色文字左对齐
                            (isOutpercent > 1 ? paper.text(x + 30 + 5, ry - 10, data[i].actualPovertyNum).attr(orangeConf) : paper.text(x + 30 + 5, ry - 10, data[i].actualPovertyNum).attr(greenConf))
                        ).attr({ "opacity": 0 }).animate({ opacity: 1 }, 200);
                        // 透明蒙板移到最高层，防止击穿
                        this.parentNode.appendChild(this);
                    }, function () {
                        itemHover.remove().attr({ "opacity": 0 }).animate({ opacity: 1 }, 200);
                    }
                )
            })(i, x, ly, ry, itemX, isOutpercent, isOutperform, itemDefault);
        }
    }
    /**
     * 不规则多图（扶贫项目情况圆图）
     * @element DOM对象
     * @data 绘制数据
     */
    paint.drawMutcicle = function (element, data) {
        // 处理数据

        // 绘制图形
        var paper = new Raphael(element),
            paperWidth = document.getElementById(element).offsetWidth,
            paperHeight = document.getElementById(element).offsetHeight;

        var x = 70, y = 128;
        //绘制第一个小圆
        var firstPaint = paper.set(),
            firstR = 50;
        firstPaint.push(
            paper.circle(x, y, firstR).attr({ 'fill': '#6497ec', 'stroke': 'transparent' }),
            paper.text(x, y - 15, data.projectNum).attr({ 'fill': '#fff', 'stroke': 'transparent', 'font-size': '30px', 'text-anchor': 'middle' }),
            paper.text(x, y + 15, '项目数').attr({ 'fill': '#fff', 'stroke': 'transparent', 'font-size': '14px', 'text-anchor': 'middle' }),
            paper.path('M' + (x + firstR) + ' ' + y + 'L' + (x + firstR + 58) + ' ' + y).attr({ 'stroke': '#6497ec', 'stroke-width': 1 }),
            paper.circle(x + firstR + 29, y, 5).attr({ 'fill': '#6497ec', 'stroke': 'transparent' })
        );
        //绘制第二个小圆
        var secdPaint = paper.set(),
            secdR = 100,
            secdX = x + 138,
            secBigPie = paint.drawMutPie(x + 138, -50, 42, 100, data.percent),
            secSmallPie = paint.drawMutPie(x + 138, -40, 42, 90, data.percent),
            //环图中心文字颜色
            pieWdGray = { 'fill': '#666', 'stroke': 'none', 'opacity': 1, 'font-size': 22, 'text-anchor': 'middle' },
            //环图主色调
            pieAttrRed = { 'stroke-width': 2, 'stroke': 'none', 'fill': '#3F95F9' },
            //环图余下色调      
            pieAttrGray = { 'stroke-width': 2, 'stroke': 'none', 'fill': '#b7cffa' },
            //环图中心背景色
            pieAttrWhite = { 'stroke-width': 2, 'stroke': 'none', 'fill': '#FFF' };
        secdPaint.push(
            paper.image(baseUrl + '/img/lead/icon-money.png', x + 176, y - 18, 47, 37),
            paper.path(secBigPie.pieInner).attr(pieAttrRed),
            paper.path(secSmallPie.pieOther).attr(pieAttrGray)
        );
        //绘制第三段线
        var thirdPaint = paper.set(),
            thirdX = secdX + 150,
            thirdR = 70;
        thirdPaint.push(
            // 人像圆
            paper.image(baseUrl + '/img/lead/icon-avatar.png', thirdX + 218, y - 52, 105, 105),
            paper.text(thirdX + 348, y - 10, common.formatNumber(data.holdHouseNum)).attr({ 'fill': '#333', 'font-size': 20, 'text-anchor': 'start' }),
            paper.text(thirdX + 348, y + 10, '受益户数').attr({ 'fill': '#666', 'font-size': 14, 'text-anchor': 'start' }),
            // 线
            paper.path('M' + thirdX + ' ' + y + 'L' + (thirdX + 200) + ' ' + y).attr({ 'stroke': '#6497ec', 'stroke-width': 1 }),
            paper.circle(thirdX + 170, y, 5).attr({ 'fill': '#6497ec', 'stroke': 'transparent' }),
            paper.circle(thirdX + 200, y, 3).attr({ 'fill': '#cfe2fd', 'stroke': 'transparent' }),
            paper.circle(thirdX + 270, y, thirdR).attr({ 'fill': 'transparent', 'stroke': '#cfe2fd', 'stroke-dasharray': ['-'] }),
            // 数据
            paper.text(thirdX + 15, y - 40, '¥' + common.formatNumber(data.helpMoney)).attr({ 'fill': '#333', 'font-size': 20, 'text-anchor': 'start' }), //实际投入
            paper.text(thirdX + 15, y - 15, '实际投入').attr({ 'fill': '#666', 'font-size': 14, 'text-anchor': 'start' }),
            paper.text(thirdX + 15, y + 40, '¥' + common.formatNumber(data.invest)).attr({ 'fill': '#407fed', 'font-size': 20, 'text-anchor': 'start' }), //计划投入
            paper.text(thirdX + 15, y + 15, '计划投入').attr({ 'fill': '#666', 'font-size': 14, 'text-anchor': 'start' })
        );
    }
    /**
     * 单环状双数据（扶贫项目情况中饼图专用）
     * rectXX 起始x坐标
     * rectYY 起始y坐标
     * r1 内圆半径
     * r2 外圆半径
     * percent 高亮数据占比
     */
    paint.drawMutPie = function (rectXX, rectYY, r1, r2, percent) {
        var drawPercent = percent >= 1 ? 0.9999 : (percent == 0 ? 0.0001 : percent);
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
            //饼 - 亮
            pieInner = [
                'M', p1.x, ' ', p1.y,
                'A', r2, ' ', r2, ' 0 ', percent > 0.5 ? 1 : 0, ' 1 ', p2.x, ' ', p2.y,
                'L', p3.x, ' ', p3.y,
                'A', r1, ' ', r1, ' 0 ', percent > 0.5 ? 1 : 0, ' 0 ', p4.x, ' ', p4.y,
                'Z'
            ].join(''),
            // 饼 - 灰
            pieOther = [
                'M', p1.x, ' ', p1.y,
                'A', r2, ' ', r2, ' 1 ', percent > 0.5 ? 0 : 1, ' 0 ', p2.x, ' ', p2.y,
                'L', p3.x, ' ', p3.y,
                'A', r1, ' ', r1, ' 1 ', percent > 0.5 ? 0 : 1, ' 1 ', p4.x, ' ', p4.y,
                'Z'
            ].join('');
        return {
            pieInner: pieInner,
            pieOther: pieOther
        }
    }
    /**
     * 单柱图
     * 数据分析 - 扶贫主体业务
     * element DOM容器
     * num 字段属性名 用于多类别柱图的同一接口的不同字段
     * unit 纵坐标单位标识名称
     * data 数据
     */
    paint.drawSigRank = function (element, num, unit, data) {
        //组装数据
        var myDate = new Date();
        var currentYear = myDate.getFullYear();
        // 年份
        var axisX = [];
        // 计划脱贫数组
        var axisY = [];
        var axisYData = [];
        for (var i = 0; i < data.length; i++) {
            axisX.push(data[i].nd);
            axisYData.push(data[i][num]);
        }
        // 取纵坐标最大值
        var resMaxNum = Math.max.apply(null, axisYData) === 0 ? 10 : common.roundInt(Math.max.apply(null, axisYData) < 10 ? 10 : Math.max.apply(null, axisYData));
        // 取纵坐标
        for (var j = resMaxNum; j >= 0; j = j - (resMaxNum / 5)) {
            axisY.push(j);
        }
        //绘制数据
        var paper = new Raphael(element),
            paperWidth = document.getElementById(element).offsetWidth - 2,
            paperHeight = document.getElementById(element).offsetHeight,
            //柱宽度
            iw = 40,
            //顶部高度
            th = 15,
            //横坐标起点
            lx = 50,
            bh = 30,
            //纵向误差
            sh = 2,
            //横坐标每刻度宽度
            XW = (paperWidth - lx) / axisX.length,
            // 柱体高
            WH = paperHeight - bh,
            //纵坐标每刻度高度
            YH = (paperHeight - bh) / axisY.length,
            axisTxt = { "font": '14px Fontin-Sans, Arial', stroke: "none", fill: "#333" };
        //绘制横坐标 
        // 最左侧刻度标记竖线
        paper.path('M' + lx + ' ' + (WH - 5) + 'L' + lx + ' ' + (WH + 5));
        // 单位说明
        paper.text(lx - 38, th, '单位：' + unit).attr({ 'fill': '#666', 'stroke': 'transparent', 'font-size': '14px', 'text-anchor': 'start' });
        for (var i = 0, ii = axisX.length; i < ii; i++) {
            var itemX = lx + (i * XW);
            // 刻度线
            paper.path('M' + itemX + ' ' + WH + 'L' + (itemX + XW) + ' ' + WH);
            // 刻度标记竖线
            paper.path('M' + (itemX + XW) + ' ' + (WH - 5) + 'L' + (itemX + XW) + ' ' + (WH + 5));
            // 刻度值
            paper.text(lx + XW * (i + .5), WH + 15, axisX[i] + '年').attr(axisTxt);
        }
        //绘制纵坐标 
        for (var i = 0, ii = axisY.length; i < ii; i++) {
            paper.text(25, YH * (i + 1), axisY[i]).attr(axisTxt);
        }
        //根据投入比例进行排序
        var blueConf = { 'fill': '90-#4192f6:0-#69cffb:100', 'stroke': '#69cffb', 'font-size': '16px', 'text-anchor': 'middle' },
            orangeConf = { 'fill': '90-#ff5332:0-#fe8c58:100', 'stroke': '#fe8c58', 'font-size': '16px', 'text-anchor': 'middle' },
            transConf = { 'fill': '#000', 'stroke': '#f8f8f8', 'opacity': 0, 'cursor': 'pointer' },
            // 背景层
            backConf = { 'fill': 'transparent', 'stroke': '#b2e4fa', 'stroke-width': 1, 'font-size': '18px', 'text-anchor': 'end', 'cursor': 'pointer' },
            backConfAct = { 'fill': '90-#fff3ee:0-#fffefe:100', 'stroke': 'none', 'stroke-width': 1, 'font-size': '18px', 'text-anchor': 'end', 'cursor': 'pointer' },
            ly,
            lH,
            ct = [];
        // 绘制柱状图        
        var itemDefault = paper.set();
        for (var i = 0; i < data.length; i++) {
            var itemX = lx + (i * XW), // 每一柱容器宽度
                x = itemX + (XW) / 2 - (iw / 2), //每一柱第一个x轴起点      
                // 超额百分比和超额字符串
                isOutpercent, isOutperform;
            // 如果最大值为0
            if (resMaxNum === 0) {
                // 起点是250
                ly = WH;
                // 柱高
                lH = 6;
            } else {
                // 第一柱起点
                ly = data[i][num] == resMaxNum ? th + 30 + sh : (data[i][num] === 0 ? (WH - 10) : paperHeight - (((data[i][num]) / resMaxNum) * (WH - th - bh + sh)) - bh);
                // 虚线高等于第一柱高
                lH = paperHeight - ly - bh;
            }
            // 创建交互层数组
            var itemHover = paper.set();
            paper.rect(x, ly, iw, lH - sh).attr(blueConf);
            paper.text(x + iw / 2, ly - 15, data[i][num]).attr(blueConf);
            // 显示当年数据
            if (currentYear && currentYear === parseInt(data[i].nd)) {
                itemDefault.push(
                    paper.rect(itemX, th, XW, paperHeight - th - bh - sh).attr(backConfAct),
                    paper.rect(x, ly, iw, lH - sh).attr(orangeConf),
                    paper.text(x + iw / 2, ly - 15, data[i][num]).attr(orangeConf)
                );
            }
            // 透明背景层
            data[i].hover = paper.rect(itemX, 0, XW, paperHeight - bh + sh).attr(transConf);
            var iData = data[i];
            (function (i, x, ly, itemX, iw, lH, itemDefault) {
                $(data[i].hover.node).hover(
                    function () {
                        itemDefault.remove();
                        itemHover.push(
                            // 交互背景层
                            paper.rect(itemX, 20, XW, paperHeight - 20 - bh - sh).attr(backConfAct),
                            paper.rect(x, ly, iw, lH - sh).attr(orangeConf),
                            paper.text(x + iw / 2, ly - 15, data[i][num]).attr(orangeConf)
                        ).attr({ "opacity": 0 }).animate({ opacity: 1 }, 200);
                        // 透明蒙板移到最高层，防止击穿
                        this.parentNode.appendChild(this);
                    }, function () {
                        itemHover.remove().attr({ "opacity": 0 }).animate({ opacity: 1 }, 200);
                    }
                )
            })(i, x, ly, itemX, iw, lH, itemDefault);
        }
    }
    /**
     * 单折线图
     * element DOM容器
     * num 字段属性名 用于多类别柱图的同一接口的不同字段
     * unit 纵坐标单位标识名称
     * data 数据
     */
    paint.drawSigLine = function (element, num, unit, data) {
        //组装数据
        var myDate = new Date();
        var currentYear = myDate.getFullYear();
        // 年份
        var axisX = [];
        // 计划脱贫数组
        var axisY = [];
        var axisYData = [];
        for (var i = 0; i < data.length; i++) {
            axisX.push(data[i].nd);
            axisYData.push(data[i][num]);
        }
        // 取纵坐标最大值
        var resMaxNum = Math.max.apply(null, axisYData) === 0 ? 10 : common.roundInt(Math.max.apply(null, axisYData) < 10 ? 10 : Math.max.apply(null, axisYData));
        // 取纵坐标
        for (var j = resMaxNum; j >= 0; j = j - (resMaxNum / 5)) {
            axisY.push(j);
        }
        //绘制数据
        var paper = new Raphael(element),
            paperWidth = document.getElementById(element).offsetWidth - 2,
            paperHeight = document.getElementById(element).offsetHeight,
            //柱宽度
            iw = 40,
            //顶部高度
            th = 15,
            //横坐标起点
            lx = 50,
            bh = 30,
            //纵向误差
            sh = 2,
            //横坐标每刻度宽度
            XW = (paperWidth - lx) / axisX.length,
            // 柱体高
            WH = paperHeight - bh,
            //纵坐标每刻度高度
            YH = (paperHeight - bh) / axisY.length,
            //系数
            yPer = (paperHeight - bh - th) / resMaxNum,
            axisTxt = { "font": '14px Fontin-Sans, Arial', stroke: "none", fill: "#333" };
        //根据投入比例进行排序
        var blueConf = { 'fill': '#4192f6', 'stroke': '#69cffb', 'font-size': '16px', 'text-anchor': 'middle' },
            cicleConf = { 'fill': '#3c91f9', 'stroke': '#baeaff', 'stroke-width': 4, 'font-size': '16px', 'text-anchor': 'middle' },
            orangeConf = { 'fill': '90-#ff5332:0-#fe8c58:100', 'stroke': '#fe8c58', 'font-size': '16px', 'text-anchor': 'middle' },
            cicleActConf = { 'fill': '#ff8c48', 'stroke': '#ffe7db', 'stroke-width': 4, 'font-size': '16px', 'text-anchor': 'middle' },
            transConf = { 'fill': '#000', 'stroke': '#f8f8f8', 'opacity': 0, 'cursor': 'pointer' },
            // 背景层
            backConf = { 'fill': 'transparent', 'stroke': '#b2e4fa', 'stroke-width': 1, 'font-size': '18px', 'text-anchor': 'end', 'cursor': 'pointer' },
            backConfAct = { 'fill': '#ff8c48', 'stroke': '#ff8b48', 'stroke-width': 2, 'font-size': '18px', 'text-anchor': 'end', 'cursor': 'pointer' },
            ly,
            lH,
            ct = [];
        //绘制横坐标 
        // 最左侧刻度标记竖线
        paper.path('M' + lx + ' ' + (WH - 5) + 'L' + lx + ' ' + (WH + 5));
        // 单位说明
        paper.text(lx - 38, th, '单位：' + unit).attr({ 'fill': '#666', 'stroke': 'transparent', 'font-size': '14px', 'text-anchor': 'start' });
        //连接曲线
        var p;
        for (var i = 0, ii = axisX.length; i < ii; i++) {
            var itemX = lx + (i * XW),
                x = itemX + (XW) / 2,
                ly = data[i][num] == resMaxNum ? th : (data[i][num] === 0 ? WH: paperHeight - (((data[i][num]) / resMaxNum) * (WH - th - bh + sh)) - bh);
            // 存折线路径
            if (!i) {
                p = ["M", x, ly, "L", x, ly];
                bgpp = ["M", lx + XW * .5, paperHeight - bh - sh - 5, "L", x, ly, "L", x, ly];
            }
            if (i && i < ii - 1) {
                p = p.concat([x, ly]);
                bgpp = bgpp.concat([x, ly]);
            }
            // 刻度线
            paper.path('M' + itemX + ' ' + WH + 'L' + (itemX + XW) + ' ' + WH);
            // 刻度标记竖线
            paper.path('M' + (itemX + XW) + ' ' + (WH - 5) + 'L' + (itemX + XW) + ' ' + (WH + 5));
            // 刻度值
            paper.text(lx + XW * (i + .5), WH + 15, axisX[i] + '年').attr(axisTxt);
        }
        //绘制纵坐标 
        for (var i = 0, ii = axisY.length; i < ii; i++) {
            paper.text(25, YH * (i + 1), axisY[i]).attr(axisTxt);
        }
        p = p.concat([x, ly, x, ly]);
        bgpp = bgpp.concat([x, ly, x, ly, "L", x, paperHeight - bh - sh - 5, "z"]);
        paper.path(p).attr({ "stroke": "#4192f6", "stroke-width": 2, "stroke-linejoin": "round" });
        paper.path(bgpp).attr({ 'fill': '95-#fff:0-#4192f6:100', 'stroke': 'none', 'opacity': .3 });

        //组装连接线
        //缓存初始当前年
        var itemDefault = paper.set();
        // 绘制柱状图
        for (var i = 0; i < data.length; i++) {
            var itemX = lx + (i * XW), // 每一柱容器宽度
                x = itemX + (XW) / 2, //每一柱第一个x轴起点      
                // 超额百分比和超额字符串
                isOutpercent, isOutperform;
            // 如果最大值为0
            if (resMaxNum === 0) {
                // 起点是250
                ly = WH;
                // 柱高
                lH = 6;
            } else {
                // 柱起点
                ly = data[i][num] == resMaxNum ? th : (data[i][num] === 0 ? WH : paperHeight - (((data[i][num]) / resMaxNum) * (WH - th - bh + sh)) - bh);
                lH = paperHeight - ly - bh;
            }
            // 创建交互层数组
            var itemHover = paper.set();
            paper.circle(x, ly, 6).attr(cicleConf);
            paper.text(x, ly - 20, data[i][num]).attr(blueConf);
            // 显示当年数据
            if (currentYear && currentYear === parseInt(data[i].nd)) {
                itemDefault.push(
                    paper.circle(x, ly, 6).attr(cicleActConf),
                    paper.path('M' + (itemX + XW / 2) + ' ' + ly + 'L' + (itemX + XW / 2) + ' ' + (paperHeight - bh - sh)).attr(backConfAct),
                    paper.text(x, ly - 20, data[i][num]).attr(orangeConf)
                );
            }
            // 透明背景层
            data[i].hover = paper.rect(itemX, 0, XW, paperHeight - bh + sh).attr(transConf);
            var iData = data[i];
            (function (i, x, ly, itemX, iw, lH, itemDefault) {
                $(data[i].hover.node).hover(
                    function () {
                        itemDefault.remove();
                        itemHover.push(
                            // 交互背景层
                            paper.circle(x, ly, 6).attr(cicleActConf),
                            paper.path('M' + (itemX + XW / 2) + ' ' + ly + 'L' + (itemX + XW / 2) + ' ' + (paperHeight - bh - sh)).attr(backConfAct),
                            paper.text(x, ly - 20, data[i][num]).attr(orangeConf)
                        ).attr({ "opacity": 0 }).animate({ opacity: 1 }, 200);
                        // 透明蒙板移到最高层，防止击穿
                        this.parentNode.appendChild(this);
                    }, function () {
                        itemHover.remove().attr({ "opacity": 0 }).animate({ opacity: 1 }, 200);
                    }
                )
            })(i, x, ly, itemX, iw, lH, itemDefault);
        };
    }
    /**
     * 多数据饼图
     * element DOM容器
     * cx 中心点x坐标
     * cy 中心点y坐标
     * r 半径
     * values 值数组
     * labels 标签数组
     * colors 颜色数组
     * stroke 是否显示边框
     * hollow 是否空心（环状图）
     * rose 是否玫瑰图
     */
    paint.drawPieChat = function (element, w, h, r, values, labels, colors, stroke, hollow, rose) {
        var paper = new Raphael(element, w, h),
            cx = w / 2,
            cy = h / 2,
            rad = Math.PI / 180,
            chart = paper.set();
        function sector(cx, cy, r, startAngle, endAngle, params) {
            var x1 = cx + r * Math.cos(-startAngle * rad),
                x2 = cx + r * Math.cos(-endAngle * rad),
                y1 = cy + r * Math.sin(-startAngle * rad),
                y2 = cy + r * Math.sin(-endAngle * rad);
            return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
        }
        //绘制背景虚线层
        !rose ? null : paper.circle(cx, cy, r).attr({'fill':'#f5f5f5', 'stroke': '#ddd', 'stroke-dasharray': ['-.-']});
        var angle = 360,
            total = 0,
            start = 0,
            process = function (j, isSig) {
                var value = values[j],
                    angleplus = 360 * value / total,
                    ratio = paint.toPercent(value / total, 0),
                    popangle = angle + (angleplus / 2),
                    R = !rose ? r : (r - (j * (!rose ? 5 : rose.diff))),
                    color = colors[j],
                    ms = 500,
                    delta = 30,
                    bcolor = Raphael.hsb(start, 1, 1),
                    p = !isSig ? sector(cx, cy, R, angle, angle + angleplus, {fill: color, stroke: !stroke ? "none" : stroke, "stroke-width": !stroke ? 0 : 3}) :
                        paper.circle(cx, cy, R).attr({fill: color, stroke: !stroke ? "none" : stroke, "stroke-width": !stroke ? 0 : 3}),
                    txt,
                    ratioNum = paper.text(
                        cx + (R - 18) * Math.cos(-popangle * rad),
                        cy + (R - 18) * Math.sin(-popangle * rad),
                        ratio).attr({fill: "#fff", stroke: "none", "text-anchor": "middle","font-size": 14}
                    ),
                    // 防击穿层
                    pHover = sector(cx, cy, r, angle, angle + angleplus, {fill: "transparent", stroke: "none"});
                // 是否需要显示label
                if (labels){
                    txt = paper.text(cx + (r + delta + 55) * Math.cos(-popangle * rad), cy + (r + delta + 25) * Math.sin(-popangle * rad), labels[j]).attr({fill: bcolor, stroke: "none", opacity: 0, "font-size": 20});
                }
                pHover.mouseover(function () {
                    p.stop().animate({transform: "s1.1 1.1 " + cx + " " + cy}, ms, "elastic");
                    !labels ? null: txt.stop().animate({opacity: 1}, ms, "elastic");
                }).mouseout(function () {
                    p.stop().animate({transform: ""}, ms, "elastic");
                    !labels ? null: txt.stop().animate({opacity: 0}, ms);
                });
                angle += angleplus;
                chart.push(p);
                !labels ? null: chart.push(txt);
                start += .1;
            };
        for (var i = 0, ii = values.length; i < ii; i++) {
            total += values[i];
        }
        for (i = 0; i < ii; i++) {
            if (ii === 1) {
                process(i, true);
            } else {
                process(i);
            }
        }
        if (hollow) {
            paper.circle(cx, cy, hollow.r).attr({'fill': hollow.color,'stroke': 'none'});
        }
    };

    paint.toPercent = function(obj, n) {
        return (Math.round(obj * Math.pow(10, n + 2)) / Math.pow(10, n) ).toFixed(n) + '%';
    };
    return paint;
})
