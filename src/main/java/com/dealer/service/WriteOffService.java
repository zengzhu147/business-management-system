/*
package com.dealer.service;

import com.dealer.common.PageResult;
import com.dealer.dao.WriteOffDao;
import com.dealer.entity.WriteOff;
import org.springframework.stereotype.Service;
import javax.annotation.Resource;
import java.util.List;

@Service
public class WriteOffService {
    @Resource
    private WriteOffDao writeOffDao;

    public PageResult<WriteOff> getPage(String dealerName, Integer pageNum, Integer pageSize) {
        PageResult<WriteOff> page = new PageResult<>();
        List<WriteOff> list = writeOffDao.selectPage(dealerName, pageNum, pageSize);
        Long total = writeOffDao.selectCount(dealerName);
        page.setList(list);
        page.setTotal(total);
        page.setPageNum(pageNum);
        page.setPageSize(pageSize);
        return page;
    }

    public int save(WriteOff writeOff) {
        if(writeOff.getId() == null){
            return writeOffDao.insert(writeOff);
        }else{
            return writeOffDao.update(writeOff);
        }
    }

    public int delete(Integer id) {
        return writeOffDao.deleteById(id);
    }

    public WriteOff getById(Integer id) {
        return writeOffDao.selectById(id);
    }
}*/
