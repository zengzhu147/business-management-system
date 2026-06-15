package com.dealer.service;

import com.dealer.common.Page;
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

    public PageResult<WriteOff> page(Page page) {
        // 查询数据列表
        List<WriteOff> list = writeOffDao.selectPage(page);
        // 查询总条数
        long total = writeOffDao.selectCount();
        // 封装返回
        PageResult<WriteOff> result = new PageResult(list,total,page);
        return result;
    }

    public List<WriteOff> getWriteOffInfo(WriteOff writeOff) {
        List<WriteOff> result = writeOffDao.getWriteOffInfo(writeOff);
        return result;
    }

    public void insert(WriteOff writeOff ){
        writeOffDao.insert(writeOff);
    }

    public void update(WriteOff writeOff) {
        writeOffDao.update(writeOff);
    }

    public void delete(Long id){
        writeOffDao.delete(id);
    }
}
