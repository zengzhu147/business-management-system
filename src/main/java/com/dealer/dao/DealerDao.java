package com.dealer.dao;

import com.dealer.common.Page;
import com.dealer.entity.Dealer;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface DealerDao {
    List<Dealer> selectPage(Page page);
    long selectCount();

    List<Dealer> getAllDealer();

    void insert(Dealer dealer);

    void update(Dealer dealer);

    int delete(Long id);
}