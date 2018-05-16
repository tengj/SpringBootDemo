package com.dudu.util;

import java.io.Serializable;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * 分页工具类
 * @param <T>
 */
public class Page<T> implements Serializable {
    private int page; //当前页
    private int rows; //每页多少条
    private static final long serialVersionUID = 1L;
    private List<T> records = Collections.emptyList();
    private Map<String, Object> condition;

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getRows() {
        return rows;
    }

    public void setRows(int rows) {
        this.rows = rows;
    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public List<T> getRecords() {
        return records;
    }

    public void setRecords(List<T> records) {
        this.records = records;
    }

    public Map<String, Object> getCondition() {
        return condition;
    }

    public void setCondition(Map<String, Object> condition) {
        this.condition = condition;
    }
}
