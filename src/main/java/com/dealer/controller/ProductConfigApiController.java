package com.dealer.controller;

import com.dealer.common.Page;
import com.dealer.common.PageResult;
import com.dealer.entity.ActivityConfig;
import com.dealer.entity.ProductConfig;
import com.dealer.service.ActivityConfigService;
import com.dealer.service.ProductConfigService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/productConfig")
public class ProductConfigApiController {

    @Autowired
    private ProductConfigService productConfigService;

    private static final Logger log = LoggerFactory.getLogger(ProductConfigApiController.class);

    @GetMapping("/list")
    public PageResult list(Page page) {
        // 1. 查询分页数据
        PageResult<ProductConfig> pageResult = productConfigService.page(page);
        return pageResult;
    }

    @GetMapping("/getProductConfigInfo")
    public List<ProductConfig> getProductConfigInfo(ProductConfig productConfig) {
        List<ProductConfig> result = productConfigService.getProductConfigInfo(productConfig);
        return result;
    }

    @GetMapping("/checkProductName")
    public Boolean checkProductName(ProductConfig productConfig) {
        List<ProductConfig> result3 = productConfigService.getProductConfigInfo(productConfig);
        Boolean isExist = true;
        List<ProductConfig> result = productConfigService.getProductConfigInfo(productConfig);
        if(result.size() > 0){
            if(null != productConfig.getId() && null != productConfig.getProductName()){
                if(productConfig.getProductName().equals(result.get(0).getProductName())){
                    isExist = false;
                }
            }
        }else {
            ProductConfig productConfig1 = new ProductConfig();
            productConfig1.setProductName(productConfig.getProductName());
            List<ProductConfig> result1 = productConfigService.getProductConfigInfo(productConfig1);
            if(result1.size() > 0){
                isExist = true;
            }else {
                isExist = false;
            }
        }
        return isExist;
    }


    @GetMapping("/all")
    public List<ProductConfig> getAllProductConfigInfo() {
        List<ProductConfig> result = productConfigService.getAllProductConfigInfo();
        return result;
    }



    // 新增接口：接收表单 + 保存 + 刷新列表
    @PostMapping("/add")
    public String add(ProductConfig productConfig) {
        if(null == productConfig){
            return  "0";
        }
        log.warn("add data:" + productConfig.toString());
        // 调用DAO保存数据
        productConfigService.insert(productConfig);
        // 重定向到列表页，实现自动刷新
        return "1";
    }

    // 编辑保存
    @PostMapping("/update")
    public String update(ProductConfig productConfig) {
        log.warn("update info: " + productConfig.toString());
        productConfigService.update(productConfig);
        return "1";
    }

    // 删除
    @GetMapping("/delete")
    public String delete(Long id) {
        productConfigService.delete(id);
        return "1";
    }
}
