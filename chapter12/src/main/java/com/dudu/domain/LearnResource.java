package com.dudu.domain;

import javax.persistence.*;

@Table(name = "learn_resource")
public class LearnResource {
    /**
     * ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 作者
     */
    private String author;

    /**
     * 描述
     */
    private String title;

    /**
     * 地址链接
     */
    private String url;

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
     * 获取作者
     *
     * @return author - 作者
     */
    public String getAuthor() {
        return author;
    }

    /**
     * 设置作者
     *
     * @param author 作者
     */
    public void setAuthor(String author) {
        this.author = author == null ? null : author.trim();
    }

    /**
     * 获取描述
     *
     * @return title - 描述
     */
    public String getTitle() {
        return title;
    }

    /**
     * 设置描述
     *
     * @param title 描述
     */
    public void setTitle(String title) {
        this.title = title == null ? null : title.trim();
    }

    /**
     * 获取地址链接
     *
     * @return url - 地址链接
     */
    public String getUrl() {
        return url;
    }

    /**
     * 设置地址链接
     *
     * @param url 地址链接
     */
    public void setUrl(String url) {
        this.url = url == null ? null : url.trim();
    }
}