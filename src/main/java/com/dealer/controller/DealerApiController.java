package com.dealer.controller;

import com.dealer.common.Page;
import com.dealer.common.PageResult;
import com.dealer.entity.Dealer;
import com.dealer.service.DealerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dealer")
public class DealerApiController {

    @Autowired
    private DealerService dealerService;

    private static final Logger log = LoggerFactory.getLogger(DealerApiController.class);

    // 请求：http://localhost:8080/api/dealer/list?pageNum=1&pageSize=10
    @GetMapping("/list")
    public PageResult list(Page page) {
        // 1. 查询分页数据
        PageResult<Dealer> pageResult = dealerService.page(page);
        return pageResult;
    }

    @GetMapping("/all")
    public List<Dealer> allDealer() {
        // 1. 查询分页数据
        List<Dealer> result = dealerService.getAllDealer();
        return result;
    }

    // 新增接口：接收表单 + 保存 + 刷新列表
    @PostMapping("/add")
    public String add(Dealer dealer) {
        if(null == dealer){
            return  "0";
        }
        log.warn("add data:" + dealer.toString());
        // 调用DAO保存数据
        dealerService.insert(dealer);
        // 重定向到列表页，实现自动刷新
        return "1";
    }

    // 编辑保存
    @PostMapping("/update")
    public String update(Dealer dealer) {
        log.warn("update info: " + dealer.toString());
        dealerService.update(dealer);
        return "1";
    }

    // 删除
    @GetMapping("/delete")
    public String delete(Long id) {
        dealerService.delete(id);
        return "1";
    }
}
