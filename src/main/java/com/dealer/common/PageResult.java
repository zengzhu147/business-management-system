package com.dealer.common;

import java.util.List;

public class PageResult<T> {
    private List<T> list;
    private Long total;
    private Integer pageNum;
    private Integer pageSize;
    private Integer pages; // 总页数（我帮你加上了）

    // 无参构造
    public PageResult() {
    }

    // 常用构造：自动计算总页数
    public PageResult(List<T> list,long total,Page page) {
        this.list = list;
        this.total = total;
        this.pageNum = page.getPageNum();
        this.pageSize = page.getPageSize();
        // 自动计算总页数
        this.pages = (int) Math.ceil((double) total / pageSize);
    }

    public List<T> getList() {
        return list;
    }

    public void setList(List<T> list) {
        this.list = list;
    }

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }

    public Integer getPageNum() {
        return pageNum;
    }

    public void setPageNum(Integer pageNum) {
        this.pageNum = pageNum;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    // 总页数 getter
    public Integer getPages() {
        return pages;
    }

    // 总页数 setter
    public void setPages(Integer pages) {
        this.pages = pages;
    }
}