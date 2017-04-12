package com.dudu.tools;

import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;
/**
 * Created by tengj on 2017/4/11.
 */
public class Page {
    //一页显示的记录数
    private int numPerPage;
    //记录总数
    private int totalRows;
    //总页数
    private int totalPages;
    //当前页码
    private int currentPage;
    //起始行数
    private int startIndex;
    //结束行数
    private int lastIndex;
    //结果集存放List
    private List<Map<String, Object>> resultList;


    /**分页构造函数
     * @param sql 包含筛选条件的sql，但不包含分页相关约束，如mysql的limit
     * @param currentPage 当前页
     * @param numPerPage 每页记录数
     * @param jdbcTemplate jdbcTemplate实例
     */
    public Page(String sql,int currentPage,int numPerPage,JdbcTemplate jdbcTemplate){
        if(jdbcTemplate == null){
            throw new IllegalArgumentException("Page.jdbcTemplate is null");
        }else if(sql == null || sql.equals("")){
            throw new IllegalArgumentException("Page.sql is empty");
        }
        //设置每页显示记录数
        setNumPerPage(numPerPage);
        //设置要显示的页数
        setCurrentPage(currentPage);
        //计算总记录数
        StringBuffer totalSQL = new StringBuffer(" SELECT count(*) FROM ( ");
        totalSQL.append(sql);
        totalSQL.append(" ) totalTable ");
        //总记录数
        setTotalRows(jdbcTemplate.queryForObject(totalSQL.toString(),Integer.class));
        //计算总页数
        setTotalPages();
        //计算起始行数
        setStartIndex();
        //计算结束行数
        setLastIndex();
        System.out.println("lastIndex="+lastIndex);
        //使用mysql时直接使用limits
        StringBuffer paginationSQL = new StringBuffer();
        paginationSQL.append(sql);
        paginationSQL.append(" limit " + startIndex + "," + lastIndex);
        //装入结果集
        setResultList(jdbcTemplate.queryForList(paginationSQL.toString()));
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public int getNumPerPage() {
        return numPerPage;
    }

    public void setNumPerPage(int numPerPage) {
        this.numPerPage = numPerPage;
    }

    public List<Map<String, Object>> getResultList() {
        return resultList;
    }

    public void setResultList(List<Map<String, Object>> resultList) {
        this.resultList = resultList;
    }

    public int getTotalPages() {
        return totalPages;
    }

    //计算总页数
    public void setTotalPages() {
        if(totalRows % numPerPage == 0){
            this.totalPages = totalRows / numPerPage;
        }else{
            this.totalPages = (totalRows / numPerPage) + 1;
        }
    }

    public int getTotalRows() {
        return totalRows;
    }

    public void setTotalRows(int totalRows) {
        this.totalRows = totalRows;
    }

    public int getStartIndex() {
        return startIndex;
    }

    public void setStartIndex() {
        this.startIndex = (currentPage - 1) * numPerPage;
    }

    public int getLastIndex() {
        return lastIndex;
    }


    //计算结束时候的索引
    public void setLastIndex() {
        System.out.println("totalRows="+totalRows);///////////
        System.out.println("numPerPage="+numPerPage);///////////
        if( totalRows < numPerPage){
            this.lastIndex = totalRows;
        }else if((totalRows % numPerPage == 0) || (totalRows % numPerPage != 0 && currentPage < totalPages)){
            this.lastIndex = currentPage * numPerPage;
        }else if(totalRows % numPerPage != 0 && currentPage == totalPages){//最后一页
            this.lastIndex = totalRows ;
        }
    }
}
