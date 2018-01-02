<!DOCTYPE html>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!--[if lt IE 7 ]><html lang="en" class="no-js ie6"> <![endif]-->
<!--[if IE 7 ]><html lang="en" class="no-js ie7"> <![endif]-->
<!--[if IE 8 ]><html lang="en" class="no-js ie8"> <![endif]-->
<!--[if IE 9 ]><html lang="en" class="no-js ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--><html lang="en" class="no-js" > <!--<![endif]-->
<head>
	<meta charset="utf-8"/>
	<meta name="author" content="" />
	<meta name="keywords" content="" />
	<meta name="viewport" content="width=device-width,initial-scale=1" />
	<title></title>

	<!-- main JS libs -->
	<script src="${pageContext.request.contextPath}/vanilla-cream-css/js/libs/modernizr.min.js"></script>
	<script src="${pageContext.request.contextPath}/vanilla-cream-css/js/libs/jquery-1.10.0.js"></script>
	<script src="${pageContext.request.contextPath}/vanilla-cream-css/js/libs/jquery-ui.min.js"></script>
	<script src="${pageContext.request.contextPath}/vanilla-cream-css/js/libs/bootstrap.min.js"></script>

	<!-- Style CSS -->
	<link rel="stylesheet" href="${pageContext.request.contextPath}/vanilla-cream-css/css/bootstrap.css" />
	<link rel="stylesheet" href="${pageContext.request.contextPath}/vanilla-cream-css/style.css" />
	<!-- scripts -->
	<script src="${pageContext.request.contextPath}/vanilla-cream-css/js/general.js"></script>

	<!-- Include all needed stylesheets and scripts here -->

	<!--[if lt IE 9]><script src="${pageContext.request.contextPath}/vanilla-cream-css/js/respond.min.js"></script><![endif]-->
	<!--[if gte IE 9]>
	<style type="text/css">
		.gradient {filter: none !important;}
	</style>
	<![endif]-->
</head><body style="background-image: none;">
<div class="body_wrap">
	<div class="container">
		<div class="alert alert-success text-center" role="alert">Sptring Boot学习资源大奉送，爱我就关注嘟嘟公众号：嘟爷java超神学堂</div>
		<table class="table table-striped table-bordered">
			<tr>
				<td>作者</td>
				<td>教程名称</td>
				<td>地址</td>
			</tr>
			<c:forEach var="learn" items="${learnList}">
				<tr class="text-info">
					<td>${learn.author}</td>
					<td>${learn.title}</td>
					<td><a href="${learn.url}" class="btn btn-search btn-green" target="_blank"><span>点我</span></a>
					</td>
				</tr>
			</c:forEach>
		</table>
	</div>
</div>
</body>


</html>