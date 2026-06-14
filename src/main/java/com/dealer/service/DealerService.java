package com.dealer.service;

import com.dealer.common.Page;
import com.dealer.common.PageResult;
import com.dealer.dao.DealerDao;
import com.dealer.dao.OrderDao;
import com.dealer.dao.RegionDao;
import com.dealer.entity.Dealer;
import com.dealer.entity.Order;
import com.dealer.entity.Region;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Service;
import javax.annotation.Resource;
import java.util.List;

@Service
public class DealerService {

    @Resource
    private DealerDao dealerDao;

    public PageResult<Dealer> page(Page page) {
        // 查询数据列表
        List<Dealer> list = dealerDao.selectPage(page);
        // 查询总条数
        long total = dealerDao.selectCount();
        // 封装返回
        PageResult<Dealer> result = new PageResult(list,total,page);
        return result;
    }

    public List<Dealer> getAllDealer() {
        // 查询数据列表
        List<Dealer> list = dealerDao.getAllDealer();
        return list;
    }

    public List<Dealer> getDealerInfo(Dealer dealer) {
        // 查询数据列表
        List<Dealer> list = dealerDao.getDealerInfo(dealer);
        return list;
    }




    public void insert(Dealer dealer){
        dealerDao.insert(dealer);
    }

    public void update(Dealer dealer) {
        dealerDao.update(dealer);
    }

    public void delete(Long id){
        dealerDao.delete(id);
    }

}