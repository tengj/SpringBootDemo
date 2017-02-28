package com.dudu.domain;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

/**
 * Created by tengj on 2017/2/27.
 */
// 1.4版本的可以 通过@ConfigurationProperties加载properties文件内的配置，通过prefix属性指定properties的配置的前缀，通过locations指定properties文件的位置
//1.5版本后没有locations属性了，需要配合使用后@Configuration和@PropertySource("classpath:test.properties")来指定
@Configuration
@ConfigurationProperties(prefix = "com.md")
@PropertySource("classpath:test.properties")
public class ConfigTestBean {
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
