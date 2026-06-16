package com.dealer.entity;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class WriteOff {
    private Integer id;
    private Integer activityId; // 活动id
    private Integer dealerId;
    private String dealerName;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date writeOffDate; // 核销日期
    private Integer productId; // 产品ID
    private String productName;
    private Integer writeOffQuantity; // 核销数量
    private BigDecimal writeOffPrice; // 核销单价
    private BigDecimal writeOffFee; // 核销费用

}
