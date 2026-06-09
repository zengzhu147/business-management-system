package com.dealer.entity;
import lombok.Data;
@Data
public class Region {
    private Long id;
    private String code;
    private String name;
    private String parentCode;
    private Integer level;
}