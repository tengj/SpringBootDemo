package com.dudu.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

/** 主页
 * Created by tengj on 2017/4/10.
 */


@Controller
public class IndexController  extends  AbstractController{

    @RequestMapping("/main")
    public String main(Model model){
        model.addAttribute("ctx", getContextPath()+"/");
        return "main";
    }

    @RequestMapping("/index")
    public String index(Model model){
        model.addAttribute("ctx", getContextPath()+"/");
        return "index";
    }

    @RequestMapping("")
    public String index1(Model model){
        model.addAttribute("ctx", getContextPath()+"/");
        return "index";
    }
}
