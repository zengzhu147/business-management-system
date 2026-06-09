package com.dealer.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/activityConfig")
public class ActivityConfigController {

    @GetMapping("/activityConfigPage")
    public String activityConfigPage(){
        return "activityConfig";
    }
}
