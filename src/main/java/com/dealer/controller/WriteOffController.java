/*
package com.dealer.controller;

import com.dealer.common.ExcelUtil;
import com.dealer.common.PageResult;
import com.dealer.entity.Dealer;
import com.dealer.entity.WriteOff;
import com.dealer.service.DealerService;
import com.dealer.service.WriteOffService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/writeoff")
public class WriteOffController {
    @Resource
    private WriteOffService writeOffService;
    @Resource
    private DealerService dealerService;

    private static final Integer PAGE_SIZE = 10;

    @GetMapping
    public String index(String dealerName, Integer pageNum, Model model) {
        if(pageNum == null) pageNum = 1;
        PageResult<WriteOff> page = writeOffService.getPage(dealerName, pageNum, PAGE_SIZE);
        List<Dealer> dealerList = dealerService.getAllDealer();
        model.addAttribute("page", page);
        model.addAttribute("dealerList", dealerList);
        model.addAttribute("dealerName", dealerName);
        return "writeoff";
    }

    @PostMapping("/save")
    public String save(WriteOff writeOff) {
        writeOffService.save(writeOff);
        return "redirect:/writeoff";
    }

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable Integer id) {
        writeOffService.delete(id);
        return "redirect:/writeoff";
    }

    @GetMapping("/export")
    public void export(String dealerName, HttpServletResponse response) throws Exception {
        PageResult<WriteOff> page = writeOffService.getPage(dealerName, 1, Integer.MAX_VALUE);
        List<Map<String, Object>> dataList = new ArrayList<>();
        for(WriteOff w : page.getList()){
            Map<String,Object> map = new HashMap<>();
            map.put("经销商名称",w.getDealerName());
            map.put("核销批次号",w.getBatchNo());
            map.put("核销金额",w.getAmount());
            dataList.add(map);
        }
        String[] headers = {"经销商名称","核销批次号","核销金额"};
        ExcelUtil.exportExcel("核销信息", headers, dataList, response);
    }
}*/
