<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html>
<head>
	<title>安徽省脱贫攻坚大数据管理平台</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"  />
	<!-- <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" /> -->
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<link rel="stylesheet" href="/ahpad-web/resources/js/plugins/flyui/css/flyui.css" />
	<link rel="stylesheet" href="/ahpad-web/resources/js/plugins/fancybox/fancybox.css" />
	<link rel="stylesheet" href="/ahpad-web/resources/css/base.css" />
	<link rel="stylesheet" href="/ahpad-web/resources/css/site.css" />
	<link rel="stylesheet" href="/ahpad-web/resources/css/cont.css" />
	<script>
        var CONTEXTPATH = "/ahpad-web";
        var BASE_PATH = "http://localhost:8080";
	</script>

	<!-- 统一脚本 -->
	<link rel="stylesheet" href="/ahpad-web/resources/css/lead.css" />
	<script>
        var CUR_DATE = "1514187869299";
	</script>
</head>
<body>
<div class="wrap wrap-idx">
	<div class="container-fluid">

		<div id="myUrl" class="hide">http://localhost:8080:8806/uaac-server/logout?p=Jzfp</div>
		<div id="indexHeader" class="index-header">
			<div class="logo"><span>安徽省脱贫攻坚大数据管理平台></span></div>
			<!-- 用户信息 -->
			<div class="user-msg">
				<div class="user-exit"><a href="javascript:void(null);" class="exit-a" title="退出">退出</a></div>
				<i>|</i>
				<div class="hd-drop system-mag">
					<span class="mag-icon"></span>
					<div class="hd-dropdown" style="display: none;">
						<div class="hd-dropdown-con">
							<div class="arrow">
								<span></span>
							</div>
							<ul data-bind="source:sysNavList" data-template="sysNavTemp">
							</ul>
						</div>
					</div>
				</div>

				<!-- 消息中心 -->
				<div class="hd-drop user-msg-num">
					<span class="msg-num"></span>
					<span class="msg-icon"><em id="msgNum" data-bind="text:msgNum">0</em></span>
					<div class="hd-dropdown" style="display: none;">
						<div class="hd-dropdown-con">
							<div class="arrow">
								<span></span>
							</div>
							<ul id="msgNavList" data-bind="source:msgNavList" data-template="msgNavTemp">
							</ul>
							<div class="hd-dropdown-footer">
								<a class="ell" href="javascript:" data-bind="events:{click:openMoreMsg}">查看更多</a>
							</div>
						</div>
					</div>
				</div>
				<!-- 头像 -->
				<div class="hd-drop user-avatar">
					<div class="user-pointer">
						<img src="ahpad-web/resources/img/lead/dudu.jpg" height="39" width="39" alt="头像">
						<span>您好!</span>
						<strong class="ell" title="阜南县">阜南县</strong>
					</div>
					<div class="hd-dropdown user-detail" style="display: none;">
						<div class="hd-dropdown-con user-detail-con">
							<div class="arrow">
								<span></span>
							</div>
							<div class="detail-avatar">
								<img src="/ahpad-web/common/readImg.do"/>
							</div>
							<ul>
								<li><strong>姓名：</strong><span class="ell" title="阜南县">阜南县</span></li>
								<li><strong>身份证号：</strong><span class="ell" title=""></span></li>
								<li><strong>登录名：</strong><span class="ell" title="34122502">34122502</span></li>
								<li><strong>所属机构：</strong><span class="ell" title="阜南县">阜南县</span></li>
								<li><strong>用户类型：</strong><span class="ell" title="精准扶贫-县扶贫办">精准扶贫-县扶贫办</span></li>
								<li><strong>手机号码：</strong><span class="ell" title="13655659127">13655659127</span></li>
								<li><strong>UKey：</strong><span class="ell"></span></li>
								<li><strong>UKey有效期：</strong><span class="ell"></span></li>
							</ul>
							<div class="hd-dropdown-footer detail-footer">
								<a href="javascript:" data-bind="events:{click:openReset}"><i class="ico ico-security"></i>密码修改</a>
								<a href="javascript:" data-bind="events:{click:openUserInfo}"><i class="ico ico-config"></i>账号管理</a>
							</div>
						</div>
					</div>
				</div>
				<div class="back-home">
					<span>返回首页</span>
				</div>
			</div>
		</div>
		<!-- 头部消息列表 -->
		<script type="text/html" id="msgNavTemp">
			{{each $data as item i}}
			<li><a class="ell" href="javascript:" data-bind="events:{click:openMsg}" data-id="{{item.noticeId}}" title="{{item.noticeTitle}}">{{item.noticeTitle}}</a></li>
			{{/each}}
		</script>
		<!-- 头部导航菜单 -->
		<script type="text/html" id="sysNavTemp">
			{{each $data as item i}}
			<li><a class="ell" href="javascript:" data-bind="events:{click:openSysMenu}" data-href="{{item.url}}" title="{{item.title}}">{{item.title}}</a></li>
			{{/each}}
		</script>
		<div id="leadCont" class="index-content">
			<div class="linker-block row row-ie">
				<%--这里根据菜单加载出来--%>
					<div class="linker-item col-xs-2">
						<a href="indexinfo.do?_index=0">
							<i class="ico-nav ico-nav-peo"></i>
							<label class="linker-text">扶贫对象管理</label>
						</a>
					</div>

					<div class="linker-item col-xs-2">
						<a href="indexinfo.do?_index=1">
							<i class="ico-nav ico-nav-cog"></i>
							<label class="linker-text">扶贫资金管理</label>
						</a>
					</div>

					<div class="linker-item col-xs-2">
						<a href="indexinfo.do?_index=2">
							<i class="ico-nav ico-nav-folder"></i>
							<label class="linker-text">扶贫项目管理</label>
						</a>
					</div>

					<div class="linker-item col-xs-2">
						<a href="indexinfo.do?_index=3">
							<i class="ico-nav ico-nav-server"></i>
							<label class="linker-text">责任落实监管</label>
						</a>
					</div>

					<div class="linker-item col-xs-2">
						<a href="indexinfo.do?_index=4">
							<i class="ico-nav ico-nav-doc"></i>
							<label class="linker-text">脱贫成效评估</label>
						</a>
					</div>

					<div class="linker-item col-xs-2">
						<a href="analysis.do">
							<i class="ico-nav ico-nav-graph"></i>
							<label class="linker-text">数据分析展现</label>
						</a>
					</div>

			</div>
			<div class="cont-box">
				<div class="panel panel-map">
					<div class="panel-heading">
						<h2 class="panel-title"><em data-bind="text:codeName"></em><span>精准扶贫作战图</span></h2>
					</div>
					<div class="panel-body">
						<div class="row">
							<div class="col-xs-4">
								<h3>作战目标</h3>
								<div class="panel-goal row row-ie">
									<div class="col-xs-6">
										<strong class="ell" data-bind="text: totalPeopleNum, attr: {title: totalPeopleNum}" class="active"></strong>
										<span class="ell"><em data-bind="text:codeName"></em>贫困人口数量(人)</span>
									</div>
									<div class="col-xs-6">
										<strong class="ell" data-bind="text: outOfPovertyPeopleNum, attr: {title: outOfPovertyPeopleNum}"></strong>
										<span class="ell">已脱贫人口数量(人)</span>
									</div>
									<div class="col-xs-6">
										<strong class="ell" data-bind="text: totalVillageNum, attr: {title: totalVillageNum}" class="active"></strong>
										<span class="ell"><em data-bind="text:codeName"></em>贫困村数量(个)</span>
									</div>
									<div class="col-xs-6">
										<strong class="ell" data-bind="text: outOfPovertyVillageNum, attr: {title: outOfPovertyVillageNum}"></strong>
										<span class="ell">出列贫困村数量(个)</span>
									</div>
									<div class="col-xs-6">
										<strong class="ell" data-bind="text: totalCountyNum, attr: {title: totalCountyNum}" class="active"></strong>
										<span class="ell"><em data-bind="text:codeName"></em>贫困县数量(个)</span>
									</div>
									<div class="col-xs-6">
										<strong class="ell" data-bind="text: outOfPovertyCountyNum, attr: {title: outOfPovertyCountyNum}"></strong>
										<span class="ell">摘帽贫困县数量(个)</span>
									</div>
								</div>
								<h3>作战部队</h3>
								<div class="panel-team">
									<p><span>帮扶责任人(人)：</span><strong data-bind="text: peopleNum, attr: {title: peopleNum}"></strong><em></em></p>
									<p><span>驻村工作队(支)：</span><strong data-bind="text: teamNum, attr: {title: teamNum}"></strong><em></em></p>
									<p><span>帮扶单位(个)：</span><strong data-bind="text: unitNum, attr: {title: unitNum}"></strong><em></em></p>
								</div>
							</div>
							<div class="col-xs-8">
								<div class="map-wrap">
									<div id="anhuiWrap" class="map-container" data-bind="visible: maplev1">
										<div id="anhui" class="map-province-box"></div>
										<p id="legend" class="legend">
											<!-- <a href="javascript:void(0);" data-id="National">国家级（市/县）战区</a> -->
											<a class="active" href="javascript:void(0);" data-id="provincial">省市级（市/县）战区</a>
										</p>
										<div class="map-tip">
											<h5>图例</h5>
											<p><img src="/ahpad-web/resources/img/lead/icon-haspoverty.png" />国家级（市、县）战区</p>
											<p>全市贫困人口数量（单位：人）</p>
											<p><img src="/ahpad-web/resources/img/lead/icon-tip-orange.png" /></p>
										</div>
									</div>
									<div id="cityWrap" class="map-container" data-bind="visible: maplev2">
										<div id="city" class="map-city-box">
											<p class="legend goback">
												<a href="javascript:void(0);" data-bind="click:cityGoback">返回</a>
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="cont-box">
				<div class="row">
					<div class="col-xs-5">
						<div class="panel panel-povres-rank">
							<div class="panel-heading">
								<h4 class="panel-title"><i class="ico-title ico-t-rank"></i><span><i><em data-bind="text:codeName"></em>贫困户主要致贫原因统计</i></span></h4>
							</div>
							<div class="panel-body">
								<div id="povertyReason" class="wraper"></div>
							</div>
						</div>
					</div>
					<div class="col-xs-7">
						<div class="panel panel-poverty-prot">
							<div class="panel-heading">
								<h4 class="panel-title"><i class="ico-title ico-t-pie"></i><span><i><em data-bind="text:codeName"></em>贫困户贫困属性统计</i></span></h4>
							</div>
							<div class="panel-body">
								<div class="wraper">
									<div id="povertyAttr" class="poverty-pie"></div>
									<div class="poverty-tab">
										<div class="tab-item active" data-type="normal">
											<div class="item-show">
												<h4><i class="ico-30 ico-peoples active"></i><strong>一般贫困户</strong></h4>
												<p class="cont-color cont-blue"><i></i><strong>一般贫困户总户数</strong><span data-bind="text:normalPoverty"></span></p>
												<p class="cont-color cont-light-blue"><i></i><strong>已脱贫户数</strong><span data-bind="text:normalPovertyed"></span></p>
											</div>
											<div class="item-hide">
												<h4><i class="ico-30 ico-peoples"></i><strong>一般贫困户</strong></h4>
												<p>已完成脱贫</p>
												<div class="item-scale"><em data-bind="text:normalScale"></em></div>
											</div>
										</div>
										<div class="tab-item" data-type="low">
											<div class="item-show">
												<h4><i class="ico-30 ico-peoples active"></i><strong>低保贫困户</strong></h4>
												<p class="cont-color cont-blue"><i></i><strong>低保贫困户总户数</strong><span data-bind="text:lowPoverty"></span></p>
												<p class="cont-color cont-green"><i></i><strong>已脱贫户数</strong><span data-bind="text:lowPovertyed"></span></p>
											</div>
											<div class="item-hide">
												<h4><i class="ico-30 ico-peoples"></i><strong>低保贫困户</strong></h4>
												<p>已完成脱贫</p>
												<div class="item-scale"><em data-bind="text:lowScale"></em></div>
											</div>
										</div>
										<div class="tab-item" data-type="five">
											<div class="item-show">
												<h4><i class="ico-30 ico-peoples active"></i><strong>五保贫困户</strong></h4>
												<p class="cont-color cont-blue"><i></i><strong>五保贫困户总户数</strong><span data-bind="text:fivePoverty"></span></p>
												<p class="cont-color cont-orange"><i></i><strong>已脱贫户数</strong><span data-bind="text:fivePovertyed"></span></p>
											</div>
											<div class="item-hide">
												<h4><i class="ico-30 ico-peoples"></i><strong>五保贫困户</strong></h4>
												<p>已完成脱贫</p>
												<div class="item-scale"><em data-bind="text:fiveScale"></em></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="cont-box">
				<div class="row">
					<div class="col-xs-8">
						<div class="panel panel-poverty-info">
							<div class="panel-heading">
								<h4 class="panel-title"><i class="ico-title ico-t-build"></i><span><i><em data-bind="text:codeName"></em>扶贫脱贫情况</i></span></h4>
							</div>
							<div class="panel-body">
								<div id="povertyInfo" class="wraper"></div>
							</div>
						</div>
					</div>
					<div class="col-xs-4">
						<div class="panel panel-time-line">
							<div class="panel-heading">
								<h4 class="panel-title"><i class="ico-title ico-t-calendar"></i><span><i>安徽省扶贫大事记</i></span><strong data-bind="click:moreAchieve">更多&gt;&gt;</strong></h4>
							</div>
							<div class="panel-body">
								<div class="time-line-wrap">
									<div class="time-line">
										<div class="time-body-wrap">
											<div id="achieveList" class="time-line-body">
												<div class="time-line-item time-item-1">
													<h5>01 扶贫要闻</h5>
													<dl data-bind="source:fhywSource" data-template="newsTemp"></dl>
												</div>
												<div class="time-line-item time-item-2">
													<h5>02 政策法规</h5>
													<dl data-bind="source:zcfgSource" data-template="newsTemp"></dl>
												</div>
												<div class="time-line-item time-item-3">
													<h5>03 扶贫项目</h5>
													<dl data-bind="source:fpxmSource" data-template="newsTemp"></dl>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="cont-box">
				<div class="row">
					<div class="col-xs-8">
						<div class="panel panel-project-info">
							<div class="panel-heading">
								<h4 class="panel-title"><i class="ico-title ico-t-pc"></i><span><i><em data-bind="text:codeName"></em>扶贫项目情况</i></span></h4>
							</div>
							<div class="panel-body">
								<ul id="projectTab" class="project-tab"></ul>
								<div id="projectCont" class="project-cont"></div>
								<div class="empty-data" data-bind="invisible: emptyVisi"></div>
							</div>
						</div>
					</div>
					<div class="col-xs-4">
						<div class="panel panel-rank">
							<div class="panel-heading">
								<h4 class="panel-title"><i class="ico-title ico-t-list"></i><span><i>安徽省贫困县脱贫成效排名</i></span><strong data-bind="click:moreRank">更多&gt;&gt;</strong></h4>

							</div>
							<div class="panel-body">
								<ul data-bind="source: povertyRank" data-auto-bind="false" data-template="povertyRankTemp"></ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="index-footer">
			<div class = "bottom-font">
				<span>建设单位：安徽省扶贫办</span>
				<span style="margin-left:10px;">技术支持：科大讯飞股份有限公司</span>
			</div>
		</div>

		<script>
            var _hmt = _hmt || [];
            (function() {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?b7ef9b48f3cf9ae1761276b4aaffb963";
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s);
            })();
		</script>

	</div>
	<!-- 顶部菜单 -->
	<%--<script type="text/html" id="leadNavTemp">
		{{each $data as item i}}
		<div class="linker-item col-xs-2">
			<a {{if item.openUrl}} href="analysis.do"{{else}} href="indexinfo.do?_index={{i}}"{{/if}}>
			<i class="ico-nav {{item.iconClass}}"></i>
			<label class="linker-text">{{item.title}}</label>
			</a>
		</div>
		{{/each}}
	</script>--%>


	<!-- 大首页新闻列表 -->
	<script type="text/html" id="newsTemp">
		{{each $data as item i}}
		<dd>
			<p class="item-achieve" title="{{item.noticeTitle}}" data-bind="events:{click:openMsg}">{{item.title}}</p>
			<label>
				{{if item.publishTime != ''}}
				{{item.publishTime}}
				{{/if}}
			</label>
		</dd>
		{{/each}}
	</script>
	<!-- 脱贫成效排名 -->
	<script type="text/html" id="povertyRankTemp">
		{{each $data as item i}}
		<li class="row row-ie {{if item._index == 1}} color-red{{else if item._index == 2}} color-orange{{else if item._index == 3}} color-blue{{/if}}">
			<div class="col-xs-6">
				{{if item._index == 1}} <i class="ico-24 ico-rank-first">1</i>
				{{else if item._index == 2}} <i class="ico-24 ico-rank-secd">2</i>
				{{else if item._index == 3}} <i class="ico-24 ico-rank-third">3</i>
				{{else}}<i>{{item._index}}</i>{{/if}}
				<strong>{{item.countryName}}</strong>
			</div>
			<div class="col-xs-3">
				<span>{{item.overType}}</span>
			</div>
			<div class="col-xs-3 text-right">
				<em>{{item.percent}}</em>
			</div>
		</li>
		{{/each}}
	</script>

	<div id="changePasswd" style="display:none;">
		<input id="userId" type="hidden" value="4373e2ecfb8b0480e0533d3510accf92"/>
		<div class="form-control">
        <span class="label">
            <label> <i class="required"></i>
                原始密码：
            </label>
        </span>
			<input id="oldPasswd" type="password" data-role="textbox"
				   data-bind="value:form.oldPasswd"
				   name="oldPasswd"/>
		</div>
		<div class="form-control">
        <span class="label">
            <label> <i class="required"></i>
                新密码：
            </label>
        </span>
			<input id="newPasswd" type="password" data-role="textbox"
				   data-bind="value:form.newPasswd"
				   name="newPasswd"/>
		</div>
		<div class="form-control">
        <span class="label">
            <label> <i class="required"></i>
                确认新密码：
            </label>
        </span>
			<input id="rnewPasswd" type="password" data-role="textbox"
				   data-bind="value:form.rnewPasswd"
				   name="rnewPasswd"/>
		</div>
		<div class="form-control">
			<button type="button" data-bind="events:{click:saveEvent}" class="btn btn-warning">确认</button>
			<button type="button" data-bind="events:{click:cancelEvent}" class="btn btn-cancel">取消</button>
		</div>
	</div>
	<!--修改用户信息-->
	<div id="updataInfo" class="updata-info container-fluid" style="display: none;">
		<input id="userLoginId" type="hidden" value="4373e2ecfb8b0480e0533d3510accf92"/>
		<input id="userLoginName" type="hidden" value="34122502"/>
		<input id="fileId" type="hidden" />
		<h3>基本信息</h3>
		<div class="row row-ie">
			<div class="col-xs-6">
				<div class="form-control">
                <span class="label">
                    <label>登录名：</label>
                </span>
					<input id="loginName" type="text" data-role="textbox"
						   data-bind="value:form.loginName"
						   name="loginName" />
				</div>
				<div class="form-control">
                <span class="label">
                    <label><i class="required"></i>真实姓名：</label>
                </span>
					<input id="name" type="text" data-role="textbox"
						   data-bind="value:form.name"
						   name="name" />
				</div>
				<div class="form-control">
                <span class="label">
                    <label>身份证号：</label>
                </span>
					<input id="sfzh" type="text" data-role="textbox"
						   data-bind="value:form.sfzh"
						   name="sfzh" />
				</div>
				<div class="form-control">
                <span class="label">
                    <label><i class="required"></i>手机号码：</label>
                </span>
					<input id="mobilePhone" type="text" data-role="textbox"
						   data-bind="value:form.mobilePhone"
						   name="mobilePhone" />
				</div>
				<div class="form-control">
                <span class="label">
                    <label>电子邮箱：</label>
                </span>
					<input id="email" type="text" data-role="textbox"
						   data-bind="value:form.email"
						   name="email" />
				</div>
				<div class="form-control">
                <span class="label">
                    <label>性别：</label>
                </span>
					<input id="sex" type="text" data-role="dropdownlist"
						   data-bind="source: sexDict,value:form.sex"
						   name="sex" />
				</div>
				<div class="form-control">
                <span class="label">
                    <label>出生日期：</label>
                </span>
					<input id="birthday" type="text" data-role="datepicker"
						   data-bind="value:form.birthday"
						   data-format="yyyy-MM-dd"
						   name="birthday" >
				</div>
				<div class="form-control">
                <span class="label">
                    <label>民族：</label>
                </span>
					<input id="nation" type="text" data-role="dropdownlist"
						   data-bind="source:nationDict,value:form.nation"
						   name="nation" />
				</div>
				<div class="form-control">
                <span class="label">
                    <label>办公电话：</label>
                </span>
					<input id="officePhone" type="text" data-role="textbox"
						   data-bind="value:form.officePhone"
						   name="officePhone" />
				</div>
			</div>
			<div class="col-xs-6">
				<div class="form-control">
					<div class="right-phone-box">
						<img id="phoneImg" class="photo-wrap" src="/ahpad-web/common/readImg.do" alt="">
						<a id="phoneWarp" class="phone-img-btn" href="javaScript:void(null)"></a>
					</div>
				</div>
				<div class="form-control">
                <span class="label">
                    <label>学历：</label>
                </span>
					<input id="education" type="text" data-role="dropdownlist"
						   data-bind="source:educationDict,value:form.education"
						   name="education" />
				</div>
				<div class="form-control">
                <span class="label">
                    <label>政治面貌：</label>
                </span>
					<input id="zzmm" type="text" data-role="dropdownlist"
						   data-bind="source:zzmmDict,value:form.zzmm"
						   name="zzmm" />
				</div>
				<div class="form-control">
                <span class="label">
                    <label>邮政编码：</label>
                </span>
					<input id="zipcode" type="text" data-role="textbox"
						   data-bind="value:form.zipcode"
						   name="zipcode" />
				</div>
			</div>
			<div class="col-xs-12" style="margin-top:-10px;">
				<div class="form-control">
                <span class="label">
                    <label>住址：</label>
                </span>
					<input id="address" type="text" data-role="textbox"
						   data-bind="value:form.address"
						   name="address" />
				</div>
			</div>
		</div>
		<h3>机构信息</h3>
		<div class="row row-ie">
			<div class="col-xs-6">
				<div class="form-control">
                <span class="label">
                    <label>所属机构：</label>
                </span>
					<input id="fullName" type="text" data-role="textbox"
						   data-bind="value:form.fullName"
						   name="fullName" />
					<span data-bind="value:form.orgId" style="display: none"></span>
				</div>
			</div>
			<div class="col-xs-6">
				<div class="form-control">
                <span class="label">
                    <label>职务：</label>
                </span>
					<input id="zw" type="text" data-role="textbox"
						   data-bind="value:form.zw"
						   name="zw" />
				</div>
			</div>
		</div>
		<div class="row row-ie">
			<div class="col-xs-12 btn-group-xs">
				<button type="button" data-bind="events:{click:saveEvent}" class="btn btn-warning">确认</button>
				<button type="button" data-bind="events:{click:cancelEvent}" class="btn btn-cancel">取消</button>
			</div>
		</div>
	</div>
</body>
<script src="/ahpad-web/resources/js/plugins/require-2.1.11.js" data-main="/ahpad-web/resources/js/apps/pages/lead/index.js"></script>
</html>
