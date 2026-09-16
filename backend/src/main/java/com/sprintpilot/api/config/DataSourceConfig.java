package com.sprintpilot.api.config;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
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

        if (url != null && url.startsWith("postgresql://")) {
            logger.info("Transforming postgresql:// URL for PostgreSQL JDBC format");
            String cleanUrl = url.substring("postgresql://".length());
            int atIndex = cleanUrl.indexOf("@");
            if (atIndex != -1) {
                String userPass = cleanUrl.substring(0, atIndex);
                String hostDb = cleanUrl.substring(atIndex + 1);

                String username = userPass;
                String password = "";
                int colonIndex = userPass.indexOf(":");
                if (colonIndex != -1) {
                    username = userPass.substring(0, colonIndex);
                    password = userPass.substring(colonIndex + 1);
                }

                String jdbcUrl = "jdbc:postgresql://" + hostDb;
                logger.info("Configured JDBC URL: {}", jdbcUrl);

                return DataSourceBuilder.create()
                        .url(jdbcUrl)
                        .username(username)
                        .password(password)
                        .driverClassName("org.postgresql.Driver")
                        .build();
            }
        }

        if (url != null && url.startsWith("postgres://")) {
            logger.info("Transforming postgres:// URL for PostgreSQL JDBC format");
            String cleanUrl = url.substring("postgres://".length());
            int atIndex = cleanUrl.indexOf("@");
            if (atIndex != -1) {
                String userPass = cleanUrl.substring(0, atIndex);
                String hostDb = cleanUrl.substring(atIndex + 1);

                String username = userPass;
                String password = "";
                int colonIndex = userPass.indexOf(":");
                if (colonIndex != -1) {
                    username = userPass.substring(0, colonIndex);
                    password = userPass.substring(colonIndex + 1);
                }

                String jdbcUrl = "jdbc:postgresql://" + hostDb;
                logger.info("Configured JDBC URL: {}", jdbcUrl);

                return DataSourceBuilder.create()
                        .url(jdbcUrl)
                        .username(username)
                        .password(password)
                        .driverClassName("org.postgresql.Driver")
                        .build();
            }
        }

        return properties.initializeDataSourceBuilder().type(HikariDataSource.class).build();
    }
}
