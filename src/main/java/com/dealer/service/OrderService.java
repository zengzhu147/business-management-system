package com.dealer.service;

import com.dealer.common.Page;
import com.dealer.common.PageResult;
import com.dealer.dao.DealerDao;
import com.dealer.dao.OrderDao;
import com.dealer.dao.RegionDao;
import com.dealer.entity.Dealer;
import com.dealer.entity.Order;
import com.dealer.entity.Region;
import com.sun.org.apache.xpath.internal.operations.Or;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Service;
import javax.annotation.Resource;
import java.util.List;

@Service
public class OrderService {

    @Resource
    private OrderDao orderDao;

    public PageResult<Order> page(Page page) {
        // 查询数据列表
        List<Order> list = orderDao.selectPage(page);
        // 查询总条数
        long total = orderDao.selectCount();
        // 封装返回
        PageResult<Order> result = new PageResult(list,total,page);
        return result;
    }

    public List<Order> getOrderInfo(Order order) {
        List<Order> result = orderDao.getOrderInfo(order);
        return result;
    }

    public void insert(Order order ){
        orderDao.insert(order);
    }

    public void update(Order order) {
        orderDao.update(order);
    }

    public void delete(Long id){
        orderDao.delete(id);
    }

}