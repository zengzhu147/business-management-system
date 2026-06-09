package com.dealer.entity;

import lombok.Data;

@Data
public class Dealer {
    private Integer id; //主键
    private String dealerName; //经销商名称
    private String dealerLeader; //经销商负责人
    private String dealerPhone; //经销商电话
    private String dealerAddress; //经销商地址
    private String seller; //销售人员

    private String provinceCode; // 省编码
    private String provinceName;
    private String cityCode;     // 市编码
    private String cityName;
    private String areaCode;     // 区县编码
    private String areaName;
}