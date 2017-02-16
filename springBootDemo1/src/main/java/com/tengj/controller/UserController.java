package com.tengj.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by tengj on 2017/2/14.
 */
@RestController
@RequestMapping("/user")
public class UserController {
    @Value(value="${config.name}")
    private String name;

    @RequestMapping(value="",method = RequestMethod.GET)
    public String hello() {
        System.out.println("用户名="+name);
        return "Hello Spring-Boot 修改了哦~~~~~";
    }
}


