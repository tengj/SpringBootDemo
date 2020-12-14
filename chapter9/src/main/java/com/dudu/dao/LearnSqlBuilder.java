package com.dudu.dao;

import com.dudu.tools.StringUtil;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.Map;

//@Component
public class LearnSqlBuilder {
    public String queryLearnResouceByParams(final Map<String, Object> params) {
        StringBuffer sql =new StringBuffer();
        sql.append("select * from learn_resource where 1=1");
        if(!StringUtil.isNull((String)params.get("author"))){
            sql.append(" and author like '%").append((String)params.get("author")).append("%'");
        }
        if(!StringUtil.isNull((String)params.get("title"))){
            sql.append(" and title like '%").append((String)params.get("title")).append("%'");
        }
        System.out.println("查询sql=="+sql.toString());
        return sql.toString();
    }

    //删除的方法
    public String deleteByids(@Param("ids") final String[] ids){
        StringBuffer sql =new StringBuffer();
        sql.append("DELETE FROM learn_resource WHERE id in(");
        for (int i=0;i<ids.length;i++){
            if(i==ids.length-1){
                sql.append(ids[i]);
            }else{
                sql.append(ids[i]).append(",");
            }
        }
        sql.append(")");
        return sql.toString();
    }
}
