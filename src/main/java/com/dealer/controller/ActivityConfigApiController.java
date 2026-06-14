package com.dealer.controller;

import com.dealer.common.Page;
import com.dealer.common.PageResult;
import com.dealer.entity.ActivityConfig;
import com.dealer.service.ActivityConfigService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/activityConfig")
public class ActivityConfigApiController {

    @Autowired
    private ActivityConfigService activityConfigService;

    private static final Logger log = LoggerFactory.getLogger(ActivityConfigApiController.class);

    @GetMapping("/list")
    public PageResult list(Page page) {
        // 1. 查询分页数据
        PageResult<ActivityConfig> pageResult = activityConfigService.page(page);
        return pageResult;
    }

    @GetMapping("/getActivityConfigInfo")
    public List<ActivityConfig> getActivityConfigInfo(ActivityConfig activityConfig) {
        List<ActivityConfig> result = activityConfigService.getActivityConfigInfo(activityConfig);
        return result;
    }



    @GetMapping("/checkActivityType")
    public Boolean checkActivityType(ActivityConfig activityConfig) {
        Boolean isExist = true;
        List<ActivityConfig> result = activityConfigService.getActivityConfigInfo(activityConfig);
        if(result.size() > 0){
            if(null != activityConfig.getId() && null != activityConfig.getActivityType()){
                if(activityConfig.getActivityType().equals(result.get(0).getActivityType())){
                    isExist = false;
                }
            }
        }else {
            ActivityConfig activityConfig1 = new ActivityConfig();
            activityConfig1.setActivityType(activityConfig.getActivityType());
            List<ActivityConfig> result1 = activityConfigService.getActivityConfigInfo(activityConfig1);
            if(result1.size() > 0){
                isExist = true;
            }else {
                isExist = false;
            }
        }
        return isExist;
    }

    @GetMapping("/all")
    public List<ActivityConfig> getAllActivityConfig() {
        // 1. 查询分页数据
        List<ActivityConfig> result = activityConfigService.getAllActivityConfig();
        return result;
    }



    // 新增接口：接收表单 + 保存 + 刷新列表
    @PostMapping("/add")
    public String add(ActivityConfig activityConfig) {
        if(null == activityConfig){
            return  "0";
        }
        log.warn("add data:" + activityConfig.toString());
        // 调用DAO保存数据
        activityConfigService.insert(activityConfig);
        // 重定向到列表页，实现自动刷新
        return "1";
    }

    // 编辑保存
    @PostMapping("/update")
    public String update(ActivityConfig activityConfig) {
        log.warn("update info: " + activityConfig.toString());
        activityConfigService.update(activityConfig);
        return "1";
    }

    // 删除
    @GetMapping("/delete")
    public String delete(Long id) {
        activityConfigService.delete(id);
        return "1";
    }
}
