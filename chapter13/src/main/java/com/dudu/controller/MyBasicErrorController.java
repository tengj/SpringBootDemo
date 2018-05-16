package com.dudu.controller;

import org.springframework.boot.autoconfigure.web.BasicErrorController;
import org.springframework.boot.autoconfigure.web.DefaultErrorAttributes;
import org.springframework.boot.autoconfigure.web.ErrorAttributes;
import org.springframework.boot.autoconfigure.web.ErrorProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

@Controller
public class MyBasicErrorController extends BasicErrorController {

    public MyBasicErrorController() {
        super(new DefaultErrorAttributes(), new ErrorProperties());
    }

    /**
     * 定义500的ModelAndView
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(produces = "text/html",value = "/500")
    public ModelAndView errorHtml500(HttpServletRequest request,
                                     HttpServletResponse response) {
        response.setStatus(getStatus(request).value());
        Map<String, Object> model = getErrorAttributes(request,
                isIncludeStackTrace(request, MediaType.TEXT_HTML));
        model.put("msg","自定义错误信息");
        return new ModelAndView("error/500", model);
    }


    /**
     * 定义500的错误JSON信息
     * @param request
     * @return
     */
    @RequestMapping(value = "/500")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> error500(HttpServletRequest request) {
        Map<String, Object> body = getErrorAttributes(request,
                isIncludeStackTrace(request, MediaType.TEXT_HTML));
        HttpStatus status = getStatus(request);
        return new ResponseEntity<Map<String, Object>>(body, status);
    }


    /**
     * 定义500的ModelAndView
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(produces = "text/html",value = "/404")
    public ModelAndView errorHtml400(HttpServletRequest request,
                                     HttpServletResponse response) {
        response.setStatus(getStatus(request).value());
        Map<String, Object> model = getErrorAttributes(request,
                isIncludeStackTrace(request, MediaType.TEXT_HTML));
        model.put("msg","自定义错误信息");
        return new ModelAndView("error/404", model);
    }
}
