package com.dealer.entity;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class Order {
    private Integer id;
    private Integer dealerId; // 经销商ID
    private String dealerName; // 经销商名称
    private Integer productId; // 产品ID
    private String productName; // 产品名称
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date orderDate; // 订单日期
    private Integer quantity; // 销售数量
    private BigDecimal price; // 销售单价
    private BigDecimal totalAmount;  //总金额
    private BigDecimal marketFee; // 计提市场费用
    private Integer giftQuantity; // 随赠品数量
    private BigDecimal expectRate; // 预计投入比例
    private BigDecimal realRate; // 实际投入比例
    private BigDecimal balanceFee; // 市场费用结余
}