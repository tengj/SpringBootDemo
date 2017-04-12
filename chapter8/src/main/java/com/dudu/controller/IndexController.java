package com.dudu.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by tengj on 2017/4/10.
 */


@Controller
public class IndexController {

    @RequestMapping("/main")
    public String main(){
        return "main";
    }

    @RequestMapping("/index")
    public String index(){
        return "index";
    }
}
