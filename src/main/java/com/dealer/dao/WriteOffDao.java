package com.dealer.dao;

import com.dealer.common.Page;
import com.dealer.entity.WriteOff;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface WriteOffDao {
    List<WriteOff> selectPage(Page page);
    long selectCount();

    List<WriteOff> getWriteOffInfo(WriteOff writeOff);

    void insert(WriteOff writeOff);

    void update(WriteOff writeOff);

    void delete(Long id);
}
