package com.dudu.dao;

import com.dudu.domain.LearnResouce;
import com.dudu.tools.Page;

import java.util.Map;

/**
 * Created by tengj on 2017/4/8.
 */
public interface LearnDao {
    int add(LearnResouce learnResouce);
    int update(LearnResouce learnResouce);
    int deleteByIds(String ids);
    LearnResouce queryLearnResouceById(Long id);
    Page queryLearnResouceList(Map<String,Object> params);
}
