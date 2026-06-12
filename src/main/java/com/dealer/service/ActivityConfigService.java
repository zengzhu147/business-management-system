package com.dealer.service;

import com.dealer.common.Page;
import com.dealer.common.PageResult;
import com.dealer.dao.ActivityConfigDao;
import com.dealer.entity.ActivityConfig;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class ActivityConfigService {
    @Resource
    private ActivityConfigDao activityConfigDao;

    public PageResult<ActivityConfig> page(Page page) {
        // 查询数据列表
        List<ActivityConfig> list = activityConfigDao.selectPage(page);
        // 查询总条数
        long total = activityConfigDao.selectCount();
        // 封装返回
        PageResult<ActivityConfig> result = new PageResult(list,total,page);
        return result;
    }

    public List<ActivityConfig> getActivityConfigInfo(ActivityConfig activityConfig) {
        List<ActivityConfig> result = activityConfigDao.getActivityConfigInfo(activityConfig);
        return result;
    }

    public List<ActivityConfig> getAllActivityConfig() {
        List<ActivityConfig> result = activityConfigDao.getAllActivityConfig();
        return result;
    }


    public void insert(ActivityConfig activityConfig ){
        activityConfigDao.insert(activityConfig);
    }

    public void update(ActivityConfig activityConfig) {
        activityConfigDao.update(activityConfig);
    }

    public void delete(Long id){
        activityConfigDao.delete(id);
    }
}
