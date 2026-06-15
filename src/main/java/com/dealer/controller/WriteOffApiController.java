package com.dealer.controller;

import com.dealer.common.Page;
import com.dealer.common.PageResult;
import com.dealer.entity.WriteOff;
import com.dealer.service.WriteOffService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/writeOff")
public class WriteOffApiController {
    @Autowired
    private WriteOffService writeOffService;

    private static final Logger log = LoggerFactory.getLogger(WriteOffApiController.class);

    @GetMapping("/list")
    public PageResult list(Page page) {
        // 1. 查询分页数据
        PageResult<WriteOff> pageResult = writeOffService.page(page);
        return pageResult;
    }

    @GetMapping("/getWriteOffInfo")
    public List<WriteOff> getWriteOffInfo(WriteOff writeOff) {
        List<WriteOff> result = writeOffService.getWriteOffInfo(writeOff);
        return result;
    }



    // 新增接口：接收表单 + 保存 + 刷新列表
    @PostMapping("/add")
    public String add(WriteOff writeOff) {
        if(null == writeOff){
            return  "0";
        }
        log.warn("add data:" + writeOff.toString());
        // 调用DAO保存数据
        writeOffService.insert(writeOff);
        // 重定向到列表页，实现自动刷新
        return "1";
    }

    // 编辑保存
    @PostMapping("/update")
    public String update(WriteOff writeOff) {
        log.warn("update info: " + writeOff.toString());
        writeOffService.update(writeOff);
        return "1";
    }

    // 删除
    @GetMapping("/delete")
    public String delete(Long id) {
        writeOffService.delete(id);
        return "1";
    }
}
