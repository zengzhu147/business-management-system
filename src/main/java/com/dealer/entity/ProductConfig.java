package com.dealer.entity;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductConfig {
    private Integer id; // 主键
    private String productName; // 产品名称
    private BigDecimal price; // 产品单价
    private String comment; // 备注
}
