package com.dealer.controller;

import com.dealer.common.Page;
import com.dealer.common.PageResult;
import com.dealer.entity.Activity;
import com.dealer.service.ActivityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/activity")
public class ActivityApiController {

    @Autowired
    private ActivityService activityService;

    private static final Logger log = LoggerFactory.getLogger(ActivityApiController.class);

    @GetMapping("/list")
    public PageResult list(Page page) {
        // 1. 查询分页数据
        PageResult<Activity> pageResult = activityService.page(page);
        return pageResult;
    }

    @GetMapping("/getActivityInfo")
    public List<Activity> getActivityInfo(Activity activity) {
        List<Activity> result = activityService.getActivityInfo(activity);
        return result;
    }



    // 新增接口：接收表单 + 保存 + 刷新列表
    @PostMapping("/add")
    public String add(Activity activity) {
        if(null == activity){
            return  "0";
        }
        log.warn("add data:" + activity.toString());
        // 调用DAO保存数据
        activityService.insert(activity);
        // 重定向到列表页，实现自动刷新
        return "1";
    }

    // 编辑保存
    @PostMapping("/update")
    public String update(Activity activity) {
        log.warn("update info: " + activity.toString());
        activityService.update(activity);
        return "1";
    }

    // 删除
    @GetMapping("/delete")
    public String delete(Long id) {
        activityService.delete(id);
        return "1";
    }
}
