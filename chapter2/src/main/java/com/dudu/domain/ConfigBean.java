package com.dudu.domain;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Created by tengj on 2017/2/27.
 */
// 通过@ConfigurationProperties加载properties文件内的配置，通过prefix属性指定properties的配置的前缀，通过locations指定properties文件的位置


@ConfigurationProperties(prefix = "com.dudu")
public class ConfigBean {
    private String name;
    private String want;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getWant() {
        return want;
    }

    public void setWant(String want) {
        this.want = want;
    }
}
