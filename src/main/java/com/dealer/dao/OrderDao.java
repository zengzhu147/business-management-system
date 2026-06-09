package com.dealer.dao;

import com.dealer.common.Page;
import com.dealer.entity.Order;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface OrderDao {
    List<Order> selectPage(Page page);
    long selectCount();

    List<Order> getOrderInfo(Order order);

    void insert(Order order);

    void update(Order order);

    void delete(Long id);
}