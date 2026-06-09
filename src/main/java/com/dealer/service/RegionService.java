package com.dealer.service;

import com.dealer.dao.RegionDao;
import com.dealer.entity.Region;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class RegionService {
    @Resource
    private RegionDao regionDao;

    public List<Region> listByLevel(Integer level){
        return regionDao.listByLevel(level);
    }

    public List<Region> listByParentCode( String parentCode){
        return regionDao.listByParentCode(parentCode);
    }
}
