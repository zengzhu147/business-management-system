package com.dealer.entity;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class Activity {

    private Integer id; //主键
    private Integer activityTypeId; // 活动id
    private Integer dealerId; // 经销商ID
    private String dealerName; //经销商名称
    private String activityType; //活动类型

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date activityTime; //活动时间
    private BigDecimal applyFee; // 申请费用

    private String writeOffStatus; // 核销情况

    private String activityContent; // 活动内容
}
