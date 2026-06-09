package com.dealer.controller;

import com.dealer.common.Page;
import com.dealer.common.PageResult;
import com.dealer.entity.Order;
import com.dealer.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/order")
public class OrderApiController {

    @Autowired
    private OrderService orderService;

    private static final Logger log = LoggerFactory.getLogger(OrderApiController.class);

    @GetMapping("/list")
    public PageResult list(Page page) {
        // 1. 查询分页数据
        PageResult<Order> pageResult = orderService.page(page);
        return pageResult;
    }

    @GetMapping("/getOrderInfo")
    public List<Order> getOrderInfo(Order order) {
        List<Order> result = orderService.getOrderInfo(order);
        return result;
    }



    // 新增接口：接收表单 + 保存 + 刷新列表
    @PostMapping("/add")
    public String add(Order order) {
        if(null == order){
            return  "0";
        }
        log.warn("add data:" + order.toString());
        // 调用DAO保存数据
        orderService.insert(order);
        // 重定向到列表页，实现自动刷新
        return "1";
    }

    // 编辑保存
    @PostMapping("/update")
    public String update(Order dealer) {
        log.warn("update info: " + dealer.toString());
        orderService.update(dealer);
        return "1";
    }

    // 删除
    @GetMapping("/delete")
    public String delete(Long id) {
        orderService.delete(id);
        return "1";
    }
}
