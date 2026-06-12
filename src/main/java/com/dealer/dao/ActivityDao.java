package com.dealer.dao;

import com.dealer.common.Page;
import com.dealer.entity.Activity;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ActivityDao {
    List<Activity> selectPage(Page page);
    long selectCount();

    List<Activity> getActivityInfo(Activity activity);

    void insert(Activity activity);

    void update(Activity activity);

    int delete(Long id);
}
