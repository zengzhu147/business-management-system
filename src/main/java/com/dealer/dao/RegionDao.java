package com.dealer.dao;
import com.dealer.entity.Region;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface RegionDao {
    List<Region> listByLevel(@Param("level") Integer level);
    List<Region> listByParentCode(@Param("parentCode") String parentCode);
}