package com.dealer.controller;

import com.dealer.common.Page;
import com.dealer.common.PageResult;
import com.dealer.entity.Dealer;
import com.dealer.service.DealerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/dealer")
public class DealerController {

    private final DealerService dealerService;

    private static final Logger log = LoggerFactory.getLogger(DealerController.class);

    public DealerController(DealerService dealerService) {
        this.dealerService = dealerService;
    }

    @GetMapping("/dealerPage")
    public String dealerPage(){
        return "dealer";
    }

}