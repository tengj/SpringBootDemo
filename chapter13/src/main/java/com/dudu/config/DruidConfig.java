package com.dudu.config;

import com.alibaba.druid.filter.Filter;
import com.alibaba.druid.filter.stat.StatFilter;
import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.support.http.StatViewServlet;
import com.alibaba.druid.support.http.WebStatFilter;
import com.alibaba.druid.wall.WallConfig;
import com.alibaba.druid.wall.WallFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.List;

/**
 * Druid配置
 *
 * @author dudu
 * @date 2017-12-11 0:00
 */
@Configuration
public class DruidConfig {
    private Logger logger = LoggerFactory.getLogger(DruidConfig.class);

    @Value("${spring.datasource.url:#{null}}")
    private String dbUrl;
    @Value("${spring.datasource.username: #{null}}")
    private String username;
    @Value("${spring.datasource.password:#{null}}")
    private String password;
    @Value("${spring.datasource.driverClassName:#{null}}")
    private String driverClassName;
    @Value("${spring.datasource.initialSize:#{null}}")
    private Integer initialSize;
    @Value("${spring.datasource.minIdle:#{null}}")
    private Integer minIdle;
    @Value("${spring.datasource.maxActive:#{null}}")
    private Integer maxActive;
    @Value("${spring.datasource.maxWait:#{null}}")
    private Integer maxWait;
    @Value("${spring.datasource.timeBetweenEvictionRunsMillis:#{null}}")
    private Integer timeBetweenEvictionRunsMillis;
    @Value("${spring.datasource.minEvictableIdleTimeMillis:#{null}}")
    private Integer minEvictableIdleTimeMillis;
    @Value("${spring.datasource.validationQuery:#{null}}")
    private String validationQuery;
    @Value("${spring.datasource.testWhileIdle:#{null}}")
    private Boolean testWhileIdle;
    @Value("${spring.datasource.testOnBorrow:#{null}}")
    private Boolean testOnBorrow;
    @Value("${spring.datasource.testOnReturn:#{null}}")
    private Boolean testOnReturn;
    @Value("${spring.datasource.poolPreparedStatements:#{null}}")
    private Boolean poolPreparedStatements;
    @Value("${spring.datasource.maxPoolPreparedStatementPerConnectionSize:#{null}}")
    private Integer maxPoolPreparedStatementPerConnectionSize;
    @Value("${spring.datasource.filters:#{null}}")
    private String filters;
    @Value("{spring.datasource.connectionProperties:#{null}}")
    private String connectionProperties;

    @Bean
    @Primary
    public DataSource dataSource(){
        DruidDataSource datasource = new DruidDataSource();

        datasource.setUrl(this.dbUrl);
        datasource.setUsername(username);
        datasource.setPassword(password);
        datasource.setDriverClassName(driverClassName);
        //configuration
        if(initialSize != null) {
            datasource.setInitialSize(initialSize);
        }
        if(minIdle != null) {
            datasource.setMinIdle(minIdle);
        }
        if(maxActive != null) {
            datasource.setMaxActive(maxActive);
        }
        if(maxWait != null) {
            datasource.setMaxWait(maxWait);
        }
        if(timeBetweenEvictionRunsMillis != null) {
            datasource.setTimeBetweenEvictionRunsMillis(timeBetweenEvictionRunsMillis);
        }
        if(minEvictableIdleTimeMillis != null) {
            datasource.setMinEvictableIdleTimeMillis(minEvictableIdleTimeMillis);
        }
        if(validationQuery!=null) {
            datasource.setValidationQuery(validationQuery);
        }
        if(testWhileIdle != null) {
            datasource.setTestWhileIdle(testWhileIdle);
        }
        if(testOnBorrow != null) {
            datasource.setTestOnBorrow(testOnBorrow);
        }
        if(testOnReturn != null) {
            datasource.setTestOnReturn(testOnReturn);
        }
        if(poolPreparedStatements != null) {
            datasource.setPoolPreparedStatements(poolPreparedStatements);
        }
        if(maxPoolPreparedStatementPerConnectionSize != null) {
            datasource.setMaxPoolPreparedStatementPerConnectionSize(maxPoolPreparedStatementPerConnectionSize);
        }

        if(connectionProperties != null) {
            datasource.setConnectionProperties(connectionProperties);
        }

        List<Filter> filters = new ArrayList<>();
        filters.add(statFilter());
        filters.add(wallFilter());
        datasource.setProxyFilters(filters);

        return datasource;
    }

    @Bean
    public ServletRegistrationBean druidServlet() {
        ServletRegistrationBean servletRegistrationBean = new ServletRegistrationBean(new StatViewServlet(), "/druid/*");

        //控制台管理用户，加入下面2行 进入druid后台就需要登录
        servletRegistrationBean.addInitParameter("loginUsername", "admin");
        servletRegistrationBean.addInitParameter("loginPassword", "admin");
        return servletRegistrationBean;
    }

    @Bean
    public FilterRegistrationBean filterRegistrationBean() {
        FilterRegistrationBean filterRegistrationBean = new FilterRegistrationBean();
        filterRegistrationBean.setFilter(new WebStatFilter());
        filterRegistrationBean.addUrlPatterns("/*");
        filterRegistrationBean.addInitParameter("exclusions", "*.js,*.gif,*.jpg,*.png,*.css,*.ico,/druid/*");
        filterRegistrationBean.addInitParameter("profileEnable", "true");
        return filterRegistrationBean;
    }

    @Bean
    public StatFilter statFilter(){
        StatFilter statFilter = new StatFilter();
        statFilter.setLogSlowSql(true); //slowSqlMillis用来配置SQL慢的标准，执行时间超过slowSqlMillis的就是慢。
        statFilter.setMergeSql(true); //SQL合并配置
        statFilter.setSlowSqlMillis(1000);//slowSqlMillis的缺省值为3000，也就是3秒。
        return statFilter;
    }

    @Bean
    public WallFilter wallFilter(){
        WallFilter wallFilter = new WallFilter();
        //允许执行多条SQL
        WallConfig config = new WallConfig();
        config.setMultiStatementAllow(true);
        wallFilter.setConfig(config);
        return wallFilter;
    }
}
