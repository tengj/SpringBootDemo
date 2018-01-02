package com.dudu.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by tengj on 2017/3/7.
 */
@Controller
@RequestMapping("/lead")
public class LoginController {

    @RequestMapping("")
    public String index(){
        return "/ahpad-web/lead";
    }
}
