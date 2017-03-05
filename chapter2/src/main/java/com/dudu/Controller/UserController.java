package com.dudu.Controller;

import com.dudu.domain.ConfigBean;
import com.dudu.domain.ConfigTestBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by tengj on 2017/2/27.
 */
@RestController
public class UserController {

    @Value("${com.dudu.name}")
    private  String name;
    @Value("${com.dudu.want}")
    private  String want;

    @Autowired
    ConfigBean configBean;

    @Autowired
    ConfigTestBean configTestBean;


    @Value("${com.dudu.yearhope}")
    private String yearhope;


    @RequestMapping("/")
    public String hexo(){
        //return configBean.getName()+configBean.getWant();
        //return yearhope;
        return configBean.getName()+configBean.getWant();
    }
}
