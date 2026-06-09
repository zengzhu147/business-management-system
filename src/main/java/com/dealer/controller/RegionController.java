package com.dealer.controller;
import com.dealer.entity.Region;
import com.dealer.service.RegionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/region")
public class RegionController {

    private final RegionService regionService;

    public RegionController(RegionService regionService) {
        this.regionService = regionService;
    }

    // 获取省
    @GetMapping("/provinces")
    public List<Region> provinces() {
        return regionService.listByLevel(1);
    }

    // 获取市
    @GetMapping("/cities")
    public List<Region> cities(@RequestParam String provinceCode) {
        return regionService.listByParentCode(provinceCode);
    }

    // 获取区县
    @GetMapping("/areas")
    public List<Region> areas(@RequestParam String cityCode) {
        return regionService.listByParentCode(cityCode);
    }
}