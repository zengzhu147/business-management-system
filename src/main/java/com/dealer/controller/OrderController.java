package com.dealer.controller;


import com.dealer.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/order")
public class OrderController {
    // 请求：http://localhost:8080/order/orderPage
    @GetMapping("/orderPage")
    public String orderPage(){
        return "order";
    }
}