package com.dudu.domain;

import javax.persistence.*;

@Table(name = "user")
public class User {
    /**
     * ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 用户名
     */
    private String name;

    /**
     * 密码
     */
    private String passwrod;

    /**
     * 获取ID
     *
     * @return id - ID
     */
    public Long getId() {
        return id;
    }

    /**
     * 设置ID
     *
     * @param id ID
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * 获取用户名
     *
     * @return name - 用户名
     */
    public String getName() {
        return name;
    }

    /**
     * 设置用户名
     *
     * @param name 用户名
     */
    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    /**
     * 获取密码
     *
     * @return passwrod - 密码
     */
    public String getPasswrod() {
        return passwrod;
    }

    /**
     * 设置密码
     *
     * @param passwrod 密码
     */
    public void setPasswrod(String passwrod) {
        this.passwrod = passwrod == null ? null : passwrod.trim();
    }
}