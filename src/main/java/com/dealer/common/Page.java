package com.dealer.common;

import lombok.Data;

@Data
public class Page {
    private Integer pageNum = 1;
    private Integer pageSize = 10;

    public Integer getStart() {
        return (pageNum - 1) * pageSize;
    }
}