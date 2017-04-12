package com.dudu.dao.impl;

import com.dudu.dao.LearnDao;
import com.dudu.domain.LearnResouce;
import com.dudu.tools.Page;
import com.dudu.tools.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by tengj on 2017/4/8.
 */
@Repository
public class LearnDaoImpl  implements LearnDao{
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public int add(LearnResouce learnResouce) {
        return jdbcTemplate.update("insert into learn_resource(author, title,url) values(?, ?, ?)",learnResouce.getAuthor(),learnResouce.getTitle(),learnResouce.getUrl());
    }

    @Override
    public int update(LearnResouce learnResouce) {
        return jdbcTemplate.update("update learn_resource set author=?,title=?,url=? where id = ?",new Object[]{learnResouce.getAuthor(),learnResouce.getTitle(),learnResouce.getUrl(),learnResouce.getId()});
    }

    @Override
    public int deleteByIds(String ids){
        return jdbcTemplate.update("delete from learn_resource where id in("+ids+")");
    }

    @Override
    public LearnResouce queryLearnResouceById(Long id) {
        List<LearnResouce> list = jdbcTemplate.query("select * from learn_resource where id = ?", new Object[]{id}, new BeanPropertyRowMapper(LearnResouce.class));
        if(null != list && list.size()>0){
            LearnResouce learnResouce = list.get(0);
            return learnResouce;
        }else{
            return null;
        }
    }

    @Override
    public Page queryLearnResouceList(Map<String,Object> params) {
        StringBuffer sql =new StringBuffer();
        sql.append("select * from learn_resource where 1=1");
        if(!StringUtil.isNull((String)params.get("author"))){
            sql.append(" and author like '%").append((String)params.get("author")).append("%'");
        }
        if(!StringUtil.isNull((String)params.get("title"))){
            sql.append(" and title like '%").append((String)params.get("title")).append("%'");
        }
        Page page = new Page(sql.toString(), Integer.parseInt(params.get("page").toString()), Integer.parseInt(params.get("rows").toString()), jdbcTemplate);
        return page;
    }
}
