package com.dealer.service;

import com.dealer.common.Page;
import com.dealer.common.PageResult;
import com.dealer.dao.ProductConfigDao;
import com.dealer.entity.ProductConfig;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class ProductConfigService {

    @Resource
    private ProductConfigDao productConfigDao;

    public PageResult<ProductConfig> page(Page page) {
        // 查询数据列表
        List<ProductConfig> list = productConfigDao.selectPage(page);
        // 查询总条数
        long total = productConfigDao.selectCount();
        // 封装返回
        PageResult<ProductConfig> result = new PageResult(list,total,page);
        return result;
    }

    public List<ProductConfig> getProductConfigInfo(ProductConfig productConfig) {
        List<ProductConfig> result = productConfigDao.getProductConfigInfo(productConfig);
        return result;
    }

    public List<ProductConfig> getAllProductConfigInfo() {
        List<ProductConfig> result = productConfigDao.getAllProductConfigInfo();
        return result;
    }



    public void insert(ProductConfig productConfig ){
        productConfigDao.insert(productConfig);
    }

    public void update(ProductConfig productConfig) {
        productConfigDao.update(productConfig);
    }

    public void delete(Long id){
        productConfigDao.delete(id);
    }
}
