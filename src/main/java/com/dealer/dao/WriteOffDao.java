/*
package com.dealer.dao;

import com.dealer.entity.WriteOff;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import javax.annotation.Resource;
import java.util.List;

@Repository
public class WriteOffDao {
    @Resource
    private JdbcTemplate jdbcTemplate;

    public List<WriteOff> selectPage(String dealerName, Integer pageNum, Integer pageSize) {
        StringBuilder sql = new StringBuilder(
                "SELECT w.id,w.dealer_id,d.dealer_name,w.batch_no,w.amount " +
                        "FROM write_off w LEFT JOIN dealer d ON w.dealer_id = d.id WHERE 1=1 ");
        List<Object> params = new java.util.ArrayList<>();
        if (dealerName != null && !"".equals(dealerName)) {
            sql.append(" AND d.dealer_name LIKE ? ");
            params.add("%" + dealerName + "%");
        }
        sql.append(" LIMIT ?,? ");
        params.add((pageNum - 1) * pageSize);
        params.add(pageSize);
        return jdbcTemplate.query(sql.toString(), params.toArray(), new BeanPropertyRowMapper<>(WriteOff.class));
    }

    public Long selectCount(String dealerName) {
        StringBuilder sql = new StringBuilder(
                "SELECT COUNT(*) FROM write_off w LEFT JOIN dealer d ON w.dealer_id = d.id WHERE 1=1 ");
        List<Object> params = new java.util.ArrayList<>();
        if (dealerName != null && !"".equals(dealerName)) {
            sql.append(" AND d.dealer_name LIKE ? ");
            params.add("%" + dealerName + "%");
        }
        return jdbcTemplate.queryForObject(sql.toString(), params.toArray(), Long.class);
    }

    public int insert(WriteOff writeOff) {
        String sql = "INSERT INTO write_off(dealer_id,batch_no,amount) VALUES(?,?,?)";
        return jdbcTemplate.update(sql,
                writeOff.getDealerId(),
                writeOff.getBatchNo(),
                writeOff.getAmount());
    }

    public int deleteById(Integer id) {
        String sql = "DELETE FROM write_off WHERE id=?";
        return jdbcTemplate.update(sql, id);
    }

    public int update(WriteOff writeOff) {
        String sql = "UPDATE write_off SET dealer_id=?,batch_no=?,amount=? WHERE id=?";
        return jdbcTemplate.update(sql,
                writeOff.getDealerId(),
                writeOff.getBatchNo(),
                writeOff.getAmount(),
                writeOff.getId());
    }

    public WriteOff selectById(Integer id) {
        String sql = "SELECT * FROM write_off WHERE id=?";
        List<WriteOff> list = jdbcTemplate.query(sql, new Object[]{id}, new BeanPropertyRowMapper<>(WriteOff.class));
        return list.isEmpty() ? null : list.get(0);
    }
}*/
