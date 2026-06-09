package com.dealer.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/productConfig")
public class ProductConfigController {
    // 请求：http://localhost:8080/productConfig/productConfigPage
    @GetMapping("/productConfigPage")
    public String productConfigPage(){
        return "productConfig";
    }
}
