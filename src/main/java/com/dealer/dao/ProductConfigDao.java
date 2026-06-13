package com.dealer.dao;

import com.dealer.common.Page;
import com.dealer.entity.ProductConfig;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ProductConfigDao {

    List<ProductConfig> selectPage(Page page);
    long selectCount();

    List<ProductConfig> getProductConfigInfo(ProductConfig productConfig);

    List<ProductConfig> getAllProductConfigInfo();

    void insert(ProductConfig productConfig);

    void update(ProductConfig productConfig);

    int delete(Long id);
}
