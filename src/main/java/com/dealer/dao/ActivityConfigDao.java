package com.dealer.dao;

import com.dealer.common.Page;
import com.dealer.entity.ActivityConfig;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ActivityConfigDao {
    List<ActivityConfig> selectPage(Page page);
    long selectCount();

    List<ActivityConfig> getActivityConfigInfo(ActivityConfig activityConfig);

    void insert(ActivityConfig activityConfig);

    void update(ActivityConfig activityConfig);

    int delete(Long id);
}
