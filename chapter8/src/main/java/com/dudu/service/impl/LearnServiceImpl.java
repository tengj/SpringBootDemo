package com.dudu.service.impl;

import com.dudu.dao.LearnDao;
import com.dudu.domain.LearnResouce;
import com.dudu.service.LearnService;
import com.dudu.tools.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Created by tengj on 2017/4/7.
 */
@Service
public class LearnServiceImpl implements LearnService {

    @Autowired
    LearnDao learnDao;
    @Override
    public int add(LearnResouce learnResouce) {
        return this.learnDao.add(learnResouce);
    }

    @Override
    public int update(LearnResouce learnResouce) {
        return this.learnDao.update(learnResouce);
    }

    @Override
    public int deleteByIds(String ids) {
        return this.learnDao.deleteByIds(ids);
    }

    @Override
    public LearnResouce queryLearnResouceById(Long id) {
        return this.learnDao.queryLearnResouceById(id);
    }

    @Override
    public Page queryLearnResouceList(Map<String,Object> params) {
        return this.learnDao.queryLearnResouceList(params);
    }
}
