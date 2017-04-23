package com.dudu.tools;

import org.apache.commons.lang3.StringUtils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 合法性校验工具
 * 
 * @author Administrator
 *
 */
public class ValidatorUtil {

	/**
	 * 功能：手机号验证
	 * 
	 * @param str
	 * @return
	 */
	public static boolean isMobile(String str) {
		Pattern p = null;
		Matcher m = null;
		boolean b = false;
		if (StringUtils.isBlank(str)) {
			return b;
		}
		p = Pattern.compile("^[1][3,4,5,8][0-9]{9}$"); // 验证手机号
		m = p.matcher(str);
		b = m.matches();
		return b;
	}

	/**
	 * 功能：数字判断
	 * @param str
	 * @return
	 */
	public static boolean isNumeric(String str) {
		if (StringUtils.isBlank(str)) {
			return false;
		}
		
		if (str.matches("\\d*")) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * 判断密码格式是否正确(只能是数组或者字母，并存长度为[6,12])
	 * @param passwd
	 * @return
	 * @author wyongjian
	 * @date 2014-11-18
	 */
	public static boolean isPasswd(String passwd){
		if(StringUtils.isBlank(passwd))return false;
		if(passwd.length()<6 || passwd.length()>12)return false;
		String regEx="^[A-Za-z0-9_]+$";
	    Pattern p=Pattern.compile(regEx);
	    Matcher m=p.matcher(passwd);
	    return m.matches();
	}
	
	/**
	 * 判断是否是IPv4
	 * @param input
	 * @return
	 */
	public static boolean isIPv4Address(String input) {
		Pattern IPV4_PATTERN = Pattern
				.compile("^(25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)(\\.(25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)){3}$");
		return IPV4_PATTERN.matcher(input).matches();
	}
	
	/**
	 * 判断是否是MAC地址
	 * @param mac
	 * @return
	 * @author wyongjian
	 * @date 2014-11-26
	 */
	public static boolean isMac(String mac){
		if(StringUtils.isNotBlank(mac)){
			mac = mac.toUpperCase();
			
			//正则校验MAC合法性  
		    String patternMac="^[A-F0-9]{2}(:[A-F0-9]{2}){5}$";  
		    if(Pattern.compile(patternMac).matcher(mac).find()){  
		    	return true;
	        } 
		}
	    return false;
	}

	/**
	 * 判断用户名格式是否正确(只能是数组、字母或者下划线)
	 * @param username
	 * @return
	 */
	public static boolean isUsername(String username){
		if(StringUtils.isBlank(username))return false;
		String regEx="^[A-Za-z0-9_]+$";
	    Pattern p=Pattern.compile(regEx);
	    Matcher m=p.matcher(username);
	    return m.matches();
	}
	
	/**
	 * 字符串是否包含中文
	 * @param source
	 * @return
	 */
	public static boolean isContainsChinese(String source){
		final String regEx = "[\u4e00-\u9fa5]";
		final Pattern pat = Pattern.compile(regEx);
		boolean flag = false;
		Matcher matcher = pat.matcher(source);
		if(matcher.find()) {
			flag = true;
		}
		return flag;
	}
	
	public static boolean isEmail(String email){
		
//		final String regEx="/[^@]+@[^@]/";
		final String regEx="^([a-z0-9A-Z]+[-|_|\\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$";
		final Pattern pat = Pattern.compile(regEx);
		boolean flag = false;
		Matcher matcher = pat.matcher(email);
		flag = matcher.matches();
		
		return flag;
	}
}
