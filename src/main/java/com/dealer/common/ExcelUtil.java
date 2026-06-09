package com.dealer.common;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import javax.servlet.http.HttpServletResponse;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;

public class ExcelUtil {
    public static void exportExcel(String fileName, String[] headers, List<Map<String, Object>> dataList, HttpServletResponse response) throws Exception {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet(fileName);

        // 表头
        Row headRow = sheet.createRow(0);
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headRow.createCell(i);
            cell.setCellValue(headers[i]);
        }

        // 数据行
        for (int i = 0; i < dataList.size(); i++) {
            Row row = sheet.createRow(i + 1);
            Map<String, Object> map = dataList.get(i);
            int cellIndex = 0;
            for (String key : map.keySet()) {
                Cell cell = row.createCell(cellIndex++);
                Object val = map.get(key);
                cell.setCellValue(val == null ? "" : val.toString());
            }
        }

        // 响应头
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        String name = URLEncoder.encode(fileName + ".xlsx", "UTF-8");
        response.setHeader("Content-Disposition", "attachment;filename=" + name);

        OutputStream os = response.getOutputStream();
        workbook.write(os);
        os.flush();
        os.close();
        workbook.close();
    }
}