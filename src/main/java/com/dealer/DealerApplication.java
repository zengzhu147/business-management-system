package com.dealer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.WebApplicationType;

import java.awt.*;
import java.net.URI;

@SpringBootApplication
public class DealerApplication {
    public static void main(String[] args) {
        // SpringApplication.run(DealerApplication.class, args);
        SpringApplication app = new SpringApplication(DealerApplication.class);
        // 🔥 强制设置为WEB环境（这一句必加）
        app.setWebApplicationType(WebApplicationType.SERVLET);
        app.run(args);
        // 启动后自动打开浏览器
        try {
            String url = "http://localhost:8080/index/indexPage";
            if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                Desktop.getDesktop().browse(new URI(url));
            }
        } catch (Exception e) {
            // 忽略错误
        }

    }
}