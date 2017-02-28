package com.dudu;

import com.dudu.domain.ConfigBean;
import com.dudu.domain.ConfigTestBean;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({ConfigBean.class, ConfigTestBean.class})
public class Chapter2Application {

	public static void main(String[] args) {
		SpringApplication.run(Chapter2Application.class, args);
	}
}
