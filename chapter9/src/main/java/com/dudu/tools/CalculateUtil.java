package com.dudu.tools;

import java.util.Random;

public class CalculateUtil {
	
	//随机码字典集
    private static final String RANDOM_STR="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";  

	/**
	 * 取某个范围的任意数
	 * @param min
	 * @param max
	 * @return
	 */
	public static int getNext(int min, int max) {
		Random random = new Random();
		int s = random.nextInt(max) % (max - min + 1) + min;
		return s;
	}
	
	/**
	 * 取某个范围的任意数
	 * @param min
	 * @param max
	 * @return
	 */
	public static int getNext(int max) {
		Random random = new Random();
		int s = random.nextInt(max) ;
		return s;
	}
	
	/**
	 * 生成sum位随机码
	 * @return
	 */
	public static String generateDigitRandomCode(int sum){
		Random rd = new Random();
		String n = "";
		int getNum;
		do {
			getNum = Math.abs(rd.nextInt(Integer.MAX_VALUE)) % 10 + 48;// 产生数字0-9的随机数
			char num1 = (char) getNum;
			String dn = Character.toString(num1);
			n += dn;
		} while (n.length() < sum);

		return n;
	}
	
	/**
	 * 生成sum位数字字母随机码
	 * @param sum
	 * @return
	 */
	public static String generateMixRandomCode(int sum){  
        Random random = new Random();  
        StringBuffer sb = new StringBuffer();  
          
        for(int i = 0 ; i < sum; ++i){  
            int number = random.nextInt(62);//[0,62)  
              
            sb.append(RANDOM_STR.charAt(number));  
        }  
        return sb.toString();  
    }  
	
	/**
	 * IP 地址转换成 long 数据
	 * @param ipAddress
	 * @return
	 */
	public static long ipAddressToLong(String ipAddress) {
		long ipInt = 0;
		if (ValidatorUtil.isIPv4Address(ipAddress)) {
			String[] ipArr = ipAddress.split("\\.");
			if (ipArr.length == 3) {
				ipAddress = ipAddress + ".0";
			}
			ipArr = ipAddress.split("\\.");
			long p1 = Long.parseLong(ipArr[0]) * 256 * 256 * 256;
			long p2 = Long.parseLong(ipArr[1]) * 256 * 256;
			long p3 = Long.parseLong(ipArr[2]) * 256;
			long p4 = Long.parseLong(ipArr[3]);
			ipInt = p1 + p2 + p3 + p4;
		}
		return ipInt;
	}

}
