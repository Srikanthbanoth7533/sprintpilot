package com.sprintpilot.api.config;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {
    private static final Logger logger = LoggerFactory.getLogger(DataSourceConfig.class);

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSourceProperties dataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties, Environment env) {
        String url = properties.getUrl();
        if (url == null || url.isBlank()) {
            url = env.getProperty("SPRING_DATASOURCE_URL");
        }
        if (url == null || url.isBlank()) {
            url = env.getProperty("DATABASE_URL");
        }

        if (url != null && !url.isBlank()) {
            // Render / Cloud database connection strings often start with postgres:// or postgresql://
            // JDBC driver requires jdbc:postgresql://
            if (url.startsWith("postgres://")) {
                url = "jdbc:postgresql://" + url.substring("postgres://".length());
                logger.info("Transformed postgres:// URL to JDBC format: {}", sanitizeUrl(url));
            } else if (url.startsWith("postgresql://")) {
                url = "jdbc:postgresql://" + url.substring("postgresql://".length());
                logger.info("Transformed postgresql:// URL to JDBC format: {}", sanitizeUrl(url));
            }
            properties.setUrl(url);
        }

        return properties.initializeDataSourceBuilder().type(HikariDataSource.class).build();
    }

    private String sanitizeUrl(String url) {
        if (url == null) return null;
        // Mask credentials in logs
        return url.replaceAll(":[^/@:]+@", ":***@");
    }
}
