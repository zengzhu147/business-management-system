package com.dealer.entity;

import lombok.Data;

@Data
public class ActivityConfig {
    private Integer id; //主键
    private Integer dealerId; // 经销商ID
    private String dealerName; //经销商名称
    private String activityType; //活动类型
    private String activityComment; //活动备注
}
