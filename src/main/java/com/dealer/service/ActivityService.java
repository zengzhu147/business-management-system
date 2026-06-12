package com.dealer.service;

import com.dealer.common.Page;
import com.dealer.common.PageResult;
import com.dealer.dao.ActivityDao;
import com.dealer.entity.Activity;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class ActivityService {
    @Resource
    private ActivityDao activityDao;

    public PageResult<Activity> page(Page page) {
        // 查询数据列表
        List<Activity> list = activityDao.selectPage(page);
        // 查询总条数
        long total = activityDao.selectCount();
        // 封装返回
        PageResult<Activity> result = new PageResult(list,total,page);
        return result;
    }

    public List<Activity> getActivityInfo(Activity activity) {
        List<Activity> result = activityDao.getActivityInfo(activity);
        return result;
    }

    public void insert(Activity activity ){
        activityDao.insert(activity);
    }

    public void update(Activity activity) {
        activityDao.update(activity);
    }

    public void delete(Long id){
        activityDao.delete(id);
    }
}
